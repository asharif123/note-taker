const express = require('express');
const path = require('path');

const fs = require('fs');
const util = require('util');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

// see if there is a port available in process environment
// else list to server at port 3001
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

// display the index.html webpage
app.get('/', (req, res) => {
    res.redirect("index.html");
    // res.sendFile(path.join(__dirname, '/public/index.html'))
})

//display notes.html webpage
app.get('/notes', (req, res) => {
    res.redirect("notes.html");
    // res.sendFile(path.join(__dirname, './public/notes.html'))
})

//`GET /api/notes` should read the `db.json` file 
// and return all saved notes as JSON.

//util.promisify takes a function following the common Node.js callback style, i.e. taking a (err, value) => 
//… callback as the last argument, and returns a version that returns promises.
// const readFromFile = util.promisify(fs.readFile);

//without the await method, readFromFile never finishes its process
app.get('/api/notes', async (req, res) => {
    console.log(`${req.method} METHOD received to grab all notes!`);
    const db = fs.readFileSync('./public/db/db.json', 'utf-8');
    const notes = JSON.parse(db || [])
    // await readFromFile('./public/db/db.json').then((data) => res.json(JSON.parse(data || [])));
    res.json(notes)
});

// `POST /api/notes` should receive a new note to save on the request body, 
// add it to the `db.json` file, 
// and then return the new note to the client. 


app.post('/api/notes', (req, res) => {
    const title = req.body.title;
    const text = req.body.text;
    if (title, text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };
        const response = {
            status: 'success',
            body: newNote,
        };
    
        try {
            const notes = fs.readFileSync('./public/db/db.json', 'utf-8');
            console.log("NOTES", notes); // returns a number instead of notes
            const jsonNotes = JSON.parse(notes);
            console.log("json NOTES", jsonNotes);
            console.log("NEW NOTE", newNote); // returns note { title: 'ddd', text: 'gsgs', id: '0ae1' }
            jsonNotes.push(newNote); 
            console.log("ALL NOTES", jsonNotes); // returns a number instead of notes
            fs.writeFileSync('./public/db/db.json', JSON.stringify(jsonNotes));

        }
        catch (error) {
            
            console.log(`${error} has been found!`);
            res.json(error);
        }
    // if we run into error, response will not be called
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