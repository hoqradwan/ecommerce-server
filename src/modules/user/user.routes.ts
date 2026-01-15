import express from "express";
import { getSelfInfo, login, register } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userRegistrationValidationSchema } from "./user.validation";
import { get } from "mongoose";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register",validateRequest(userRegistrationValidationSchema), register );
router.post("/login", login );
router.get("/me", auth("user","admin"), getSelfInfo);
export const userRoutes = router;