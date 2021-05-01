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
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        notesArray = data.length === 0? []: JSON.parse(data);
        // id = notesArray[notesArray.length - 1].id + 1;
        id = notesArray.length === 0 ? 1: notesArray[notesArray.length - 1].id + 1;
        let newObj = {
            id: id,
            title: note.title,
            text: note.text,
        }
        notesArray.push(newObj);

        fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(notesArray),  (error) => {
            if (error) throw error; 
            res.json(newObj);
        });
    });
});

app.delete(`/api/notes/:some_id`, (req, res) =>{
    console.log("ENTERING DELETE METHOD");
    console.log(req.params);
    console.log(req.params.some_id);
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf-8", (err, data) => {
        if(err) throw err;
        let notes = JSON.parse(data);
        let newnotes = notes.filter((item) => item.id != req.params.some_id);
        console.log(newnotes);

        fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(newnotes),  (error) => {
            if (error) throw error; 
            res.json(newnotes);
        });
    });

});



app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
