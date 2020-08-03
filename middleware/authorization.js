const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = {
      _id: decodedToken._id,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };
    return next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to perform this action.',
    });
  }
};
