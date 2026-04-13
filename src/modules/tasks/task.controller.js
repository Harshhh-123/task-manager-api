const Joi = require('joi');
const Task = require('./task.model');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  dueDate: Joi.date().iso().allow(null),
  status: Joi.string().valid('pending', 'completed'),
});

exports.createTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, task });
  } catch (err) { next(err); }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const updateSchema = taskSchema.fork(['title'], (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    Object.assign(task, req.body);
    await task.save();
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
};