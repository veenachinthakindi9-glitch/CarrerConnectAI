import { useState } from "react";

function InterviewPrep() {
  const [role, setRole] = useState("Frontend Developer");
  const [experience, setExperience] = useState("Fresher");
  const [questions, setQuestions] = useState([]);
  const [visibleAnswers, setVisibleAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 async function generateQuestions() {
  setLoading(true);
  setError("");
  setQuestions([]);
  setVisibleAnswers([]);

  try {
    const response = await fetch("https://carrerconnectai-backend.onrender.com/api/interview-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, experience }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to generate questions.");
    }

    setQuestions(data.questions);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

  function toggleAnswer(index) {
    setVisibleAnswers((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  }

  return (
    <section className="interview-prep">
      <h2>AI Interview Preparation</h2>
      <p>Practice AI-generated questions based on your target role.</p>

      <label>Select Job Role</label>
      <select
        value={role}
        onChange={(e) => {
          setRole(e.target.value);
          setQuestions([]);
          setVisibleAnswers([]);
        }}
      >
        <option>Frontend Developer</option>
        <option>Web Developer</option>
        <option>Full Stack Developer</option>
        <option>Python Developer</option>
        <option>UI/UX Designer</option>
        <option>Data Analyst</option>
      </select>

      <label>Experience Level</label>
      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      >
        <option>Fresher</option>
        <option>1-2 Years</option>
        <option>3-5 Years</option>
      </select>

      <button onClick={generateQuestions} disabled={loading}>
        {loading ? "Generating Questions..." : "Generate Questions"}
      </button>

      {error && <p>{error}</p>}

      {questions.length > 0 && (
        <div className="interview-results">
          <h3>Practice Questions</h3>

          {questions.map((item, index) => (
            <div className="interview-question" key={index}>
              <h4>Question {index + 1}</h4>
              <p>{item.question}</p>

              <button onClick={() => toggleAnswer(index)}>
                {visibleAnswers.includes(index)
                  ? "Hide Answer"
                  : "Show Answer"}
              </button>

              {visibleAnswers.includes(index) && (
                <div className="interview-answer">
                  <strong>Suggested Answer</strong>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && questions.length > 0 && (
        <p>Generating more questions...</p>
      )}
    </section>
  );
}

export default InterviewPrep;