const data = { name: 'data' }
const snapshot = {
  val: () => data,
  exportVal: () => data,
  exists: jest.fn(() => true)
}

jest.mock('firebase-admin', () => ({
  database: () => ({
    ref: jest.fn().mockReturnThis(),
    on: jest.fn((eventType, callback) => callback(snapshot)),
    update: jest.fn(() => Promise.resolve(snapshot)),
    remove: jest.fn(() => Promise.resolve()),
    once: jest.fn(() => Promise.resolve(snapshot))
  }),
  initializeApp: () => ({
    firestore: () => jest.fn()
  })
}))

beforeAll(() => {})
afterAll(() => {})
