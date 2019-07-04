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

/*exports.sortQueue = functions.database.ref('/queue').onWrite((change, context) => {
  
  const membersRef = change.after.ref;
  
  return membersRef.orderByChild('timeStamp').once("value", function(snapshot) {
    
    snapshot.forEach(function(childSnapshot){

      const childData = childSnapshot.val();
      console.log("value",childData);

    });
  });
});*/


// Listens for new users added to queue
exports.operateQueue = functions.database.ref('/queue/{userId}')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      
      const user_id = context.params.userId;
      const time_stamp = snapshot.val().timeStamp;
      console.log('uid',user_id);

      //sort and count 
      countQuery = snapshot.ref.parent.orderByChild('timeStamp').limitToFirst(2).once("value").then(snap => {

        //always <=2
        const count = snap.numChildren();
        console.log('counting', count);
        
        userArr = new Array(2);
        iterator = 0;
        if(count === 2){
          //console.log("not 1",count);

          //getting first 2 children
          snap.forEach(function(childSnapshot) {

            userArr[iterator] = childSnapshot.key;
            console.log("value",userArr[iterator]);

            iterator += 1;
            
          });

          //session
          insertQuery = admin.database().ref("/chat/"+userArr[iterator-1]+"/"+ userArr[iterator-2]+"/seen").set(time_stamp);
          insertQuery2 = admin.database().ref("/chat/"+userArr[iterator-2]+"/"+ userArr[iterator-1]+"/seen").set(time_stamp);

          //remove from queue
          deleteQuery = admin.database().ref("/queue/"+userArr[iterator-1]).remove();
          deleteQuery2 = admin.database().ref("/queue/"+userArr[iterator-2]).remove();

        }

        return null;
      });

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an something in the Realtime Database returns a Promise.
      //return snapshot.ref.parent.child('uppercase').set(uppercase);

      return null;
    });
