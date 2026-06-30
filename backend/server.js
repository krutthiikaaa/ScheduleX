require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.plugin((schema) => {
  if (!schema.paths.userId && schema.options.collection !== 'users') {
    schema.add({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } });
  }
});
const auth = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Task = require('./models/Task');
const Habit = require('./models/Habit');
const Goal = require('./models/Goal');

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://schedule-x-krutthiikaaas-projects.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const connectDB = require('./config/db');
connectDB();

// --- GENERIC CRUD UTILITY ---
const createCrudRoutes = (model, path) => {
  app.get(path, auth, async (req, res) => {
    try {
      const count = await model.countDocuments(req.userQuery);
      if (count === 0 && req.isDemoUser) {
        if (path === '/api/habits') {
          const initialHabits = [
            { title: "Wake Up Early", category: "Health", history: {}, notes: "Felt great this week." },
            { title: "Read 20 Pages", category: "Reading", history: {}, notes: "" },
            { title: "DSA Practice", category: "Coding", history: {}, notes: "Completed Binary Search problems." },
            { title: "Exercise", category: "Fitness", history: {}, notes: "Running 5k" },
            { title: "Drink Water", category: "Health", history: {}, notes: "" },
            { title: "Journal", category: "Personal", history: {}, notes: "" },
            { title: "Revise Notes", category: "Study", history: {}, notes: "" },
            { title: "Sleep Before 11 PM", category: "Health", history: {}, notes: "" }
          ];
          await model.insertMany(initialHabits);
        } else if (path === '/api/goals') {
          const initialGoals = [
            { title: "Complete OS Assignment", type: "Weekly", week: 1, completed: true, priority: "High" },
            { title: "Read 2 Research Papers", type: "Weekly", week: 1, completed: false, priority: "Medium" },
            { title: "Solve 15 LeetCode Problems", type: "Weekly", week: 2, completed: false, priority: "High" },
            { title: "Gym 4 times a week", type: "Weekly", week: 2, completed: false, priority: "Medium" },
            { title: "Finish DBMS Project Phase 1", type: "Monthly", deadline: "June 15", priority: "High", progress: 75 },
            { title: "Read 1 Non-fiction Book", type: "Monthly", deadline: "June 30", priority: "Medium", progress: 40 }
          ];
          await model.insertMany(initialGoals);
        } else if (path === '/api/resources') {
          await model.insertMany([
            { title: "Operating Systems Lecture Notes", type: "PDF", subject: "Operating Systems", url: "https://example.com/os.pdf", fileName: "OS_Notes.pdf", fileSize: "2.4 MB", isFavorite: true },
            { title: "Algorithms Cheatsheet", type: "Document", subject: "Algorithms", url: "https://example.com/algo.pdf", fileName: "Algo_Sheet.pdf", fileSize: "1.1 MB", isFavorite: false },
            { title: "MIT 6.006 Video Lectures", type: "Video", subject: "Algorithms", url: "https://youtube.com", fileName: "Video Link", fileSize: "N/A", isFavorite: true }
          ]);
        } else if (path === '/api/courses') {
          await model.insertMany([
            { name: "Data Structures", code: "CS201", instructor: "Dr. Smith", credits: 4, color: "#4a6cf7" },
            { name: "Operating Systems", code: "CS301", instructor: "Prof. Davis", credits: 4, color: "#28a745" },
            { name: "Algorithms", code: "CS202", instructor: "Dr. Alan", credits: 3, color: "#ffc107" }
          ]);
        }
      } else if (count === 0 && !req.isDemoUser && path === '/api/habits') {
        await model.create({
          userId: req.userId,
          title: "example",
          category: "Personal",
          history: {},
          notes: "Example habit — will disappear when you add your own!",
          isExample: true
        });
      } else if (count > 0 && !req.isDemoUser && path === '/api/habits') {
        await model.updateMany({ ...req.userQuery, isExample: true }, { title: "example", category: "Personal" });
      }
      let query = model.find(req.userQuery);
      if (model.schema.paths.taskId) {
        query = query.populate('taskId');
      }
      const data = await query.sort({ _id: 1 });
      res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post(path, auth, async (req, res) => {
    try {
      if (path === '/api/habits' && !req.isDemoUser) {
        await model.deleteMany({ ...req.userQuery, isExample: true });
      }
      const bodyData = { ...req.body };
      if (req.userId) bodyData.userId = req.userId;
      const newItem = new model(bodyData);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  app.put(`${path}/:id`, auth, async (req, res) => {
    try {
      const updated = await model.findOneAndUpdate({ _id: req.params.id, ...req.userQuery }, req.body, { new: true });
      res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  app.delete(`${path}/:id`, auth, async (req, res) => {
    try {
      await model.findOneAndDelete({ _id: req.params.id, ...req.userQuery });
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
};

// --- REGISTER ROUTES ---
createCrudRoutes(Resource, '/api/resources');
createCrudRoutes(Course, '/api/courses');
createCrudRoutes(Habit, '/api/habits');
createCrudRoutes(Goal, '/api/goals');

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

app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, fullName } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with a random secure password for users logging in via Google
      const randomPassword = require('crypto').randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({ fullName, email, password: hashedPassword });
      await user.save();
    }

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
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/dashboard', auth, dashboardRoutes);
app.use('/api/timetable', auth, timetableRoutes);
app.use('/api/assignments', auth, assignmentRoutes);
app.use('/api/tasks', auth, taskRoutes);
app.use('/api/focus-sessions', auth, focusSessionRoutes);
app.use('/api/study-sessions', auth, studySessionRoutes);
app.use('/api/profile', auth, profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
