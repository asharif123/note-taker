const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

//grab the data from db.json file
const notes = require('./public/db/db.json');

app.use(express.json());
app.use(express.urlencoded({extended: true}));