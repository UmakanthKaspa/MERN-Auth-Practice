import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import sendVerificationEmail from "../services/emailService.js"
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const userSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {

    const missingValues = [];
    if (!name){
      missingValues.push("name")
    }
    if (!email){
      missingValues.push("email")
    }
    if (!password){
      missingValues.push("password")
    }

if ( missingValues.length > 0){
  
  return res.status(400).json({ error: `Please enter the required fields: ${missingValues.join(', ')}` });
}
const existingUser = await userModel.findOne({ email });

if (existingUser) {
  return res.status(400).json({ message: 'Email is already registered.' });
}

const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userModel({
      name,
      email,
      password: hashedPassword,
    });
    const User = await userModel.create(newUser);
    const token = jwt.sign({ email: User.email }, process.env.SECRET_KEY, { expiresIn: '1d' });

    res.status(201).json({ user: User,token });
    await sendVerificationEmail(req,newUser);

  
  } catch (e) {
    console.error('Error registering user:', e);
    res.status(500).json({ message: `Internal server error. ${e}` });
  
};


}







const verifyEmail = async (req, res) => {
  const existingUser = await userModel.findOne({ email: req.decoded.email});
  if (!existingUser) {
    return res.status(404).send('User not found');
  }
  if (existingUser.isVerified) {
    return res.send( { message: 'Your email is already verified.' });
  }
  existingUser.isVerified = true;
  await existingUser.save();


  const emailTemplatePath = path.join(
    __dirname,
    "../../src/views/verificationSuccess.ejs"
  );
  const emailTemplate = await ejs.renderFile(emailTemplatePath, {
    error,
  });
  return res.status(200).send(emailTemplate);}









const userLogin = async (req, res) => {
    const {email, password} = req.body;
    try{
      const missingValues = [];
   
      if (!email){
        missingValues.push("email")
      }
      if (!password){
        missingValues.push("password")
      }
  
  if ( missingValues.length > 0){
    
    return res.status(400).json({ error: `Please enter the required fields: ${missingValues.join(', ')}` });
  }
        const user = await userModel.findOne({ email: email});
        if(user){
          if (!user.isVerified) {
            return res.status(401).json({ message: 'Email not verified. Please verify your email to log in.' });
        }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ email: user.email }, config.SECRET_KEY, { expiresIn: '1d' });

            res.status(201).json({ user: user,token });
            }else{
                return res.status(401).json({ message: 'Invalid password' });
            }
        }else{
            return res.status(404).json({ message: "user not registred" });
        }
    }catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
}


  export default { userSignup, verifyEmail,userLogin };
