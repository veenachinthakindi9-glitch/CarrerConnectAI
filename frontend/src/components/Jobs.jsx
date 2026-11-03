import React from 'react';

function Jobs({ searchTerm, selectedLocation }) {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();

        if (selectedLocation && selectedLocation !== 'All Locations') {
          params.append('location', selectedLocation);
        }

        if (searchTerm.trim()) {
          params.append('keyword', searchTerm.trim());
        }

        
        const response = await fetch(
  `https://carrerconnectai-backend.onrender.com/api/jobs?${params.toString()}`
);

        if (!response.ok) {
          throw new Error('Unable to fetch jobs.');
        }

        const data = await response.json();
        setJobs(data.results || []);
      } catch (error) {
        setError('Unable to load jobs. Please try again.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, selectedLocation]);

  return (
    <section className="jobs-section" id="jobs">
      <h2>Latest Job Opportunities</h2>
      <p>Explore live job openings matching your search.</p>

      {loading && <p>Loading live jobs...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p>No jobs found. Try another search.</p>
      )}

      <div className="jobs-container">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>

            <p>
              <strong>Company:</strong> {job.hiring?.display || job.hiring?.name || 'Not specified'}
            </p>

            <p>
              <strong>Location:</strong> {job.location?.city}, {job.location?.state}
            </p>

            <p>
              <strong>Salary:</strong> {job.salary?.label || 'Not disclosed'}
            </p>

            <p>
              <strong>Experience:</strong> {job.experience?.label || 'Not specified'}
            </p>

            <p>{job.summary}</p>

            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="apply-button"
            >
              Apply Now
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Jobs;