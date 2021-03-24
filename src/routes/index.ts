import { Router } from 'express'
// import verifyJWT from "../middleware/authentication";
import sessionsRouter from './sessionsRoutes'
import usersRouter from './usersRoutes'
import contactsRouter from './contactsRoutes'

const router = Router()

router.use('/users', usersRouter)
router.use('/login', sessionsRouter)
router.use('/contact', contactsRouter)

export default router
