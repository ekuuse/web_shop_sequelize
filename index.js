const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = require("./util/db");

sequelize
  .authenticate()
  .then(() => {
    console.log("connected db");
  })
  .catch((error) => {
    console.error("cant connect to db", error);
  });

app.get("/", (req, res) => {
  res.json({ message: "web shop app" });
});

app.listen(3002);
