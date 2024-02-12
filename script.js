const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mysql = require('mysql');
const qs = require('querystring');

// Our database table name.
const db = 'user';

// Database connection constant made for future query creation
const con = mysql.createConnection({
    host: '107.180.1.16',
    user: 'spring2024Cteam4',
    password: 'spring2024Cteam4',
    database: 'spring2024Cteam4',
});

function login() {
  // Add login logic here (e.g., validate credentials)
  alert('Login functionality coming soon!');
} 


async function register() {
  // Included to make sure that the default submission doesn't happen.
  event.preventDefault();

  // Fetch values from the form
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Check if passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Password validation
  var uppercaseRegex = /[A-Z]/;
  var lowercaseRegex = /[a-z]/;
  var specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  var numericRegex = /[0-9]/;

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !specialCharRegex.test(password) || !numericRegex.test(password)) {
    alert("Password must contain at least one uppercase letter, one lowercase letter, one special character, and one numeric digit.");
    return;
  }

  // Add registration logic here (e.g., send data to server)
  // For now, just displaying the values (in a real scenario, send this data to the server)
  alert(`Registration Details:\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPassword: ${password}`);
}

/*
CALEB FROST
I am going to make below a connection to the database and 
a connection to the server. I will create a query to add the content
the user enters to the database.
*/
  app.post('/createAccount', (req, res) => {
  
  }
