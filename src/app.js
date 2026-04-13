const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./modules/users/user.routes'));
app.use('/api/tasks', require('./modules/tasks/task.routes'));

app.use(require('./middleware/errorHandler'));

module.exports = app;