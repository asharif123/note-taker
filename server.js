const express = require('express');
const path = require('path');

const fs = require('fs');
const util = require('util');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// display the index.html webpage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

//display notes.html webpage
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

//`GET /api/notes` should read the `db.json` file 
// and return all saved notes as JSON.

//util.promisify takes a function following the common Node.js callback style, i.e. taking a (err, value) => 
//… callback as the last argument, and returns a version that returns promises.
const readFromFile = util.promisify(fs.readFile);


app.get('/api/notes', (req, res) => {
    console.log(`${req.method} METHOD received to grab all notes!`);
    readFromFile('./public/db/db.json').then((data) => res.json(JSON.parse(data)));

});

// `POST /api/notes` should receive a new note to save on the request body, 
// add it to the `db.json` file, 
// and then return the new note to the client. 


app.post('/api/notes', (req, res) => {
    const noteTitle = req.body.Title;
    const noteText = req.body.Text;
    if (noteTitle, noteText) {
        const newNote = {
            noteTitle,
            noteText,
            id: uuid()
        };
    const response = {
        status: 'success',
        body: newNote,
    };
    
    fs.writeFile('./public/db/db.json', JSON.stringify(newNote), (err) => {
        if (err) {
            console.log(`${err} has been found!`);
        }
        else {
            console.log("SUCCESS!");
        }
    })
    res.json(response)

    }

    

    else {
        res.json(`Error in adding note!`)
    }

})



//listen to the particular PORT to render index.html webpage
app.listen(PORT, () => 
    console.log(`Express server port listening at ${PORT}!`)
);