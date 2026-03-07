const admin = require('../config/firebase');

// Express middleware that verifies the Firebase ID token sent in the
// Authorization header. If the token is valid we attach the decoded payload
// to req.user and call next(). Otherwise we return a 401 response.

module.exports = async function (req, res, next) {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = header.split('Bearer ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // decoded.uid is the Firebase UID; decoded.email etc are available too
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verifying Firebase ID token:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
