import admin from 'firebase-admin'
import env from 'env-var'

const CLIENT_EMAIL = env.get('FIREBASE_PRIVATE_KEY').required().asString()

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: env.get('FIREBASE_CLIENT_EMAIL').required().asString(),
    privateKey: CLIENT_EMAIL.replace(/\\n/g, '\n'),
    projectId: env.get('FIREBASE_PROJECT_ID').required().asString()
  }),
  databaseURL: env.get('FIREBASE_DATABASEURL').required().asString()
})

export { admin }
