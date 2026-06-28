require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Assignment = require('./models/Assignment');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schedulex';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- GENERIC CRUD UTILITY ---
const createCrudRoutes = (model, path) => {
  app.get(path, async (req, res) => {
    try {
      const data = await model.find().populate(model.schema.paths.taskId ? 'taskId' : '');
      res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  
  app.post(path, async (req, res) => {
    try {
      const newItem = new model(req.body);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  app.put(`${path}/:id`, async (req, res) => {
    try {
      const updated = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  app.delete(`${path}/:id`, async (req, res) => {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
};

// --- REGISTER ROUTES ---
createCrudRoutes(Resource, '/api/resources');

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed some initial data if empty
app.post('/api/seed', async (req, res) => {
  const count = await Assignment.countDocuments();
  if (count === 0) {
    await Assignment.create({ title: 'Project Phase 1', subject: 'Data Structures', dueDate: new Date(Date.now() + 86400000), priority: 'High', status: 'Pending' });
    await Task.create({ title: 'Finish OS Assignment', category: 'Academic', priority: 'High', isCompleted: false });
    await Resource.create({ title: 'Intro to Algorithms', type: 'PDF', subject: 'Data Structures', url: '#' });
    
    res.json({ message: 'Seeded successfully' });
  } else {
    res.json({ message: 'Already seeded' });
  }
});

const dashboardRoutes = require('./routes/dashboardRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const focusSessionRoutes = require('./routes/focusSessionRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/focus-sessions', focusSessionRoutes);
app.use('/api/study-sessions', studySessionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
