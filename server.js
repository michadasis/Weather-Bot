const express = require('express');
const server = express();

server.all('/', (req, res) => {
  res.send('<p>Hosting Active</p>');
});

function keepAlive() {
  server.listen(3000, () => { console.log('Server is online!'); });
}

module.exports = keepAlive;
