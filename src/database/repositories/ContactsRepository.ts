import { v4 as uuid } from 'uuid'
import admin from '../firebase'

const db = admin.database()

class FirebaseRepository {
  public async findByUserId(user_id: string): Promise<any> {
    const data = await db
      .ref(
        `/users${process.env.FIREBASE_INTEGRATION_TEST}/` +
          `user-${user_id}` +
          '/contacts/'
      )
      .once('value', async snapshot => {
        return snapshot.val()
      })

    return data
  }

  public async save(
    user_id: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    address: string,
    created_at: string
  ): Promise<void> {
    // --> users (collection) -> user-id (document) -> contacts (collection) -> contact (document)
    db.ref(
      `/users${process.env.FIREBASE_INTEGRATION_TEST}/` +
        `user-${user_id}` +
        '/contacts/'
    ).push({
      id: uuid(),
      user_id,
      first_name, 
      last_name, 
      phone_number, 
      address,
      created_at
    })
  }
}

export { FirebaseRepository }
