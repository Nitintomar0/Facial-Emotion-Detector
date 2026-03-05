# 🎭 Emotion Detection Web Application

> **Full-stack web application for real-time facial emotion recognition using CNN and React**

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![React](https://img.shields.io/badge/react-18.2-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### ✨ Core Functionality
- 🎥 **Live Camera Analysis** - Real-time emotion detection from webcam
- 📸 **Image Upload** - Analyze emotions in uploaded images with multiple face detection
- 🎬 **Video Upload** - Process videos and get emotion distribution statistics
- 📊 **Statistics Dashboard** - Track your emotion detection history with interactive charts
- 🔐 **Authentication** - Secure login with Supabase (optional guest mode available)
- 📈 **Confidence Levels** - View prediction confidence for all 7 emotions

### 🎨 User Interface
- Modern gradient design with purple theme
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive navigation
- Real-time visual feedback

### 🧠 AI Capabilities
- Detects 7 emotions: **Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise**
- Multiple face detection in single image/frame
- Confidence scores for each prediction
- Probability distribution for all emotions
- Pre-trained CNN model included

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+ and npm
- Webcam (for live analysis)
- Supabase account (optional)

### Installation

1. **Install Backend Dependencies**
   ```bash
   pip3 install -r backend_requirements.txt
   ```

2. **Install Node.js** (if not installed)
   ```bash
   brew install node
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Supabase** (Optional - skip for guest mode)
   - Create account at https://supabase.com
   - Copy `.env.example` to `.env` and add credentials
   - See `INSTALLATION_GUIDE.md` for detailed steps

### Running the App

**Terminal 1 - Backend:**
```bash
./start_backend.sh
# Or: python3 app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
./start_frontend.sh
# Or: npm start
```

**Open browser:** http://localhost:3000

## 📖 Documentation

- **`INSTALLATION_GUIDE.md`** - Complete installation instructions
- **`WEB_APP_SETUP.md`** - Detailed setup and configuration guide
- **`PROJECT_INFO.md`** - Original project documentation
- **`CAMERA_SETUP.md`** - Camera permissions help

## 🎯 Usage

### 1. Login
- Sign up/login with Supabase authentication
- Or click "Continue as Guest" for instant access

### 2. Live Analysis
- Navigate to "Live Analysis"
- Click "Start Live Analysis"
- Grant camera permissions
- See real-time emotion detection with bounding boxes
- View confidence levels for all emotions
- Save results to track history

### 3. Upload Files
- Navigate to "Upload"
- Drag & drop or click to select image/video
- Click "Analyze"
- View results with confidence levels

### 4. View Statistics
- Navigate to "Statistics"
- See total analyses, most common emotion
- Interactive bar and pie charts
- Recent analyses history

## 🏗️ Architecture

### Backend (Flask)
```
app.py
├── /api/health              - Health check
├── /api/analyze-image       - Image analysis
├── /api/analyze-video       - Video analysis
├── /api/analyze-frame       - Live frame analysis
├── /api/statistics/<id>     - User statistics
└── /api/save-analysis       - Save results
```

### Frontend (React)
```
src/
├── pages/
│   ├── Login.js            - Authentication
│   ├── Dashboard.js        - Home page
│   ├── LiveAnalysis.js     - Webcam analysis
│   ├── UploadAnalysis.js   - File upload
│   └── Statistics.js       - Stats dashboard
├── components/
│   └── Navbar.js           - Navigation
└── utils/
    └── supabase.js         - Auth client
```

## 🛠️ Technology Stack

### Backend
- **Flask** - Web framework
- **TensorFlow/Keras** - Deep learning
- **OpenCV** - Computer vision
- **Supabase** - Authentication & database
- **Python-dotenv** - Environment config

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **CSS3** - Styling

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/analyze-image` | POST | Analyze uploaded image |
| `/api/analyze-video` | POST | Analyze uploaded video |
| `/api/analyze-frame` | POST | Analyze single frame |
| `/api/statistics/<user_id>` | GET | Get user statistics |
| `/api/save-analysis` | POST | Save analysis results |

## 🎨 Screenshots

### Dashboard
Beautiful landing page with feature cards and emotion information

### Live Analysis
Real-time webcam feed with emotion detection and confidence levels

### Upload Analysis
Drag & drop interface for image/video upload with detailed results

### Statistics
Interactive charts showing emotion distribution and analysis history

## 🔐 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- CORS protection
- Guest mode for testing without authentication
- No data stored locally in guest mode

## 🐛 Troubleshooting

### Node.js Not Found
```bash
brew install node
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Camera Not Working
- Grant browser camera permissions
- Check System Preferences → Security & Privacy → Camera
- Use HTTPS or localhost

### Dependencies Issues
```bash
# Backend
pip3 install -r backend_requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Dataset Information

**No dataset upload needed!** The model is pre-trained and included.

The Kaggle dataset mentioned in the original README is only needed if you want to retrain the model:
- **Dataset**: Face Expression Recognition Dataset
- **Link**: https://www.kaggle.com/jonathanoheix/face-expression-recognition-dataset
- **Size**: ~300MB (28,821 training + 7,066 validation images)

## 🎓 Model Details

- **Architecture**: 4-layer CNN with BatchNormalization
- **Input**: 48x48 grayscale images
- **Output**: 7 emotion classes
- **Accuracy**: ~60% on validation set
- **Face Detection**: Haar Cascade Classifier

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional emotion categories
- Model accuracy improvements
- UI/UX enhancements
- Mobile app version
- Real-time video streaming

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- Kaggle for the emotion dataset
- OpenCV for face detection
- TensorFlow/Keras for deep learning
- Supabase for authentication
- React community for amazing tools

## 📞 Support

For issues or questions:
1. Check `INSTALLATION_GUIDE.md`
2. Review `WEB_APP_SETUP.md`
3. Check browser/terminal console logs
4. Try guest mode if Supabase issues

## ✅ Project Status

- [x] Backend API with Flask
- [x] Frontend with React
- [x] Live camera analysis
- [x] Image upload & analysis
- [x] Video upload & analysis
- [x] Statistics dashboard
- [x] Supabase authentication
- [x] Confidence level display
- [x] Guest mode
- [x] Responsive design
- [x] Documentation

## 🎉 Ready to Use!

Your emotion detection web application is complete and ready to analyze emotions!

**Start the servers and visit http://localhost:3000 to begin!** 🚀

---

Made with ❤️ using Python, React, and AI
