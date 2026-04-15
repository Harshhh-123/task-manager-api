const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    due_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Urgent', 'Other'],
      default: 'Other',
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type: String,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderTimeout: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);