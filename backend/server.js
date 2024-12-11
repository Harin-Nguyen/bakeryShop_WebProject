import express from "express";
import foodRouter from "./routes/foodRoutes.js";
import cors from "cors";
import  connectDB from "./config/db.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'));

app.get("/",(req,res)=>{
  res.send("API Working")
})

app.get('/', (req, res) => {
    res.send("Don't touch this shit")
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}, url : http://localhost:${port}`);
});

connectDB();

app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/images", express.static('uploads'));