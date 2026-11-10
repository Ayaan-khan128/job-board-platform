
import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, Building2 } from "lucide-react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

const [formData, setFormData] = useState({
  title: "",
  company: "",
  location: "",
  employment_type: "",
  salary: "",
  description: "",
  requirements: "",
});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/jobs")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch jobs");
        return response.json();
      })
      .then((data) => setJobs(data))
      .catch(() => setError("Unable to load jobs. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      job.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const handleApply = (jobId) => {
    const name = prompt("Enter your name:");
    if (!name || !name.trim()) return;

    const email = prompt("Enter your email:");
    if (!email || !email.trim()) return;

    fetch(`http://127.0.0.1:5000/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicant_name: name.trim(),
        applicant_email: email.trim(),
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Application failed");
        }

        alert(data.message);
      })
      .catch((error) => alert(error.message));
  };
 
  const handlePostJob = (e) => {
  e.preventDefault();

  fetch("http://127.0.0.1:5000/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to post job");
      }

      alert("Job posted successfully!");

      setFormData({
        title: "",
        company: "",
        location: "",
        employment_type: "",
        salary: "",
        description: "",
        requirements: "",
      });

      setShowForm(false);

      const jobsResponse = await fetch(
        "http://127.0.0.1:5000/api/jobs"
      );

      const updatedJobs = await jobsResponse.json();
      setJobs(updatedJobs);
    })
    .catch((error) => alert(error.message));
};

  return (
    <div className="app">
      <nav className="navbar">
  <h2>CareerConnect</h2>

  <div className="nav-actions">
    <span>Find Your Next Opportunity</span>

    <button
      className="post-job-btn"
      onClick={() => setShowForm(!showForm)}
    >
      Post a Job
    </button>
  </div>
</nav>

      <header className="hero">
        <h1>Find Your Dream Job</h1>
        <p>
          Discover opportunities that match your skills and ambitions.
        </p>

        <div className="search-box">
          <div>
            <Search size={20} />
            <input
              type="text"
              placeholder="Job title or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <MapPin size={20} />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="jobs-section">
        {showForm && (
  <form className="job-form" onSubmit={handlePostJob}>
    <h2>Post a New Job</h2>

    <input
      type="text"
      placeholder="Job Title"
      value={formData.title}
      onChange={(e) =>
        setFormData({ ...formData, title: e.target.value })
      }
      required
    />

    <input
      type="text"
      placeholder="Company Name"
      value={formData.company}
      onChange={(e) =>
        setFormData({ ...formData, company: e.target.value })
      }
      required
    />

    <input
      type="text"
      placeholder="Location"
      value={formData.location}
      onChange={(e) =>
        setFormData({ ...formData, location: e.target.value })
      }
      required
    />

    <select
      value={formData.employment_type}
      onChange={(e) =>
        setFormData({ ...formData, employment_type: e.target.value })
      }
      required
    >
      <option value="">Select Employment Type</option>
      <option value="Full-time">Full-time</option>
      <option value="Part-time">Part-time</option>
      <option value="Internship">Internship</option>
      <option value="Remote">Remote</option>
      <option value="Contract">Contract</option>
    </select>

    <input
      type="text"
      placeholder="Salary (Optional)"
      value={formData.salary}
      onChange={(e) =>
        setFormData({ ...formData, salary: e.target.value })
      }
    />

    <textarea
      placeholder="Job Description"
      value={formData.description}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
      required
    />

    <textarea
      placeholder="Requirements (Optional)"
      value={formData.requirements}
      onChange={(e) =>
        setFormData({ ...formData, requirements: e.target.value })
      }
    />

    <button type="submit" className="post-job-btn">
      Submit Job
    </button>

    <button
      type="button"
      className="cancel-btn"
      onClick={() => setShowForm(false)}
    >
      Cancel
    </button>
  </form>
)}
        <h2>Latest Job Opportunities</h2>

        {loading && <p>Loading jobs...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && filteredJobs.length === 0 && (
          <p>No matching jobs found.</p>
        )}

        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-icon">
                <Building2 size={26} />
              </div>

              <h3>{job.title}</h3>

              <p>
                <Briefcase size={16} /> {job.company}
              </p>

              <p>
                <MapPin size={16} /> {job.location}
              </p>

              <span className="job-type">
                {job.employment_type}
              </span>

              <p className="salary">
                {job.salary || "Salary not disclosed"}
              </p>

              <p className="description">
                {job.description}
              </p>

              <button
                className="apply-btn"
                onClick={() => handleApply(job.id)}
              >
                Apply Now
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

