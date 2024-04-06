const express = require('express');
const path = require('path');
const { webData } = require('./webData');

const app = express();
app.use(express.static('./public'))

const hostName = 'localhost';
const port = 3000;

app.get('/website/data', (req, res) => {
  res.json(webData);
})

app.get('*', (req, res) => {
  res.status(404).send('resource not found');
})

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}`);
});

