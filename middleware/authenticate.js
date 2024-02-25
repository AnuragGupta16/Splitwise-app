const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];
    // Verify the token
    const decodedToken = jwt.verify(token, 'djwdbwiuebdjedbj');
    // Attach user data to the request object
    req.user = { _id: decodedToken.userId };
    // Proceed to the next middleware
    next();
  } catch (err) {
    // Token verification failed
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authenticate;
