const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('./user.controller');
const auth = require('../../middleware/auth');
const User = require('./user.model');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

// TEMPORARY - delete after testing
router.delete('/deleteall', async (req, res) => {
  try {
    await User.destroy({ where: {} });
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;