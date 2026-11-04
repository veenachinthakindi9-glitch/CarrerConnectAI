import { useState } from 'react';

function ApplyForm({ selectedJob }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: ''
  });

  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

    setSuccess(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSuccess(true);

    setFormData({
      name: '',
      email: '',
      phone: '',
      resume: ''
    });
  }

  return (
    <section className="apply-section" id="application-form">
      <div className="apply-content">

        <div className="apply-info">
          <span className="apply-tag">CAREERCONNECT AI</span>

          <h2>
  {selectedJob
    ? `Application for ${selectedJob.title}`
    : 'Apply for Your Dream Job'}
</h2>

          <p>
            Take the next step towards your career goals.
            Discover opportunities and move closer to your dream career.
          </p>

          <div className="apply-decoration">〰</div>
        </div>

        <form className="apply-form" onSubmit={handleSubmit}>

          {selectedJob && (
            <div className="selected-job">
              Applying for: <strong>{selectedJob.title}</strong>
            </div>
          )}

          {success && (
            <div className="success-message">
              🎉 Application Submitted Successfully!
              <p>Thank you for applying. We wish you success!</p>
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="url"
            name="resume"
            placeholder="Resume Link (Google Drive)"
            value={formData.resume}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Submit Application →
          </button>

        </form>
      </div>
    </section>
  );
}

export default ApplyForm;