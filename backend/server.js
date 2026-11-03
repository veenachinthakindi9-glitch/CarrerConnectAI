
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to Supabase

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
const keyPayload = process.env.SUPABASE_SERVICE_ROLE_KEY.split('.')[1];

try {
  const decodedKey = JSON.parse(
    Buffer.from(keyPayload, 'base64url').toString()
  );

  console.log('Supabase key role:', decodedKey.role);
} catch (error) {
  console.log('Supabase key format: Not a legacy JWT');
}
console.log(
  'Service role key loaded:',
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Home API
app.get('/', (req, res) => {
  res.send('CareerConnect AI Backend is Running!');
});

app.get('/api/jobs', async (req, res) => {
  try {
    const { location, keyword } = req.query;

    const params = new URLSearchParams();

    if (location && location !== 'All Locations') {
      params.append('city', location === 'Bangalore' ? 'Bengaluru' : location);
    }

    if (keyword) {
      params.append('q', keyword);
    }

    params.append('per_page', '20');

    const response = await fetch(
      `https://jobsforceindia.com/api/public/v1/jobs?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Live jobs error:', error);
    res.status(500).json({ message: 'Unable to fetch live jobs' });
  }
});

// Save applications
app.post('/api/applications', async (req, res) => {
  try {
    const { name, email, phone, resume, jobTitle } = req.body;

    if (!name || !email || !phone || !jobTitle) {
      return res.status(400).json({
        message: 'Please fill in all required fields.'
      });
    }

    const { error } = await supabaseAdmin
      .from('applications')
      .insert([{
        name,
        email,
        phone,
        resume,
        job_title: jobTitle
      }]);

    if (error) {
      console.log('Application saving error:', error);
      return res.status(500).json({
        message: error.message
      });
    }

    return res.status(201).json({
      message: 'Application saved successfully!'
    });

  } catch (error) {
    console.log('Server error:', error);
    return res.status(500).json({
      message: 'Unable to save application.'
    });
  }
});




// User Registration API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please fill in all fields.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must contain at least 6 characters.'
      });
    }

    const { data, error } = await supabaseAdmin.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() }
      }
    });

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(201).json({
      message: 'Registration successful!',
      user: data.user
    });

  } catch (error) {
    console.error('Registration error:', error.message);

    return res.status(500).json({
      message: 'Registration failed.'
    });
  }
});

app.post('/api/interview-questions', async (req, res) => {
  
  console.log("INTERVIEW ROUTE REACHED");
  try {
    const { role, experience } = req.body;

    if (!role || !experience) {
      return res.status(400).json({ error: 'Select role and experience.' });
    }

    const difficulty = experience === 'Fresher'
      ? 'basic concepts and simple coding questions'
      : 'advanced concepts and real-world problem-solving questions';

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: 'You are a technical interviewer. Return only valid JSON.'
        },
        {
          role: 'user',
          content: `Generate exactly 5 interview questions with short answers for a ${role} at ${experience} level. Focus on ${difficulty}.

Return JSON in this format:
{"questions":[{"question":"Question","answer":"Answer"}]}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    res.json(result);

 } catch (error) {
  console.error('Groq error message:', error.message);
  console.error('Groq error status:', error.status);
  console.error('Groq error details:', error.error);

  res.status(500).json({
    error: error.message || 'Unable to generate questions.'
  });
}
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});