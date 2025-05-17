const app = require("express")();
const bodyParser = require("body-parser");
// const cors = require("cors");

const { json } = require("express");

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

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
