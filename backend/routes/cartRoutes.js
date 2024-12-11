import express from "express";
import { addCart } from "../controllers/cart.controller.js";
import authenticationMiddleware from "../middleware/authentication.js";

const cartRouter = express.Router();

cartRouter.post("/add", authenticationMiddleware, addCart);

export default cartRouter;