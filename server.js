console.log("Server log - start again");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public'));

// Create the database object
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('DEMODB', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the users/calculator table if it doesn't exist yet
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Gname TEXT,
    Wname REAL,
    Hname REAL,
    Protein REAL
)`);

// Debug route: show all data in your table
app.get("/show-data", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            console.error("DB error:", err.message);
            res.status(500).send("Database error");
            return;
        }
        res.json(rows); // Send back all rows as JSON
    });
});

// This is called when the app is first started
app.get('/', function(request, response) {
    console.log("In app.get (/)");
    response.sendFile(__dirname + '/views/index.html');
});

// Process the HTTP POST request for /putData
app.post("/putData", function (request, response) {
    console.log("In app.post (/putData)", request.body);
    
    // Extract fields sent from client.js (Gname, Wname, Hname)
    const { Gname, Wname, Hname } = request.body;

    // Basic protein calculation logic (e.g., 1.6g per kg, adjusted slightly by gender)
    let multiplier = 1.6;
    if (Gname && Gname.toLowerCase() === 'female') {
        multiplier = 1.4;
    }
    const calculatedProtein = Wname * multiplier;

    // Safe parameterized insert query
    let query = `INSERT INTO users (Gname, Wname, Hname, Protein) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [Gname, Wname, Hname, calculatedProtein], function(err) {
        if (err) {
            console.error("Insert error:", err.message);
            return response.status(500).json({ error: err.message });
        }
        response.json({ 
            message: 'Success', 
            id: this.lastID, 
            protein: calculatedProtein 
        });
    });
});

// Process the HTTP GET request for /getData
app.get('/getData', function(request, response) {
    console.log("In app.get (/getData)");
    db.all('SELECT * FROM users', [], function(err, rows) {
        if (err) {
            console.error("Fetch error:", err.message);
            return response.status(500).json({ error: err.message });
        }
        response.send(JSON.stringify(rows));
    });
});

// Listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
