const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors');
const fs = require('fs')
const { parseSync } = require ('subtitle')

app.use(express.json());
app.use(cors());

app.get('/vtt', (req, res) => {
  const input = fs.readFileSync('./assets/video/video.vtt', 'utf8')
  const result = parseSync(input)
  res.json(result)
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))