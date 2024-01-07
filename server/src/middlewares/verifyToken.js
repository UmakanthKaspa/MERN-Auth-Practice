import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyToken = async (req, res, next) => {
  let token = req.query.token || req.headers["authorization"];
  if (!token) {
    return res.status(400).send("Token not provided");
  }

  //   if (token.startsWith('Bearer ')) {
  //     token = token.slice(7);
  //   }

  try {
    req.decoded = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    if (req.query.token) {
      const emailTemplatePath = path.join(
        __dirname,
        "../../src/views/verificationError.ejs"
      );
      const emailTemplate = await ejs.renderFile(emailTemplatePath, {
        error,
      });
      return res.status(401).send(emailTemplate);
    }
    return res.status(401).send(error);
  }
};

export default verifyToken;
