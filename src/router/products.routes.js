import { Router } from "express";
import ProductsController from "../controllers/products.controllers.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";
import { uploaderProduct } from "../utils.js";

const router = Router();

const productsController = new ProductsController();

router.get("/", productsController.getProducts);
router.get("/:idProduct", productsController.getProductById);
router.post("/", productsController.addProduct);
router.put("/:idProduct", adminMiddleware, productsController.updateProduct);
router.delete("/:idProduct", productsController.deleteProduct);
router.patch("/:idProduct",uploaderProduct.fields([{name:"productImage",maxCount:1}]),ProductsController.updateProductImage);

export default router;
