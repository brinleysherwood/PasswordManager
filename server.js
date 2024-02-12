/*
CALEB FROST
I made the code below to send the data to the database from the form.
*/

const express = require('express');
const bodyParser = require('body-parser');
// const http = require('http');
// const fs = require('fs');
// const url = require('url');
const path = require('path');
const mysql = require('mysql');
// const qs = require('querystring');

// Creates express instance for node.js
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
// Parsing body contents to json to send to database
app.use(bodyParser.json());

//Referencing the home directory where all the files are (root directory. For me I named my folder v1 for version 1)
app.use(express.static(path.join(__dirname)));

// Database connection constant made for future query creation
const con = mysql.createConnection({
  host: '107.180.1.16',
  user: 'spring2024Cteam4',
  password: 'spring2024Cteam4',
  database: 'spring2024Cteam4',
});


// Connection to database. Returns error if unsucessful
con.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});


// Uses post method to reference the action element in the form within createAccount.html
app.post('/newuser', (req, res) => {
  const { firstName, lastName, email, newPassword, confirmPassword } = req.body;

  // Will not send query unless all elements are filled in.
  if (!firstName || !lastName || !email || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Logging request body in console for TS.
  console.log('Request body: ', req.body);

  // This is the query that we are sending via the server to the DB
  // MAYBE CREATE HERE AN IF STATEMENT TO MAKE SURE THAT THE PASSWORD MEETS THE REQUIREMENENTS
  const sql = 'INSERT INTO user (fname, lname, email, master_password) VALUES (?, ?, ?, ?)';
  con.query(sql, [firstName, lastName, email, newPassword], (error, results) => {
    if (error) {
      console.error('Error inserting data into the database: ', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    } else {
      console.log('Data inserted successfully');
      // res.status(200).json({ success: true });
      // Add redirect here so it goes back to the index.html page.
      res.redirect('/index.html?success=true'); // May or may not work
    }
  });
});

// This is the port I decided to use for the server and connection to DB.
const port = 8200;
app.listen(port, () => {
  console.log(`The web server is alive! \nListening on http://localhost:${port}`);
});
