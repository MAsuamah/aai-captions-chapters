require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { writeCaptions } = require('./utils/write');
const { assembly } = require("./utils/assembly")

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  const transcript = await assembly.get(`/transcript/${process.env.TRANSCRIPT_ID}`)
  const srt = await assembly.get(`/transcript/${process.env.TRANSCRIPT_ID}/srt`)
  const captions = srt.data
  writeCaptions(captions)
  res.json(transcript.data)
});

app.set('port', 8000);
const server = app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${server.address().port}`);
});