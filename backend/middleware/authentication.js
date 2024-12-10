import  jwt from "jsonwebtoken";

const authenticationMiddleware = async (req, res, next) => {
    const {token} = req.headers;
    if(!token) {
        return res.json({success: false, message: "Login unauthorized"});
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userID = token_decode.id;
        next();
    } catch(error) {
        console.log(error);
        res.json({success: false, message: "Error detected"});
    }
}

export default authenticationMiddleware;