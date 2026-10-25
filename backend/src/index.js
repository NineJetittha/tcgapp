const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cardRoutes = require('./routes/cardRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tcg_store';
const NODERED_URL = process.env.NODERED_URL || 'http://localhost:1880';

app.use(cors());
app.use(express.json());
app.use('/api/cards', cardRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/health/integrations', async (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  let nodeRedConnected = false;

  try {
    const response = await fetch(`${NODERED_URL}/`, { signal: AbortSignal.timeout(3000) });
    nodeRedConnected = response.ok;
  } catch (error) {
    console.error('Node-RED health check failed:', error.message);
  }

  const status = databaseConnected && nodeRedConnected ? 'ok' : 'degraded';
  res.status(status === 'ok' ? 200 : 503).json({
    status,
    database: databaseConnected ? 'connected' : 'disconnected',
    nodeRed: nodeRedConnected ? 'connected' : 'disconnected'
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Node-RED URL: ${NODERED_URL}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();