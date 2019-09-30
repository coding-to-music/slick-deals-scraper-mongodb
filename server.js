const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const dealsController = require('./controllers/deals.controller.js');

const PORT = process.env.PORT || 3000;

const app = express();

// connect mongodb heroku
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webscrapeDeals';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// npm morgan; create log directory
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// MIDDLEWARE
// handle url encoded data; parse json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make public static
app.use(express.static('public'));

// handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// deals controller routing
app.use(dealsController);

// start server and listen for client requests
app.listen(PORT, () => console.log(`Server listening on: http://localhost:${PORT}`));