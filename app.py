import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import cv2
import numpy as np
import base64
from datetime import datetime
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')
supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load models
print("Loading emotion detection model...")
face_classifier = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
emotion_classifier = load_model('model.h5', compile=False)
print("Model loaded successfully!")

emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

def detect_emotions_in_frame(frame):
    """Detect emotions in a single frame"""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    results = []
    
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
        
        if np.sum([roi_gray]) != 0:
            roi = roi_gray.astype('float') / 255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)
            
            prediction = emotion_classifier.predict(roi, verbose=0)[0]
            emotion_idx = prediction.argmax()
            emotion = emotion_labels[emotion_idx]
            confidence = float(prediction[emotion_idx])
            
            # Get all emotion probabilities
            emotion_probabilities = {
                emotion_labels[i]: float(prediction[i]) 
                for i in range(len(emotion_labels))
            }
            
            results.append({
                'emotion': emotion,
                'confidence': confidence,
                'bbox': {'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h)},
                'probabilities': emotion_probabilities
            })
    
    return results

@app.route('/')
def serve():
    """Serve React frontend"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'supabase_connected': supabase is not None
    })

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    """Analyze emotion in uploaded image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        # Read image
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid image format'}), 400
        
        # Detect emotions
        results = detect_emotions_in_frame(frame)
        
        # Draw rectangles and labels on image
        for result in results:
            bbox = result['bbox']
            x, y, w, h = bbox['x'], bbox['y'], bbox['w'], bbox['h']
            emotion = result['emotion']
            confidence = result['confidence']
            
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
            label = f"{emotion} ({confidence*100:.1f}%)"
            cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        
        # Encode processed image to base64
        _, buffer = cv2.imencode('.jpg', frame)
        processed_image = base64.b64encode(buffer).decode('utf-8')
        
        # Save to database if user is authenticated
        user_id = request.form.get('user_id')
        if user_id and supabase:
            try:
                supabase.table('emotion_analyses').insert({
                    'user_id': user_id,
                    'analysis_type': 'image',
                    'results': json.dumps(results),
                    'timestamp': datetime.utcnow().isoformat()
                }).execute()
            except Exception as e:
                print(f"Error saving to database: {e}")
        
        return jsonify({
            'success': True,
            'faces_detected': len(results),
            'results': results,
            'processed_image': processed_image
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-video', methods=['POST'])
def analyze_video():
    """Analyze emotion in uploaded video"""
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video provided'}), 400
        
        file = request.files['video']
        
        # Save video temporarily
        temp_path = 'temp_video.mp4'
        file.save(temp_path)
        
        # Open video
        cap = cv2.VideoCapture(temp_path)
        
        all_results = []
        frame_count = 0
        sample_rate = 10  # Analyze every 10th frame
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % sample_rate == 0:
                results = detect_emotions_in_frame(frame)
                if results:
                    all_results.extend(results)
            
            frame_count += 1
        
        cap.release()
        os.remove(temp_path)
        
        # Aggregate results
        if all_results:
            emotion_counts = {}
            total_confidence = 0
            
            for result in all_results:
                emotion = result['emotion']
                emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
                total_confidence += result['confidence']
            
            dominant_emotion = max(emotion_counts, key=emotion_counts.get)
            avg_confidence = total_confidence / len(all_results)
            
            summary = {
                'dominant_emotion': dominant_emotion,
                'average_confidence': avg_confidence,
                'emotion_distribution': emotion_counts,
                'total_faces_detected': len(all_results),
                'frames_analyzed': frame_count // sample_rate
            }
        else:
            summary = {
                'dominant_emotion': None,
                'average_confidence': 0,
                'emotion_distribution': {},
                'total_faces_detected': 0,
                'frames_analyzed': frame_count // sample_rate
            }
        
        # Save to database if user is authenticated
        user_id = request.form.get('user_id')
        if user_id and supabase:
            try:
                supabase.table('emotion_analyses').insert({
                    'user_id': user_id,
                    'analysis_type': 'video',
                    'results': json.dumps(summary),
                    'timestamp': datetime.utcnow().isoformat()
                }).execute()
            except Exception as e:
                print(f"Error saving to database: {e}")
        
        return jsonify({
            'success': True,
            'summary': summary
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-frame', methods=['POST'])
def analyze_frame():
    """Analyze emotion in a single frame from webcam"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid image format'}), 400
        
        # Detect emotions
        results = detect_emotions_in_frame(frame)
        
        return jsonify({
            'success': True,
            'results': results
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics/<user_id>', methods=['GET'])
def get_statistics(user_id):
    """Get user statistics"""
    try:
        if not supabase:
            return jsonify({'error': 'Database not configured'}), 500
        
        # Fetch user's emotion analyses
        response = supabase.table('emotion_analyses').select('*').eq('user_id', user_id).execute()
        
        analyses = response.data
        
        if not analyses:
            return jsonify({
                'total_analyses': 0,
                'emotion_distribution': {},
                'analyses_by_type': {'image': 0, 'video': 0, 'live': 0},
                'recent_analyses': []
            })
        
        # Calculate statistics
        emotion_counts = {}
        analyses_by_type = {'image': 0, 'video': 0, 'live': 0}
        
        for analysis in analyses:
            analysis_type = analysis.get('analysis_type', 'live')
            analyses_by_type[analysis_type] = analyses_by_type.get(analysis_type, 0) + 1
            
            results = json.loads(analysis.get('results', '[]'))
            
            if isinstance(results, list):
                for result in results:
                    emotion = result.get('emotion')
                    if emotion:
                        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
            elif isinstance(results, dict):
                emotion_dist = results.get('emotion_distribution', {})
                for emotion, count in emotion_dist.items():
                    emotion_counts[emotion] = emotion_counts.get(emotion, 0) + count
        
        # Get recent analyses
        recent = sorted(analyses, key=lambda x: x.get('timestamp', ''), reverse=True)[:10]
        
        return jsonify({
            'total_analyses': len(analyses),
            'emotion_distribution': emotion_counts,
            'analyses_by_type': analyses_by_type,
            'recent_analyses': recent
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-analysis', methods=['POST'])
def save_analysis():
    """Save live analysis results"""
    try:
        if not supabase:
            return jsonify({'error': 'Database not configured'}), 500
        
        data = request.json
        user_id = data.get('user_id')
        results = data.get('results')
        
        if not user_id or not results:
            return jsonify({'error': 'Missing required fields'}), 400
        
        supabase.table('emotion_analyses').insert({
            'user_id': user_id,
            'analysis_type': 'live',
            'results': json.dumps(results),
            'timestamp': datetime.utcnow().isoformat()
        }).execute()
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚀 Emotion Detection Web App Starting...")
    print("="*70)
    print(f"✅ Model loaded: {emotion_classifier is not None}")
    print(f"✅ Face detector loaded: {not face_classifier.empty()}")
    print(f"✅ Supabase connected: {supabase is not None}")
    print("="*70)
    print("\n📡 Server running on: http://localhost:5000")
    print("Press CTRL+C to stop\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
