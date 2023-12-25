const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const UUID = require("uuid");
const session = require("express-session");
require("dotenv").config();
const app = express();

// Routes
//-------------
const propertyRoute = require("./routes/propertyRoute/index");
const userRoute = require("./routes/userRoute/index");
const url = "/homely/";

// Middleares
//----------------
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const expDate = 60 * 60 * 1000 * 24; // 1 hour 1 day
app.use(
  session({
    name: "homely-session",
    secret: UUID.v4(),
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: expDate,
      secure: false,
      sameSite: true, // 'strict'
    },
  })
);

//Endpoints
//---------------
app.use(`${url}property`, propertyRoute);
app.use(`${url}user`, userRoute);

app.listen(process.env.PORT, () =>
  console.log(`App running on ${process.env.PORT}`)
);


// Middlewares
// const whitelist = [
//   "https://TheoOkafor.github.io/my-awesome-app",
//   "http://localhost:5000",
// ];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
// cors(corsOptions),
