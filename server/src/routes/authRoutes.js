import express from 'express';
import authController from "../controllers/authCountroller.js"
import verifyToken from "../middlewares/verifyToken.js";

const router  = express.Router();


router.post("/signup",authController.userSignup)
router.post("/login",authController.userLogin)
router.get("/verify-email",verifyToken,authController.verifyEmail)


export default router