const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes")


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());



const PORT = process.env.PORT;

app.use("/auth/user",userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
