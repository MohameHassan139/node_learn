const express = require('express')
var cors = require('cors')
require('dotenv').config();
const httpStatusText = require('./utils/httpStatusText');
const app = express()
const port = process.env.PORT || 3000
const Path = require('path');

app.use('/uploads', express.static(Path.join(__dirname, 'uploads')));
// parse application/json
app.use(express.json());
// handle CORS ports between frontend and backend
app.use(cors())
// courses route
const coursesRoute = require('./route/courses.route');
app.use("/api/courses", coursesRoute);
// user route
const userRoute = require('./route/user.route');
app.use("/api/users", userRoute);
// email route
const emailRoute = require('./route/email.route');
app.use("/api/email", emailRoute);
// in case of wrong route
app.use((req, res) => {
  res.json({ status: httpStatusText.ERROR, message: "Route not found" });
});
app.use((err, req, res, next) => {
  res.status(err.statusCode||500).json({ status: err.statusText||httpStatusText.ERROR, message: err.message });
});

// app.use(express.static('views'));

const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL?.trim();
// const localMongoUrl = process.env.LOCAL_MONGO_URL?.trim() || "mongodb://127.0.0.1:27017/mydatabase";

async function connectDb(url) {
  return mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
}

async function startApp() {
  if (!mongoUrl) {
    console.error("MONGO_URL is not defined in .env");
    process.exit(1);
  }

  try {
    await connectDb(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB primary connection failed:", err.message || err);

    // if (mongoUrl.startsWith("mongodb+srv")) {
    //   console.warn("Atlas SRV connection failed. Trying local MongoDB fallback.");
    //   try {
    //     await connectDb(localMongoUrl);
    //     console.log("Connected to local MongoDB fallback");
    //   } catch (fallbackErr) {
    //     console.error("Local MongoDB fallback also failed:", fallbackErr.message || fallbackErr);
    //     process.exit(1);
    //   }
    // } else {
    //   process.exit(1);
    // }
  }

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

startApp();


// mongodb://mohamedhessan139_db_user:VHFryJjUGB179Ezo@ac-fm5m6zs-shard-00-00.onbbfsx.mongodb.net:27017,ac-fm5m6zs-shard-00-01.onbbfsx.mongodb.net:27017,ac-fm5m6zs-shard-00-02.onbbfsx.mongodb.net:27017/?replicaSet=atlas-xbo6gc-shard-0&ssl=true&authSource=admin



// VHFryJjUGB179Ezo
// mohamedhessan139_db_user

// mongodb+srv://mohamedhessan139_db_user:VHFryJjUGB179Ezo@cluster0.onbbfsx.mongodb.net/