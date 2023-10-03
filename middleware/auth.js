const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header('x-auth-token');

  //if there is not token

  if (!token) {
    return res.status(401).json({ msg: 'No token, authrized denied' });
  }

  //token varified

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
