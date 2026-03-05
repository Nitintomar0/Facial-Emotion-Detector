import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow warnings

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import cv2
import numpy as np
import sys
import time

# Load face classifier
face_classifier = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
if face_classifier.empty():
    print("Error: Could not load haarcascade_frontalface_default.xml")
    sys.exit(1)

# Load emotion detection model
print("Loading emotion detection model...")
classifier = load_model('model.h5', compile=False)
print("Model loaded successfully!")

emotion_labels = ['Angry','Disgust','Fear','Happy','Neutral', 'Sad', 'Surprise']

# Initialize camera
print("\nInitializing camera...")
print("NOTE: If prompted, please allow camera access in System Preferences.")
cap = cv2.VideoCapture(0)

# Wait for camera to initialize
time.sleep(2)

# Check if camera opened successfully
if not cap.isOpened():
    print("\n" + "="*70)
    print("ERROR: Cannot access camera!")
    print("="*70)
    print("\nPossible solutions:")
    print("1. Grant camera permissions:")
    print("   - Go to: System Preferences → Security & Privacy → Camera")
    print("   - Enable camera access for Terminal or Python")
    print("\n2. Check if another application is using the camera")
    print("\n3. Try running the command again after granting permissions")
    print("\n4. Restart Terminal after granting permissions")
    print("="*70)
    sys.exit(1)

print("Camera initialized successfully!")
print("\nStarting emotion detection...")
print("Press 'q' to quit\n")

while True:
    ret, frame = cap.read()
    
    # Check if frame was read successfully
    if not ret or frame is None:
        print("Error: Failed to capture frame from camera")
        break
    
    labels = []
    gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray)

    for (x,y,w,h) in faces:
        cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,255),2)
        roi_gray = gray[y:y+h,x:x+w]
        roi_gray = cv2.resize(roi_gray,(48,48),interpolation=cv2.INTER_AREA)



        if np.sum([roi_gray])!=0:
            roi = roi_gray.astype('float')/255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi,axis=0)

            prediction = classifier.predict(roi, verbose=0)[0]
            label = emotion_labels[prediction.argmax()]
            label_position = (x,y)
            cv2.putText(frame,label,label_position,cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
        else:
            cv2.putText(frame,'No Faces',(30,80),cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
    cv2.imshow('Emotion Detector',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()