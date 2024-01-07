import emailConfig from "../config/emailConfig.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import jwt from "jsonwebtoken";

import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};

const sendVerificationEmail = async (req,user) => {
  const transporter = createTransporter();

  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  const verificationUrl = `${req.protocol}://${req.get('host')}/users/verify-email?token=${token}`;

  const emailTemplatePath = path.join(
    __dirname,
    "../../src/views/verificationEmail.ejs"
  );
  const emailTemplate = await ejs.renderFile(emailTemplatePath, {
    verificationUrl,
  });
  //   const emailTemplate = await ejs.renderFile('/home/umakanth/Umakanth/MERN-Auth-Practice/server/src/views/verificationEmail.html', { verificationUrl });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email",
    html: emailTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
