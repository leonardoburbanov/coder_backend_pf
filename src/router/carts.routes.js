import { Router } from "express";
import CartsController from "../controllers/carts.controllers.js";
//import { userMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

const cartsController = new CartsController();

router.get("/", cartsController.getCarts);
router.get("/:idcart", cartsController.getCartById);
router.post("/", cartsController.addCart);
//router.post("/:idcart/product/:idproduct",userMiddleware,cartsController.addProductInCart);
router.post("/:idcart/product/:idproduct",cartsController.addProductInCart);
router.put("/:idcart/product/:idproduct", cartsController.updateProductInCart);
router.delete("/:idcart/product/:idproduct", cartsController.deleteProductInCart);
router.delete("/:idcart", cartsController.deleteCart);
router.put("/:idcart", cartsController.updateCart);
router.post("/:idcart/purchase", cartsController.purchaseCart);


export default router;
