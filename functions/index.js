const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// http request 1
// exports.randomNumber = functions.https.onRequest((req, res) => {
//   const numb = Math.round(Math.random() * 100);
//   res.send(numb.toString());
// });

// // http request 2
// exports.toTheDojjo = functions.https.onRequest((req, res) => {
//   res.redirect("https://nasiruddin.com");
// });

// // http callable
// exports.sayHello = functions.https.onCall((data, context) => {
//   const {name} = data;
//   return `"Hello ${name}"`;
// });

// Auth trigger
exports.newUserSignup = functions.auth.user().onCreate((user, context) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    upvotedOn: [],
  });
});

exports.userDeleted = functions.auth.user().onDelete((user, context) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

// add a request
exports.addRequest = functions.https.onCall((data, context) => {
  const {text} = data;
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "only authenticated user can add a request"
    );
  }

  if (text.length > 30) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "request name should be within 30 characters"
    );
  }

  return admin.firestore().collection("requests").doc().set({
    text,
    upvotes: 0,
  });
});

// upvote callable function
exports.upvote = functions.https.onCall((data, context) => {
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "only authenticated user can upvote"
    );
  }

  // get refs for user doc and ref doc
  const user = admin.firestore().collection("users").doc(context.auth.uid);
  const request = admin.firestore().collection("requests").doc(data.id);

  return user.get().then((doc) => {
    // check user hasn't upvoited already
    if (doc.data().upvotedOn.includes(data.id)) {
      throw new functions.https.HttpsError(
          "failed-precondition",
          "you only can upvote once"
      );
    }

    // update user array
    return user.update({
      upvotedOn: [...doc.data().upvotedOn, data.id],
    }).then(() => {
      // update vote on requests
      return request.update({
        upvotes: admin.firestore.FieldValue.increment(1),
      });
    });
  });
});

// activities
exports.logActivity = functions.firestore.document('/{collection}/{id}')
    .onCreate((snapshot, context) => {
      const {collection, id} = context.params;
      const activities = admin.firestore().collection('activities');
      switch (collection) {
        case 'requests':
          return activities.add({text: `a new request was added and id ${id}`});
        case 'users':
          return activities.add({text: 'a new request was added'});
        default:
          return null;
      }
    })
