const express = require("express");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

const app = express();

require('dotenv').config();
connectDB();

app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));  
app.use("/api/applications", require("./routes/appRoutes"));
app.use("/api/getStats", require("./routes/dashRoute"));
app.use(errorHandler)
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});