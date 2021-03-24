import { celebrate, Segments, Joi } from 'celebrate'
import { Router } from 'express'
import verifyJWT from '../middlewares/authentication'
import UsersController from '../controllers/UsersController'

const usersRouter = Router()

const usersController = new UsersController()

usersRouter.get('/me', verifyJWT, usersController.show)

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  usersController.create
)

export default usersRouter
