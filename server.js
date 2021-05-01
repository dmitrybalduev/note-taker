const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get("/api/notes",  (req, res) => {
    fs.readFile("db/db.json", "utf8", function (err, notes) {
        if (err) throw err;
        //check if file is empty. if yes, return empty {}
        if(notes){
            res.json(JSON.parse(notes)); 
        } else{
            res.json("{}");
        }
    })
});

app.post("/api/notes",  (req, res) => {
    const note = req.body;
    let notesArray;
    let id;
    //reading file db.json
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        //if file is empty, assign empty array value, otherwise parse json data to array
        notesArray = data.length === 0? []: JSON.parse(data);
        //checking if array is empty, if yes assign id = 1, else getting last element's id 
        //and increment it by 1 so we always have unique id
        //will also work after deleting notes from list
        id = notesArray.length === 0 ? 1: notesArray[notesArray.length - 1].id + 1;

        //saving data to new object and push it to array
        let newObj = {
            id: id,
            title: note.title,
            text: note.text,
        }
        notesArray.push(newObj);

        //writing a file with additional note
        fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(notesArray),  (error) => {
            if (error) throw error; 
            res.json(newObj);
        });
    });
});

app.delete(`/api/notes/:some_id`, (req, res) =>{
    //reading data from db file
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf-8", (err, data) => {
        if(err) throw err;
        let notes = JSON.parse(data);
        //filtering notes and saving notes that don't have same id as provided in request.
        let newnotes = notes.filter((item) => item.id != req.params.some_id);
        //writing all notes to db file
        fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(newnotes),  (error) => {
            if (error) throw error; 
            //sending response with modified notes
            res.json(newnotes);
        });
    });

});



app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
