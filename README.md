# Job Board Platform

A full-stack Job Board Platform built using React.js, Flask, and PostgreSQL. The application allows users to explore job opportunities and search for jobs based on job titles, company names, and locations.

## Features

- Browse available job listings
- Search jobs by job title
- Search jobs by company name
- Filter jobs by location
- Display job details and company information
- Responsive and user-friendly interface
- REST API integration between frontend and backend
- PostgreSQL database integration

## Tech Stack

### Frontend
- React.js
- JavaScript
- CSS
- Lucide React

### Backend
- Python
- Flask
- REST API

### Database
- PostgreSQL

## Project Structure

```text
job-board-platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ayaan-khan128/job-board-platform.git

cd job-board-platform
```

### 2. Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### 3. Database Configuration

Install and configure PostgreSQL.

Create a database for the project and configure the database connection in the backend according to your local PostgreSQL credentials.

### 4. Run the Backend

Navigate to the backend folder:

```bash
cd backend
```

Start the Flask server using:

```bash
python app.py
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the frontend URL displayed in your terminal.

## Project Repository

GitHub: https://github.com/Ayaan-khan128/job-board-platform

## Author
Ayaan khan
INTERN ID:CITS9302

Developed as part of the CODTECH IT Solutions Internship.

## License

This project is intended for educational and internship purposes.
