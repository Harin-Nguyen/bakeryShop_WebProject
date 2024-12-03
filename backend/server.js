import express from "express";
import foodRouter from "./routes/foodRoutes";
import cors from "cors";
import {connectDB} from "./config/db.js"

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Don't touch this shit")
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}, url : http://localhost:${port}`);
});

connectDB();

app.use("/api/food", foodRouter);