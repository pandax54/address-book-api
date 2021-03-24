import { celebrate, Segments, Joi } from 'celebrate'
import { Router } from 'express'
import verifyJWT from '../middlewares/authentication'
import ContactsController from '../controllers/ContactsController'
// import ContactsController from '../controllers/_mocks_/ContactsController';

const contactsRouter = Router()
const contactsController = new ContactsController()

contactsRouter.get('/', verifyJWT, contactsController.show)

// Rota POST
contactsRouter.post(
  '/',
  verifyJWT,
  celebrate({
    [Segments.BODY]: {
      first_name: Joi.string().max(30).required(),
      last_name: Joi.string().max(30).required(),
      phone_number: Joi.string().max(17).required(),
      address: Joi.string().required(),
      created: Joi.date().default(Date.now)
    }
  }),
  contactsController.create
)

export default contactsRouter
