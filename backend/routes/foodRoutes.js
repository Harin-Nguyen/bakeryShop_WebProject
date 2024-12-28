import express from "express";
import {
  addFood,
  filter,
  listFood,
  removeFood,
  searchFood,
} from "../controllers/food.controller.js";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/search", searchFood);
foodRouter.get("/filter", filter);

export default foodRouter;
