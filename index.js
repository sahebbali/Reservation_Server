var express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const hotelsRoute = require("./routes/hotels");
const roomsRoute =require ("./routes/rooms");
const cookieParser= require("cookie-parser");
const cors = require("cors");

const app = express();
dotenv.config();


const db=process.env.MONGO;

mongoose.connect(db,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log("Database Connection Sucessfull");
})
.catch((err)=>{
  console.log("Database Connection Field!!",err);
})

app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
app.get("/user",(req,res)=>{
  res.send("Hello User Metohod");
})
app.get("/",(req,res)=>{
  res.send("wellcome to Fitbook");
})
app.listen(8000, () => {
  console.log("Connected to backend port 8000.");
});
