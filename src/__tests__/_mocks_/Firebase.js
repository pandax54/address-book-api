const mockInitializeApp = jest.fn();
const mockCert = jest.fn();

const firebaseStub = overrides => {
  const { FakeFirestore, FakeAuth } = require('firestore-jest-mock');

  // Prepare namespaced classes
  function firestoreConstructor() {
    return new FakeFirestore(overrides.database);
  }

  firestoreConstructor.Query = FakeFirestore.Query;
  firestoreConstructor.CollectionReference = FakeFirestore.CollectionReference;
  firestoreConstructor.DocumentReference = FakeFirestore.DocumentReference;
  firestoreConstructor.FieldValue = FakeFirestore.FieldValue;
  firestoreConstructor.Timestamp = FakeFirestore.Timestamp;
  firestoreConstructor.Transaction = FakeFirestore.Transaction;

  // The Firebase mock
  return {
    initializeApp: mockInitializeApp,

    credential: {
      cert: mockCert,
    },

    auth() {
      return new FakeAuth(overrides.currentUser);
    },

    firestore: firestoreConstructor,
  };
};

const mockFirebase = (overrides = {}) => {
  mockModuleIfFound('firebase', overrides);
  mockModuleIfFound('firebase-admin', overrides);
};

function mockModuleIfFound(moduleName, overrides) {
  try {
    require.resolve(moduleName);
    jest.doMock(moduleName, () => firebaseStub(overrides));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(`Module ${moduleName} not found, mocking skipped.`);
  }
}

module.exports = {
  firebaseStub,
  mockFirebase,
  mockInitializeApp,
  mockCert,
};