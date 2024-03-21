const express = require("express");
const { getCosmWasmClient } = require("@sei-js/core");
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

const cosmWasmClient = getCosmWasmClient("https://sei-rpc.brocha.in/");
let statisticData = {};
let LBData = {};

app.use(cors());

const fetchStatistic = async () => {
  const response = await (
    await cosmWasmClient
  ).queryContractSmart(process.env.NEXT_PUBLIC_STEIK_ADDRESS || "", {
    get_state: {},
  });
  return response?.state;
};

const fetchLBData = async () => {
  const response = await (
    await cosmWasmClient
  ).queryContractSmart(process.env.NEXT_PUBLIC_STEIK_ADDRESS || "", {
    get_claimed_list: {},
  });
  return response?.claimed_info;
};
const fetchUpdate = async () => {
  try {
    LBData = await fetchLBData();
    statisticData = await fetchStatistic();
  } catch (e) {
    console.log(e);
  }

  setTimeout(() => {
    fetchUpdate();
  }, 60 * 1000);
};

fetchUpdate();

// Middleware
app.use(express.json());

// Basic route for GET request
app.get("/fetch-statistic", (req, res) => {
  try {
    res.send(statisticData);
  } catch (e) {
    console.log(e);
  }
});

app.get("/fetch-lbdata", (req, res) => {
  try {
    res.send(LBData);
  } catch (e) {
    console.log(e);
  }
});
// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
