import admin from 'firebase-admin'

const serviceAccount = process.env.FIREBASE_KEY

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: process.env.FIREBASE_DATABASEURL
})

const db = admin.database()

export { admin, db }
