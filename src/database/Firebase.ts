import admin from "firebase-admin";
const serviceAccount = require("../../strv-addressbook-fernanda-firebase-adminsdk-wlp6o-4d21607bf5.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASEURL
});

// location.hostname
//process.env.PSQL_HOST
if (process.env.PSQL_HOST === "localhost") {
    admin.firestore().settings({
        host: "localhost:8080",
        ssl: false
    })
}

export default admin;