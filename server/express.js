import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;

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
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query("SELECT * FROM crop ORDER BY id ASC");
    res.send(rows);
    pool.end();
  } catch (error) {
    next({ status: 400, message: error.message });
  }
});

app.get("/api/crops/:cropSeason", async (req, res, next) => {
  let cropSeason = req.params.cropSeason;
  try {
    const query = {
      text: "SELECT * FROM crop WHERE season = $1",
      values: [cropSeason],
    };
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query(query);
    res.send(rows);
    pool.end();
  } catch (error) {
    next({ status: 400, message: error.message });
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

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      next({ status: 400, message: "Bad Request" });
    } else {
      res.send(rows);
    }
    pool.end();
  } catch (error) {
    alert(error.message);
    next({ status: 400, message: error.message });
  }
});

app.put("/api/crops/:cropId", async (req, res, next) => {
  let id = req.params.cropId;
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
    text: `UPDATE crop SET (name, growth_time, regrowth, regrowth_time, seed_price, sell_price, season) = ($1, $2, $3, $4, $5, $6, $7) WHERE id = ${id} RETURNING *`,
    values: [cropName, growth, regrowth, regrowth_time, seed, sell, season],
  };

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      next({ status: 400, message: "Bad Request" });
    } else {
      res.send(rows);
    }
    pool.end();
  } catch (error) {
    next({ status: 400, message: error.message });
  }
});

app.delete("/api/crops/:cropIndex", async function (req, res, next) {
  let index = req.params.cropIndex;
  const query = {
    text: "DELETE FROM crop WHERE id = $1 RETURNING *",
    values: [index],
  };

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query(query);
    res.send(rows);
    pool.end();
  } catch (error) {
    next({ status: 400, message: error.message });
  }
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
