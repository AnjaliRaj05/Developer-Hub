const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");


app.use(cors());


app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

// dotEnv Configuration
dotEnv.config({ path: "./.env" });

const port = process.env.PORT || 5001;

// mongoDB Configuration
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("DB successfully Connected");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); 
  });


// router configuration
app.use("/api/users", require("./router/userRouter"));
app.use("/api/posts", require("./router/postRouter"));
app.use("/api/profiles", require("./router/profileRouter"));

// access static file from client devhub
app.use(express.static(path.join(__dirname,'./Devhub-main/build')));
app.get('*',function (req, res) {
  res.sendFile(path.join(__dirname,'./Devhub-main/build/index.html'));
});
app.listen(port, () => {
  console.log(`Express Server is Started at PORT : ${port}`);
});
