const User = require('../models/User');

// After the Firebase ID token is verified by middleware, this route handler
// ensures that a corresponding User document exists in our MongoDB.  We also
// return the user record to the client so the frontend can store custom data.

exports.verifyUser = async (req, res) => {
  try {
    // req.user comes from auth middleware, contains at least uid and email
    const { uid, email, name } = req.user;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({ firebaseUid: uid, email, displayName: name });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    console.error('verifyUser error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
