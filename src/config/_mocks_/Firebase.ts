jest.mock('firebase/app', () => ({
    __esModule: true,
    default: {
      apps: [],
      initializeApp: () => {},
      auth: () => {},
    },
  }));