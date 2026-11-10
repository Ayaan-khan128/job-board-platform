from sqlalchemy import text
from flask import Flask, jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration will be added next
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    company = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    employment_type = db.Column(db.String(50), nullable=False)
    salary = db.Column(db.String(100))
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    applicant_name = db.Column(db.String(150), nullable=False)
    applicant_email = db.Column(db.String(150), nullable=False)

    job_id = db.Column(
        db.Integer,
        db.ForeignKey("jobs.id"),
        nullable=False
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)    

@app.route("/")
def home():
    return jsonify({
        "message": "Job Board API is running!"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "Job Board Backend"
    })

@app.route("/api/db-health")
def db_health():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({
            "status": "connected",
            "database": "PostgreSQL"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    jobs = Job.query.order_by(Job.created_at.desc()).all()

    return jsonify([
        {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "employment_type": job.employment_type,
            "salary": job.salary,
            "description": job.description,
            "requirements": job.requirements,
            "created_at": job.created_at.isoformat()
        }
        for job in jobs
    ]), 200


@app.route("/api/jobs", methods=["POST"])
def create_job():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON data"}), 400

    required_fields = [
        "title", "company", "location",
        "employment_type", "description"
    ]

    for field in required_fields:
        if not isinstance(data.get(field), str) or not data[field].strip():
            return jsonify({
                "error": f"{field} is required"
            }), 400

    new_job = Job(
        title=data["title"].strip(),
        company=data["company"].strip(),
        location=data["location"].strip(),
        employment_type=data["employment_type"].strip(),
        salary=data.get("salary"),
        description=data["description"].strip(),
        requirements=data.get("requirements")
    )

    db.session.add(new_job)
    db.session.commit()

    return jsonify({
        "message": "Job created successfully",
        "job_id": new_job.id
    }), 201

@app.route("/api/jobs/<int:job_id>/apply", methods=["POST"])
def apply_for_job(job_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid application data"}), 400

    applicant_name = data.get("applicant_name", "").strip()
    applicant_email = data.get("applicant_email", "").strip()

    if not applicant_name or not applicant_email:
        return jsonify({
            "error": "Name and email are required"
        }), 400

    if "@" not in applicant_email:
        return jsonify({
            "error": "Please enter a valid email address"
        }), 400

    job = Job.query.get(job_id)

    if not job:
        return jsonify({"error": "Job not found"}), 404

    application = Application(
        applicant_name=applicant_name,
        applicant_email=applicant_email,
        job_id=job_id
    )

    db.session.add(application)
    db.session.commit()

    return jsonify({
        "message": "Application submitted successfully!"
    }), 201  


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5000)
