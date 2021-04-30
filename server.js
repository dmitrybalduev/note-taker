const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get("/api/notes",  (req, res) => {
    fs.readFile("db/db.json", "utf8", function (err, notes) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(JSON.parse(notes)); 
    })
});





app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
