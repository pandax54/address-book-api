
class FirebaseRepository {

  public async findById(userId: string): Promise<any> {
    const data = {
      "contacts": {
        "-MWGImX_WMEH9BqhHwHl": {
          firstName: "Fernanda",
          lastName: "Penna",
          phoneNumber: "+55027998753750",
          address: "Endereço completo",
          "id": "b62dbdb4-f0c6-42dd-af28-8c7b22c8f52c",
          userId,
          created_at: "Sat Mar 20 2021 17:24:05 GMT-0300 (Brasilia Standard Time)"
        }
      }
    }

    return data
  }

  public async save(
    userId: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: string,
    created_at: string): Promise<void> {


  }
}

export { FirebaseRepository };
