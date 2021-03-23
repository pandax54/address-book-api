import firebaseAdmin from '../database/Firebase';
import { FirebaseRepository } from "../database/repositories/ContactsRepository";
const { mockCollection } = require('firestore-jest-mock/mocks/firestore');
const { mockFirebase } = require('firestore-jest-mock');
import admin from '../database/Firebase';


jest.mock('firebase-admin')

jest.mock('../database/Firebase')
jest.mock("../database/repositories/ContactsRepository")


describe('Firebase connection test', () => {
  
  // https://www.npmjs.com/package/firestore-jest-mock
  
  
  const firebaseRepository = new FirebaseRepository()

  // Create a fake Firestore with a `users` and `posts` collection
  mockFirebase({
    database: {
      users: [
        { id: 'abc123', name: 'Homer Simpson' },
        { id: 'abc456', name: 'Lisa Simpson' },
      ],
    },
  });


  beforeEach(() => {

  })

  afterAll(async () => jest.clearAllMocks())

  it('Should connect to firebase', async () => {
    // const db = firebase.firestore();
    //Can't determine Firebase Database URL.

    const set = firebaseAdmin
      .database()
      .ref()
      .push().set;

    firebaseRepository.save("b62dbdb4-f0c6-42dd-af28-8c7b22c8f52c", "Carlos", "Penna", "+55027998753750", "Endereço completo", "Sat Mar 20 2021 17:24:05 GMT-0300 (Brasilia Standard Time)")


    expect(set).toHaveBeenCalledTimes(1);
  })

  it('testing stuff', () => {
    const firebase = require('firebase'); // or import firebase from 'firebase';
    const db = firebase.firestore();

    return db
      .collection('users')
      .get()
      .then(userDocs => {
        // Assert that a collection ID was referenced
        expect(mockCollection).toHaveBeenCalledWith('users');

        // Write other assertions here
      });
  });



})
