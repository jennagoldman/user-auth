const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        const token = user.authToken();

        res.cookie('session', token, {
          maxAge: 86400000,
          httpOnly: true
        });

        res.send(user);
      })
      .catch(next);
  });
