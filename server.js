const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {elasticClient,connectDB, createIndex} = require("./config/elastic-db");
const userRoutes=require("./routes/userRoutes")
const elasticRoutes=require("./routes/elasticRoutes")

dotenv.config();

connectDB();

// createIndex("users")

const app = express();
app.use(express.json());
app.use(cors());



const PORT = process.env.PORT;

app.use("/auth/user",elasticRoutes)

// app.use("/elastic/user",elasticRoutes)

// app.post("/temp",async (req, res) => {
//   const result = await elasticClient.index({
//     index: "users",
//     document: {
//       title: req.body.title,
//       author: req.body.author,
//       content: req.body.content,
//     },
//   });

//   res.send(result);
// })

// app.get("/search", async (req, res) => {
//   // console.log("000",req.body.title)
//   const result = await elasticClient.search({
//     index: "users",
//     query:{ match_phrase:{content:req.body.content}} ,
//   });

//   res.json(result);
// });

// app.get("/search/all", async (req, res) => {
//   // console.log("000",req.body.title)
//   const result = await elasticClient.search({
//     index: "users",
//     "query": {
//       "match_all": {}
//   }
//   });

//   res.json(result);
// });

// app.put("/update/:id", async (req, res) => {
//   // console.log("000",req.body.title)
//   const result = await elasticClient.update({
//     index: 'users',
//     id: req.params.id,
//     "doc": {
//       "name": "new_name"
//     }
//   });

//   res.json(result);
// });

// app.delete("/delete/:id", async (req, res) => {
//   // console.log("000",req.body.title)
//   const result = await elasticClient.delete({
//     index: 'users',
//     id: req.params.id
//   });

//   res.json(result);
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
