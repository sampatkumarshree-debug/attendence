# AI Attendance System

A modern facial recognition attendance system built with Next.js and Flask.

---

## 🚀 How to Run Locally in VS Code

This project has two parts: a **Frontend** (Next.js/React) and a **Backend** (Python/Flask). You will need to run both simultaneously in separate terminals.

### Prerequisites
1. [Node.js](https://nodejs.org/) installed
2. [Python 3.10+](https://www.python.org/) installed
3. MongoDB (Local or Atlas Atlas URI)

---

### Step 1: Start the Backend (Terminal 1)

1. Open the project folder in VS Code.
2. Open a new terminal (`Terminal -> New Terminal` or `Ctrl + ~`).
3. Navigate to the backend folder:
   ```bash
   cd backend
   ```
4. Create a virtual environment and activate it:
   - **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
5. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Create a `.env` file inside the `backend` folder and add your MongoDB details:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   DATABASE_NAME=Attendencesystem
   COLLECTION_NAME=students
   THRESHOLD=0.6
   ```
7. Start the Flask server:
   ```bash
   python app.py
   ```
   *The backend should now be running on `http://localhost:5000`*

---

### Step 2: Start the Frontend (Terminal 2)

1. Open a **second** terminal in VS Code (`Terminal -> Split Terminal` or the `+` icon).
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install the Node dependencies:
   ```bash
   npm install
   ```
4. Configure the API URL. Open `frontend/app/constants.ts` and ensure it points to local during development:
   ```typescript
   export const API_URL = "http://localhost:5000";
   ```
   *(Note: Remember to change this back to your production Render URL before deploying!)*
5. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be running on `http://localhost:3000`*

### Step 3: Open the App
Hold `Ctrl` and click the link `http://localhost:3000` in the frontend terminal to open the app in your browser!
