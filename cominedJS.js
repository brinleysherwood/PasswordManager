const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

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

  const sql = 'INSERT INTO user (fname, lname, email, master_password) VALUES (?, ?, ?, ?)';
  con.query(sql, [firstName, lastName, email, newPassword], (error, results) => {
    if (error) {
      console.error('Error inserting data into the database: ', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    } else {
      console.log('Data inserted successfully');
      res.redirect('index.html?success=true');
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM user WHERE email = ? AND master_password = ?';
  con.query(sql, [username, password], (error, results) => {
    if (error) {
      console.error('Error querying the database: ', error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      res.redirect('/dashboard.html');
    } else {
      res.sendStatus(401);
    }
  });
});

const port = 8200;
app.listen(port, () => {
  console.log(`The web server is alive! \nListening on http://localhost:${port}`);
});

// Client-side JavaScript

function register() {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  alert(`Registration Details:\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPassword: ${password}`);
}

function login() {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/dashboard.html';
    } else {
      alert('Login failed. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

var site;
var user;
var password;
var results;

function initialize() {
  results = document.getElementById('accountResultsId');
}

function clearInputs() { 
  document.getElementById("websiteInput").value = "";
  document.getElementById("usernameInput").value = "";
  document.getElementById("passwordInput").value = "";
}

function runAccounts() {
  site = document.getElementById("websiteInput").value;
  user = document.getElementById("usernameInput").value;
  password = document.getElementById("passwordInput").value;

  console.log(site);
  console.log(user);
  console.log(password);

  var tableRowNumber = 1;
  var row = results.insertRow(tableRowNumber);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);

  cell0.innerHTML = site;
  cell1.innerHTML = user;
  cell2.innerHTML = password;

  tableRowNumber++;
}
