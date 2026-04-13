const router = require('express').Router();
const auth = require('../../middleware/auth');
const {
  createTask, getTasks, getTaskById, updateTask, deleteTask
} = require('./task.controller');

router.use(auth);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;