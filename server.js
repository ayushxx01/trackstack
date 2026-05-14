const express = require("express");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const redisClient = require("./config/redisClient");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/applications", require("./routes/appRoutes"));
app.use("/api/getStats", require("./routes/dashRoute"));
app.use("/api/coldMails", require("./routes/mailRoutes"));

app.use(errorHandler);

const connectServer = async () => {
    try {

        // connect mongo
        await connectDB();
        console.log("MongoDB Connected");

        // connect redis
        await redisClient.connect();
        console.log("Redis Connected");

        // start server
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {

        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

connectServer();