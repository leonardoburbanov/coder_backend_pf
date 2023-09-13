import { Router } from "express";
import MockingController from "../controllers/mocking.controllers.js";

const router = Router();

const mockingController = new MockingController();
router.get("/", mockingController.getProducts);


export default router;
