require('dotenv').config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const { json } = require("express");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:3000", // or your React dev server port
    "http://127.0.0.1:3000"
  ],
  credentials: true
}));


const analyzerRouter = require('./routes/analyzer.route');


app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.use('/api/analyzer', analyzerRouter);

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
