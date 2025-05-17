require('dotenv').config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
// const cors = require("cors");

const { json } = require("express");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: [
//       "http://127.0.0.1:5173",
//       "http://127.0.0.1:5174",
//       "http://localhost:5173",
//       "http://127.0.0.1:9545/",
//     ],
//   })
// );


const analyzerRouter = require('./routes/analyzer.route');


app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.use('/api/analyzer', analyzerRouter);

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
