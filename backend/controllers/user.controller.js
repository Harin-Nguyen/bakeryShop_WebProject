import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "Account doesnt exist"});
        }

        const check = await bcrypt.compare(password, user.password);
        if(!check) {
            return res.json({success: false, message: "Password incorrect!"});
        }

        const token = createToken(user._id);
        res.json({success: true, token});
    } catch(error) {
        console.log(error);
        res.json({success: false, message: "Error detected"});
    }
}