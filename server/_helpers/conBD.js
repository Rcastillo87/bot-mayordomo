var admin = require("firebase-admin");
var serviceAccount = require("./key_firebase.json");

//console.log(serviceAccount);
//admin.initializeApp(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

module.exports = db;