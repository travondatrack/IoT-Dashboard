const express = require('express');
const cors = require('cors');
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config(); // Nạp biến từ .env

const app = express();
app.use(cors());
app.use(express.json());

const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const databaseId = "ESP32";

app.get('/containers', async (req, res) => {
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
    const containers = await database.containers.readAll().fetchAll();
    res.json(containers.resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/query', async (req, res) => {
  const { containerId, query } = req.body;
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
    const container = database.container(containerId);
    const results = await container.items.query(query).fetchAll();
    res.json(results.resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
