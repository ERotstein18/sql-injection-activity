const sqlite3 = require('sqlite3').verbose();
const http = require('http'),
      path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser');
 

const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error initializing SQLite database:', err.message);
    return process.exit(1);
  }
  console.log('Connected to SQLite database.');
  db.run(
    'CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, title TEXT)',
    () => {
      db.run(
        'INSERT INTO user (username, password, title) VALUES (?, ?, ?)',
        ['aa', 'aa', 'User of an app with vulnerable source code'],
        (err) => {
          if (err) {
            console.error('Error inserting user:', err.message);
          } else {
            console.log('User inserted successfully.');
          }
        }
      );
    }
  );
});

// Routes
app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";
  
  console.log("username: ", username);
  console.log("password: ", password);
  console.log("query: ", query);

db.get(query, function (err, row) {
  
  if (err) {
    console.error('Error executing query:', err.message);
    res.status(400).send('Error executing query');
  } else {
    
    // If no rows are returned, the user is unauthorized  . Otherwise, send back the data for that user.
    if (!row) {
      console.log('No user found');
      res.json({'user': 'unauthorized'});   
    } else {
      console.log('User found');
      res.json(row);
    }
  }
});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));