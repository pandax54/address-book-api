import { celebrate, Segments, Joi } from "celebrate";
import { Router } from "express";
import verifyJWT from "../middleware/authentication";
import ContactsController from "../controllers/ContactsController";
// import ContactsController from '../controllers/_mocks_/ContactsController';

const contactsRouter = Router();
const contactsController = new ContactsController();

contactsRouter.get("/", verifyJWT, contactsController.show)

// Rota POST
contactsRouter.post(
  "/", verifyJWT, 
  celebrate({
    [Segments.BODY]: {
      firstName: Joi.string().max(30).required(), 
      lastName: Joi.string().max(30).required(), 
      phoneNumber : Joi.string().max(17).required(), 
      address: Joi.string().required(),
      created: Joi.date().default(Date.now),
    },
  }),
  contactsController.create
);

export default contactsRouter;
