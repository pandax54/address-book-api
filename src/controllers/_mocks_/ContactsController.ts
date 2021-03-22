import { Request, Response } from 'express'
import AppError from "../../errors/AppError";
import { FirebaseRepository } from '../../database/repositories/_mocks_/ContactsRepository'

const firebaseRepository = new FirebaseRepository()
export default class ContactsController {
    async show(request: Request, response: Response): Promise<Response> {
        
        const userId = request.user 
        if (!userId) {
            throw new AppError("User not found!", 404);
        }


        const contacts = await firebaseRepository.findByUserId(userId)

        return response.status(201).json({contacts})

    }

    async create(request: Request, response: Response): Promise<Response> {

            const { firstName, lastName, phoneNumber, address, created } = request.body
            const created_at = new Date(created).toString();
           

            firebaseRepository.save(request.user, firstName, lastName, phoneNumber, address, created_at)
            
            return response.status(201).send("Contact added with success!")
    }
}
