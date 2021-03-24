class FirebaseRepository {
  public async findByUserId(user_id: string): Promise<any> {
    const data = {
      contacts: {
        '-MWGImX_WMEH9BqhHwHl': {
          first_name: 'Fernanda',
          last_name: 'Penna',
          phone_number: '+55027998753750',
          address: 'Endereço completo',
          id: 'b62dbdb4-f0c6-42dd-af28-8c7b22c8f52c',
          user_id,
          created_at:
            'Sat Mar 20 2021 17:24:05 GMT-0300 (Brasilia Standard Time)'
        }
      }
    }

    return data
  }

  public async save(
    user_id: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    address: string,
    created_at: string
  ): Promise<void> {}
}

export { FirebaseRepository }
