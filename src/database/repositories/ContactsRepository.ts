import { EntityRepository, Repository } from "typeorm";
import { v4 as uuid } from 'uuid'
import { User } from "../models/User";
import '../../config/Firebase';
import admin from "firebase-admin";

const db = admin.database();


@EntityRepository(User)
class ContactsRepository extends Repository<any> {

  public async findContacts(userId:string): Promise<any> {
    const data = await db.ref(`/users${"-" + process.env.FIREBASE_INTEGRATION_TEST}/` + `user-${userId}` + '/contacts/').once("value", async (snapshot) => {
      return snapshot.val()
    })

    return data
  }

  public async createContact(
    userId: string,
    firstName : string,
    lastName: string,
    phoneNumber: string,
    address: string,
    created_at: string) : Promise<void> {

    // --> users (collection) -> user-id (document) -> contacts (collection) -> contact (document)
    db.ref(`/users${"-" + process.env.FIREBASE_INTEGRATION_TEST}/` + `user-${userId}`+ '/contacts/').push({
      id: uuid(),
      userId,
      firstName,
      lastName,
      phoneNumber,
      address,
      created_at
    })

  }
}

export { ContactsRepository };
