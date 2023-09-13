import { Router } from 'express';
import UsersController from "../controllers/users.controllers.js";
import { checkAuthenticated } from "../middlewares/auth.middleware.js";
import { uploaderDocument } from "../utils.js";


const router = Router();

const usersController = new UsersController();

router.put("/premium/:uidUser", usersController.updateUserRol);
router.delete("/:uidUser", usersController.deleteUser);
router.put("/:uid/documents",
    checkAuthenticated,
    uploaderDocument.fields(
        [{name:"identificacion",maxCount:1},
        {name:"domicilio", maxCount:1},
        {name:"estadoDeCuenta", maxCount:1}]), 
        UsersController.updateUserDocument
    )



export default router;
