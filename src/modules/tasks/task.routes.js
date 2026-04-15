const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('./task.controller');

// All routes protected
router.use(auth);

router.post('/', createTask);
router.get('/', getTasks);        // supports ?category=Work&tags=urgent,bug
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;