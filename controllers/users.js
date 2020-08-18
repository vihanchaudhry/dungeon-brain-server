const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  // hash password
  const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

  // create new user object
  const user = new User({
    email: req.body.email,
    password: hash,
    displayName: req.body.displayName,
  });

  // save user to db
  const saved = await user
    .save()
    .catch(err =>
      res.status(400).json({ success: false, message: err.message })
    );

  // success
  return res.status(201).json({ success: true, message: 'Registration successful! You may now login.' });
};

exports.login = async (req, res) => {
  // find user
  const user = await User.findOne({ email: req.body.email }).catch(err =>
    res.status(500).json({ success: false, message: err.message })
  );

  // if no user by this email in db
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect email or password.',
    });
  }

  // compare password hashes
  const match = await bcrypt
    .compare(req.body.password, user.password)
    .catch(err =>
      res.status(500).json({ success: false, message: err.message })
    );

  // if no match, i.e. incorrect password
  if (!match) {
    return res.status(400).json({
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

  // return token and user data
  return res.status(200).json({
    token,
    expiresIn: 3600,
    userId: user._id,
    displayName: user.displayName,
  });
};

exports.changePassword = async (req, res) => {
  // fetch user
  const user = await User.findById(req.user._id).catch(err =>
    res.status(500).json({ success: false, message: err.message })
  );

  // if user not found
  if (!user) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong.' });
  }

  // check if old password is correct
  const confirmPasswordMatch = await bcrypt
    .compare(req.body.oldPassword, user.password)
    .catch(err =>
      res.status(500).json({ success: false, message: err.message })
    );

  // if old password not correct
  if (!confirmPasswordMatch) {
    return res.status(403).json({
      success: false,
      message: 'Incorrect password.',
    });
  }

  // check if new password is the same as old password
  const sameNewPassword = await bcrypt
    .compare(req.body.newPassword, user.password)
    .catch(err =>
      res.status(500).json({ success: false, message: err.message })
    );

  // if new password and old password are the same
  if (sameNewPassword) {
    return res.status(400).json({
      success: false,
      message: 'The new password cannot be the same as your old password.',
    });
  }

  // hash new password
  const hash = await bcrypt
    .hash(req.body.newPassword, SALT_ROUNDS)
    .catch(err =>
      res.status(500).json({ success: false, message: err.message })
    );

  // set user password to new hashed value
  user.password = hash;

  // save user document
  const saved = await user
    .save()
    .catch(err =>
      res.status(500).json({ success: false, message: err.message })
    );

  // return success
  res.status(200).json({
    success: true,
    message: 'Your password has been changed.',
  });
};
