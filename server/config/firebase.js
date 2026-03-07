const admin = require('firebase-admin');

// serviceAccountKey.json should be downloaded from Firebase console and placed
// in the same directory. Be sure to add it to .gitignore so you don't push
// your private credentials to git.
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
