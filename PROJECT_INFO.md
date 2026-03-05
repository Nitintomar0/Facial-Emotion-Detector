# Emotion Detection CNN Project - Setup Guide

## Project Overview
This is a real-time emotion detection system using Convolutional Neural Networks (CNN) built with Keras/TensorFlow. The system detects facial emotions from webcam feed and classifies them into 7 categories.

## Emotion Categories Detected
1. **Angry**
2. **Disgust**
3. **Fear**
4. **Happy**
5. **Neutral**
6. **Sad**
7. **Surprise**

## Required Dependencies

### Python Libraries
All dependencies are listed in `requirements.txt`:
- **tensorflow** (>=2.13.0) - Deep learning framework
- **opencv-python** (>=4.8.0) - Computer vision library for face detection and video processing
- **numpy** (>=1.23.0) - Numerical computing
- **pandas** (>=1.5.0) - Data manipulation (used in training notebook)
- **matplotlib** (>=3.7.0) - Plotting and visualization
- **seaborn** (>=0.12.0) - Statistical data visualization

### Installation Command
```bash
pip3 install -r requirements.txt
```

## APIs and External Resources

### 1. **Kaggle Dataset API**
- **Dataset**: Face Expression Recognition Dataset
- **Link**: https://www.kaggle.com/jonathanoheix/face-expression-recognition-dataset
- **Purpose**: Training data for the CNN model
- **Contains**: 
  - Training images: 28,821 images across 7 emotion classes
  - Validation images: 7,066 images across 7 emotion classes
  - Image size: 48x48 pixels, grayscale

**To download the dataset:**
1. Install Kaggle API: `pip3 install kaggle`
2. Set up Kaggle API credentials (download from Kaggle account settings)
3. Download dataset: `kaggle datasets download -d jonathanoheix/face-expression-recognition-dataset`

### 2. **OpenCV Haar Cascade Classifier**
- **File**: `haarcascade_frontalface_default.xml` (already included in project)
- **Purpose**: Pre-trained face detection model
- **Source**: OpenCV's pre-trained models
- **Function**: Detects faces in video frames before emotion classification

### 3. **Webcam/Camera API**
- **Library**: OpenCV's VideoCapture
- **Purpose**: Real-time video capture from system camera
- **Usage**: `cv2.VideoCapture(0)` - accesses default webcam
- **Note**: Requires camera permissions on macOS

## Project Files

### Core Files
1. **main.py** - Real-time emotion detection application
   - Captures webcam feed
   - Detects faces using Haar Cascade
   - Classifies emotions using trained model
   - Displays results in real-time

2. **model.h5** - Pre-trained CNN model (15.4 MB)
   - 4 Convolutional layers with BatchNormalization
   - 2 Fully connected layers
   - Trained for 48 epochs
   - Validation accuracy: ~60%

3. **haarcascade_frontalface_default.xml** - Face detection classifier

4. **emotion-classification-cnn-using-keras.ipynb** - Training notebook
   - Model architecture definition
   - Training pipeline
   - Data augmentation
   - Performance visualization

## Model Architecture

### CNN Layers:
- **Layer 1**: Conv2D(64, 3x3) → BatchNorm → ReLU → MaxPool → Dropout(0.25)
- **Layer 2**: Conv2D(128, 5x5) → BatchNorm → ReLU → MaxPool → Dropout(0.25)
- **Layer 3**: Conv2D(512, 3x3) → BatchNorm → ReLU → MaxPool → Dropout(0.25)
- **Layer 4**: Conv2D(512, 3x3) → BatchNorm → ReLU → MaxPool → Dropout(0.25)

### Fully Connected Layers:
- **FC1**: Dense(256) → BatchNorm → ReLU → Dropout(0.25)
- **FC2**: Dense(512) → BatchNorm → ReLU → Dropout(0.25)
- **Output**: Dense(7, softmax) - 7 emotion classes

### Training Configuration:
- **Optimizer**: Adam (learning rate: 0.001, then 0.0001)
- **Loss**: Categorical Crossentropy
- **Batch Size**: 128
- **Epochs**: 48
- **Callbacks**: 
  - ModelCheckpoint (saves best model)
  - EarlyStopping (patience: 3)
  - ReduceLROnPlateau (reduces learning rate on plateau)

## Running the Application

### Prerequisites:
1. Install all dependencies: `pip3 install -r requirements.txt`
2. Ensure webcam is connected and accessible
3. Grant camera permissions if prompted (macOS)

### Run Command:
```bash
cd /Users/nitintomar/Desktop/Emotion_Detection_CNN-main
python3 main.py
```

### Controls:
- Press **'q'** to quit the application
- The application will display:
  - Live webcam feed
  - Yellow rectangles around detected faces
  - Green text labels showing detected emotions

## No External API Keys Required

This project **does not require any API keys** or external service authentication. All processing is done locally:
- Face detection: Local Haar Cascade classifier
- Emotion classification: Local pre-trained model (model.h5)
- Video processing: Local OpenCV library

## System Requirements

- **OS**: macOS (current setup), Windows, or Linux
- **Python**: 3.9+ recommended
- **RAM**: 4GB minimum (8GB recommended for training)
- **Webcam**: Required for real-time detection
- **Storage**: ~500MB for dependencies + dataset (if training)

## Troubleshooting

### Camera Access Issues (macOS):
- Go to System Preferences → Security & Privacy → Camera
- Enable camera access for Terminal/Python

### Import Errors:
- Ensure all dependencies are installed: `pip3 list`
- Try upgrading pip: `pip3 install --upgrade pip`

### Model Loading Issues:
- Verify `model.h5` exists in project directory
- Check file is not corrupted (should be ~15.4 MB)

## Notes

- The model is already trained and included (`model.h5`)
- You don't need to run the training notebook unless you want to retrain
- Training requires downloading the Kaggle dataset (~300MB)
- Real-time detection works best with good lighting conditions
- Face should be clearly visible and front-facing for best results
