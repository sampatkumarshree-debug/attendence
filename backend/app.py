# app.py - OPTIMIZED VERSION
import os
import time
import logging
import threading
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import numpy as np

# Optional student/teacher blueprints
try:
    from student.registration import student_registration_bp
except ImportError:
    student_registration_bp = None

try:
    from student.updatedetails import student_update_bp
except ImportError:
    student_update_bp = None

try:
    from student.demo_session import demo_session_bp
except ImportError:
    demo_session_bp = None

try:
    from student.view_attendance import attendance_bp
except ImportError:
    attendance_bp = None

try:
    from teacher.attendance_records import attendance_session_bp
except ImportError:
    attendance_session_bp = None

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DATABASE_NAME", "facerecognition")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "students")
THRESHOLD = float(os.getenv("THRESHOLD", "0.6"))

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
students_collection = db[COLLECTION_NAME]
attendance_db = client["facerecognition_db"]
attendance_collection = attendance_db["attendance_records"]

# OPTIMIZED MODEL MANAGER CLASS
class ModelManager:
    """
    Singleton class to manage face recognition models
    Ensures models are loaded only once and shared across all requests
    """
    _instance = None
    _lock = threading.Lock()
    
    models_ready = False
    deepface_ready = False
    detector = None

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    # Initialize default properties so they exist immediately
                    cls._instance.models_ready = False
                    cls._instance.deepface_ready = False
                    cls._instance.detector = None
                    # Run the heavy initialization in a background thread to prevent blocking the startup
                    threading.Thread(target=cls._instance._initialize_models, daemon=True).start()
        return cls._instance

    def _initialize_models(self):
        """Initialize all face recognition models with proper error handling"""
        logger.info("🤖 Starting model initialization...")
        start_time = time.time()

        # Don't reset to False here because the server instance relies on these properties
        # during the window when this background thread runs.


        try:
            # 1. Initialize MTCNN detector with optimized parameters
            from mtcnn import MTCNN
            logger.info("Loading MTCNN detector...")
            self.detector = MTCNN()
            logger.info("✅ MTCNN detector loaded successfully")

            # 2. Preload DeepFace model properly
            from deepface import DeepFace
            logger.info("Warming up DeepFace Facenet512 model...")

            # Force model download and initialization with dummy prediction
            dummy_img = np.zeros((160, 160, 3), dtype=np.uint8)

            # This forces the model to be downloaded and cached
            _ = DeepFace.represent(
                dummy_img, 
                model_name='Facenet512', 
                detector_backend='skip',
                enforce_detection=False
            )

            # Additional warm-up with different image size
            dummy_img_2 = np.ones((224, 224, 3), dtype=np.uint8) * 128
            _ = DeepFace.represent(
                dummy_img_2, 
                model_name='Facenet512', 
                detector_backend='skip',
                enforce_detection=False
            )

            self.deepface_ready = True
            logger.info("✅ DeepFace Facenet512 model warmed up successfully")

            self.models_ready = True

            initialization_time = time.time() - start_time
            logger.info(f"🎉 All models initialized successfully in {initialization_time:.2f} seconds")

        except Exception as e:
            logger.error(f"❌ Model initialization failed: {e}")
            self.models_ready = False
            raise e

    def get_detector(self):
        """Get the MTCNN detector instance"""
        if not self.models_ready:
            raise RuntimeError("Models not properly initialized")
        return self.detector

    def is_ready(self):
        """Check if all models are ready"""
        return self.models_ready and self.deepface_ready

    def health_check(self):
        """Perform model health check"""
        try:
            if not self.models_ready:
                return False

            # Test MTCNN
            test_img = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
            _ = self.detector.detect_faces(test_img)

            # Test DeepFace
            from deepface import DeepFace
            test_face = np.random.randint(0, 255, (160, 160, 3), dtype=np.uint8)
            _ = DeepFace.represent(
                test_face, 
                model_name='Facenet512', 
                detector_backend='skip',
                enforce_detection=False
            )

            return True

        except Exception as e:
            logger.error(f"Model health check failed: {e}")
            return False

# Initialize the model manager (singleton)
logger.info("Initializing Model Manager...")
model_manager = ModelManager()

# Flask app
app = Flask(__name__)
# Enable CORS for all domains, specifically allowing Authorization headers and methods
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
# Configure Flask app with database and model instances
app.config["DB"] = db
app.config["COLLECTION_NAME"] = COLLECTION_NAME
app.config["THRESHOLD"] = THRESHOLD
app.config["ATTENDANCE_COLLECTION"] = attendance_collection

# CRITICAL: Pass model manager to Flask config so blueprints can access it
app.config["MODEL_MANAGER"] = model_manager

bcrypt = Bcrypt(app)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify model status"""
    model_status = model_manager.is_ready()
    model_health = model_manager.health_check()

    return {
        "status": "healthy" if model_status and model_health else "unhealthy",
        "models_ready": model_status,
        "models_healthy": model_health,
        "timestamp": time.time()
    }

if student_registration_bp:
    app.register_blueprint(student_registration_bp)
    logger.info("✅ Student registration blueprint registered")

if student_update_bp:
    app.register_blueprint(student_update_bp)
    logger.info("✅ Student update blueprint registered")

if demo_session_bp:
    app.register_blueprint(demo_session_bp)
    logger.info("✅ Demo session blueprint registered")

if attendance_bp:
    app.register_blueprint(attendance_bp)
    logger.info("✅ Attendance blueprint registered")

if attendance_session_bp:
    app.register_blueprint(attendance_session_bp)
    logger.info("✅ Attendance session blueprint registered")

# List all registered routes
logger.info("\nRegistered Flask Routes:")
for rule in app.url_map.iter_rules():
    logger.info(f"  {rule}")

if __name__ == "__main__":
    logger.info("🚀 Starting Flask server...")

    port = int(os.environ.get("PORT", 5000))
    logger.info(f"🎯 Server starting on Port {port}. Face recognition models are initializing in the background.")
    app.run(host="0.0.0.0", port=port, debug=False)  # Set debug=False for production