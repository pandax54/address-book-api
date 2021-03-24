import { Request, Response } from 'express'
import AppError from '../../errors/AppError'
import { FirebaseRepository } from '../../database/repositories/_mocks_/ContactsRepository'

const firebaseRepository = new FirebaseRepository()
export default class ContactsController {
  async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user
    if (!user_id) {
      throw new AppError('User not found!', 404)
    }

    const contacts = await firebaseRepository.findByUserId(user_id)

    return response.status(200).json({ contacts })
  }

  async create(request: Request, response: Response): Promise<Response> {
    const {
      first_name,
      last_name,
      phone_number,
      address,
      created
    } = request.body
    const created_at = new Date(created).toString()

    firebaseRepository.save(
      request.user,
      first_name,
      last_name,
      phone_number,
      address,
      created_at
    )

    return response.status(201).send('Contact added with success!')
  }
}
