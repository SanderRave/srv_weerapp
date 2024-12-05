import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Import CORS
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL || 'https://waterwebservices.rijkswaterstaat.nl';
const PORT = process.env.PORT || 5001; // Default to 5001 if not set in .env

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Serve React app (frontend)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Log server start
console.log(`Server setup in progress...`);
console.log(`Environment Variables - PORT: ${PORT}, API_URL: ${API_URL}`);

// API Route: Fetch temperature data from Rijkswaterstaat
app.post('/api/temperature', async (req, res) => {
  const url = `${API_URL}/ONLINEWAARNEMINGENSERVICES_DBO/OphalenLaatsteWaarnemingen`;

  console.log(`[POST /api/temperature] Incoming request with body:`, req.body);

  const body = {
    LocatieLijst: [{ Code: 'HOEK', X: 576917.675576278, Y: 5759136.13463449 }],
    AquoPlusWaarnemingMetadataLijst: [
      { AquoMetadata: { Compartiment: { Code: 'OW' }, Grootheid: { Code: 'T' } } },
      { AquoMetadata: { Compartiment: { Code: 'LT' }, Grootheid: { Code: 'T' } } },
    ],
  };

  console.log(`[POST /api/temperature] Sending API request to ${url}`);
  console.log(`[POST /api/temperature] Request payload:`, body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`[POST /api/temperature] Rijkswaterstaat response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Rijkswaterstaat API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[POST /api/temperature] Rijkswaterstaat response data:`, data);

    res.json(data);
  } catch (error) {
    console.error(`[POST /api/temperature] Error fetching temperature data:`, error.message);
    res.status(500).json({ error: 'Failed to fetch temperature data' });
  }
});

// Catch-all route to serve React frontend
app.get('*', (req, res) => {
  console.log(`[GET /*] Serving frontend`);
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Using Rijkswaterstaat API base URL: ${API_URL}`);
});
