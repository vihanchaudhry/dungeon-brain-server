const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      displayName: req.body.displayName,
    });

    user
      .save()
      .then(saved => res.status(201).json({ success: true }))
      .catch(err =>
        res.status(400).json({ success: false, message: err.message })
      );
  });
};

exports.login = (req, res) => {
  let user;
  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          message: 'Incorrect email or password.',
        });
      }
      user = foundUser;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(match => {
      if (!match) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect email or password.',
        });
      }
      // auth successful - sign jwt
      const token = jwt.sign(
        { _id: user._id, email: user.email, name: user.displayName },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res
        .status(200)
        .json({
          token,
          expiresIn: 3600,
          userId: user._id,
          displayName: user.displayName,
        });
    })
    .catch(err => res.status(500).json({ success: false, message: 'Something went wrong.' }));
};
