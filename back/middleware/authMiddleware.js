import jwt from "jsonwebtoken";
import userController from '../controllers/controllers/userController.js'



// Funciones para la autenticacion del usuario
const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: "No hay token jwt" });
  }

  const token =authorization.includes("Bearer")  ? authorization.split("Bearer ")[1] : authorization;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userController.getById(decoded._id);
    if (!user) {
      return res.status(400).json({ error: "No existe el usuario" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Ha habido un error puede haber caducado el token" });
  }
};





const isAuthenticated = (req, res, next) => {
  verifyToken(req, res, next);
};





export {
    isAuthenticated
};