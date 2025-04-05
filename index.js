console.log('Starting the server...');


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const Url = mongoose.model('Url', new mongoose.Schema({
  originalUrl: String,
  shortId: String,
}));

// API Routes
app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(6);
  const url = new Url({ originalUrl, shortId });
  await url.save();
  res.json({ shortUrl: `http://localhost:5000/${shortId}` });
});

app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const url = await Url.findOne({ shortId });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Start Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
