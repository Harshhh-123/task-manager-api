const router = require('express').Router();
const { register, login, getProfile } = require('./user.controller');
const auth = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getProfile);

module.exports = router;