// jest.mock('firebase/app', () => ({
//     __esModule: true,
//     default: {
//       apps: [],
//       initializeApp: () => {},
//       auth: () => {},
//     },
//   }));
firebase.initializeTestApp({
  databaseName: "strv-addressbook-fernanda",
  auth: { uid: "owner" }
})

firebase
  .loadDatabaseRules({
    databaseName: "strv-addressbook-fernanda",
    rules: "{'rules': {'.read': false, '.write': false}}"
  });

// Promise.all(firebase.apps().map(app => app.delete()))
// firebase.assertSucceeds(app.database().ref("public").once("value"));