const express = require('express');
const app = express();

app.use(require('../bot-login/bot-login.controller'));

module.exports = app;