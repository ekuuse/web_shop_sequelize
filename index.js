const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const productAdminRoutes = require('./routes/admin/product')
app.use('/admin', productAdminRoutes)

const productRoutes = require('./routes/product')
app.use(productRoutes)

const sequelize = require("./util/db");

const models = require('./models/index')
sequelize.models = models

sequelize
  .sync()
  .then(() => {
    console.log("db works");
  })
  .catch((error) => {
    console.error(error);
  });

app.get("/", (req, res) => {
  res.json({ message: "web shop app" });
});

app.listen(3002);
