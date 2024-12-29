import foodModel from "../models/food.model.js";
import fs from "fs";

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error detected" });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error detected" });
  }
};

const removeFood = async (req, res) => {
  try {
    const foods = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error detected" });
  }
};

const searchFood = async (req, res) => {
  try {
    const { name, category } = req.query;

    const searchCriteria = {};

    if (name) {
      searchCriteria.name = { $regex: name, $options: "i" };
    }

    if (category) {
      searchCriteria.category = { $regex: category, $options: "i" };
    }

    const foods = await foodModel.find(searchCriteria);

    if (foods.length === 0) {
      return res
        .status(404)
        .json({ message: "No food items found matching the search criteria." });
    }

    return res.status(200).json({ foods });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error during food search." });
  }
};

const filter = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const priceFilter = {};

    if (minPrice) {
      priceFilter.$gte = Number(minPrice);
    }

    if (maxPrice) {
      priceFilter.$lte = Number(maxPrice);
    }

    const foods = await foodModel.find(priceFilter);

    if (foods.length === 0) {
      return res.status(404).json({ message: "No food items found." });
    }

    return res.status(200).json({ foods });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error during food price filtering." });
  }
};

const getFoodDetail = async (req, res) => {
  const { foodId } = req.params;

  try {
    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const relatedFoods = await foodModel
      .find({
        category: food.category,
        _id: { $ne: foodId },
      })
      .limit(5);

    res.status(200).json({
      food,
      relatedFoods,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addFood, listFood, removeFood, searchFood, filter, getFoodDetail };
