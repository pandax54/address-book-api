import {  Router  } from "express";
// import verifyJWT from "../middleware/authentication";
import sessionsRouter from "./sessions.routes";
import usersRouter from "./users.routes";
import contactsRouter from "./contacts.routes";

const router = Router();

router.use("/users", usersRouter);
router.use("/login", sessionsRouter);
router.use("/contact", contactsRouter)

export default router;
