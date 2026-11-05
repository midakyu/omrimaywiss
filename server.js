console.log("Server log - start again");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static('public'));

// Create the SQLite database object
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('DEMODB', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the table if it doesn't exist yet
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Gname TEXT,
    Wname REAL,
    Hname REAL,
    Protein REAL
)`);

// Route to serve your index.html
app.get('/', function(request, response) {
    console.log("In app.get (/)");
    response.sendFile(__dirname + '/views/index.html');
});

// Process the HTTP POST request for /putData
app.post("/putData", function (request, response) {
    console.log("In app.post (/putData)", request.body);
    
    const { Gname, Wname, Hname } = request.body;

    // Calculator Logic: e.g., 1.6g per kg of body weight (adjusted by gender if desired)
    let multiplier = 1.6;
    if (Gname && Gname.toLowerCase() === 'female') {
        multiplier = 1.4;
    }
    const calculatedProtein = Wname * multiplier;

    // Safe parameterized insert query into SQLite
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

// Start server
var listener = app.listen(process.env.PORT || 3000, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
