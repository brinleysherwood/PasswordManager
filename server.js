const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs'); 
const url = require('url');
const path = require('path');
const mysql = require('mysql');
const qs = require('querystring');

// Our database table name.
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));


// Database connection constant made for future query creation
const con = mysql.createConnection({
  host: '107.180.1.16',
  user: 'spring2024Cteam4',
  password: 'spring2024Cteam4',
  database: 'spring2024Cteam4',
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});



app.post('/newuser', (req, res) => {
  const { firstName, lastName, email, newPassword } = req.body;

  if (!firstName || !lastName || !email || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Request body: ', req.body);

  const sql = 'INSERT INTO user (fname, lname, email, master_password) VALUES (?, ?, ?, ?)';
  con.query(sql, [firstName, lastName, email, newPassword], (error, results) => {
    if (error) {
      console.error('Error inserting data into the database: ', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true });

    }
  });
});

/* BRINLEY SHERWOOD 
beginning code to handle log in requests
*/

// POST route to handle login request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  /// Query the database to check if the user exists and the credentials are correct
  const sql = 'SELECT * FROM user WHERE email = ? AND master_password = ?';
  con.query(sql, [username, password], (error, results) => {
    if (error) {
      console.error('Error querying the database: ', error);
      res.sendStatus(500); // Internal server error
      return;
    }

    if (results.length > 0) {
      res.redirect('/dashboard.html'); // Redirect to dashboard.html upon successful login
    } else {
      res.sendStatus(401); // Send unauthorized status code
    }
  });
});

// app.get('/home', (req, res) => {
//   res.send('Welcome to the home page!');
// });

// END CODE FOR LOG IN

const port = 8200;
app.listen(port, () => {
  console.log(`The web server is alive! \nListening on http://localhost:${port}`);
});
