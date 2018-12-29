const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*var count = 0;
//to count num of children in queue
exports.countQueue = functions.database.ref('/queue').onWrite((change, context) => {
    count = change.after.numChildren();
    console.log('countQueue', count);
    return null;
});*/

// Listens for new users added to queue
exports.makeUppercase = functions.database.ref('/queue/{userId}')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      
      const user_id = context.params.userId;
      const time_stamp = snapshot.val().timeStamp;

      countQuery = snapshot.ref.parent.once("value").then(snap => {

        const count = snap.numChildren();
        console.log('counting', count);

        const uppercase = time_stamp.toUpperCase();
        insertQuery = admin.database().ref("/chat/"+user_id+"/time").set(uppercase);

        return null;
      });

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an something in the Realtime Database returns a Promise.
      //return snapshot.ref.parent.child('uppercase').set(uppercase);

      return null;
    });
