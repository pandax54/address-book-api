import { celebrate, Segments, Joi } from "celebrate";
import { Router } from "express";
import verifyJWT from "../middleware/authentication";
import UsersController from "../controllers/UsersController";

const usersRouter = Router();

const userController = new UsersController();

usersRouter.get("/", verifyJWT, userController.getAll);

usersRouter.get("/me", verifyJWT, userController.show);

usersRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create
);

export default usersRouter;
