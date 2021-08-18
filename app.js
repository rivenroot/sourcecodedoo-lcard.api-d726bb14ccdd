const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");
require('dotenv').config();

const PORT = process.env.API_PORT || 8000;
const HOST = process.env.HOST || 'localhost';
const MONGO_URI = 'mongodb+srv://AWS:SamSung1316!@cluster0.zifzp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


var privateKey = fs.readFileSync('/etc/letsencrypt/live/lcard.startify.dev/privkey.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/live/lcard.startify.dev/fullchain.pem');

var credentials = {key: privateKey, cert: certificate};

mongoose.connect(MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connection Success.');
  })
  .catch((err) => {
    console.error('Mongo Connection Error', err);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.get('/ping', (_req, res) => res.send({
  error: false,
  message: 'Server is working',
}));

app.use('/users', require('./routes/users'));
app.use('/url-design', require('./routes/urlDesign'));
app.use('/user-file', require('./routes/fileUpload'));

// app.listen(PORT, HOST, () => {
//   console.log(`Server started listening on PORT:${PORT}`);
// });
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT);
