import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Client } = pg;

import cors from "cors";
app.use(cors());

// Use this if you want to configure specific parameters with CORS
// app.use(
//   cors({
//     origin: "http://127.0.0.1:5500",
//     methods: "GET",
//   })
// );

const port = process.env.PORT || 8000;

app.get("/api/crops", async (req, res, next) => {
  try {
    const client = new Client(process.env.DATABASE_URL);
    client.connect();
    const { rows } = await client.query("SELECT * FROM crop");
    console.log(rows);
    res.send(rows);
    client.end();
  } catch (err) {
    next({ status: err.status, message: err.message });
  }
});

app.post("/api/crops", async (req, res, next) => {
  let cropName = req.body.name;
  let growth = req.body.growth_time;
  let regrowth_time = req.body.regrowth_time;
  let regrowth = false;
  let seed = req.body.seed_price;
  let sell = req.body.sell_price;
  let season = req.body.season;

  if (regrowth > 0) {
    regrowth = true;
  }

  const query = {
    text: "INSERT INTO crop (name, growth_time, regrowth, regrowth_time, seed_price, sell_price, season) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    values: [cropName, growth, regrowth, regrowth_time, seed, sell, season],
  };

  const client = new Client(process.env.DATABASE_URL);
  client.connect();
  const { rows } = await client.query(query);
  if (rows.length === 0) {
    next({ status: 400, message: "Bad Request" });
  } else {
    res.send(rows);
  }
  client.end();
});

app.use((req, res, next) => {
  next({ status: 404, message: "Not Found" });
});

app.use((error, req, res, next) => {
  res.status(error.status).send(error.message);
});

app.listen(port, function () {
  console.log(`server is running on ${port}`);
});
