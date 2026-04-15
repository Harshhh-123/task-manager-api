const Task = require('./task.model');
const axios = require('axios');

// In-memory reminder store
const reminders = {};

// Webhook with retry logic
const sendWebhook = async (task, retries = 3, delay = 1000) => {
  const webhookUrl = process.env.WEBHOOK_URL || 'https://webhook.site/your-url-here';
  const payload = {
    taskId: task._id,
    title: task.title,
    completionDate: new Date(),
    userId: task.userId,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await axios.post(webhookUrl, payload);
      console.log(`Webhook sent successfully on attempt ${attempt}`);
      return;
    } catch (err) {
      console.log(`Webhook attempt ${attempt} failed`);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay * attempt));
      }
    }
  }
  console.log('All webhook attempts failed');
};

// Schedule reminder
const scheduleReminder = (task) => {
  if (!task.due_date || task.reminderSent) return;

  const reminderTime = new Date(task.due_date).getTime() - 60 * 60 * 1000;
  const now = Date.now();
  const timeUntilReminder = reminderTime - now;

  if (timeUntilReminder <= 0) return;

  // Clear existing reminder if any
  if (reminders[task._id]) {
    clearTimeout(reminders[task._id]);
  }

  reminders[task._id] = setTimeout(async () => {
    console.log(`REMINDER: Task "${task.title}" is due in 1 hour!`);
    try {
      await Task.findByIdAndUpdate(task._id, { reminderSent: true });
    } catch (err) {
      console.log('Could not update reminderSent');
    }
    delete reminders[task._id];
  }, timeUntilReminder);

  console.log(`Reminder scheduled for task "${task.title}"`);
};

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, due_date, status, category, tags } = req.body;

    const task = new Task({
      title,
      description,
      due_date,
      status,
      category,
      tags,
      userId: req.user.id,
    });

    await task.save();
    scheduleReminder(task);

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Tasks (with filter)
const getTasks = async (req, res) => {
  try {
    const { category, tags } = req.query;
    const filter = { userId: req.user.id };

    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const wasCompleted = task.status === 'completed';

    Object.assign(task, req.body);
    await task.save();

    // Send webhook if just marked completed
    if (!wasCompleted && task.status === 'completed') {
      sendWebhook(task);
    }

    // Reschedule reminder if due_date changed
    if (req.body.due_date) {
      task.reminderSent = false;
      await task.save();
      scheduleReminder(task);
    }

    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Clear reminder if exists
    if (reminders[task._id]) {
      clearTimeout(reminders[task._id]);
      delete reminders[task._id];
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };