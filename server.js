const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');

// Our Database table name
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.use(session({
  secret: '1&UvDgj9!oYpL$FqA5s@ZxGm2', // This is the secret password used to sign the session ID cookie, which is sent to browser. 
  resave: false,
  saveUninitialized: true
}));

const con = mysql.createConnection({
  host: '107.180.1.16',
  user: 'spring2024Cteam4',
  password: 'spring2024Cteam4',
  database: 'spring2024Cteam4',
});

con.on('error', function(err) {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Attempt to reconnect
    con.connect(function(error) {
      if (error) {
        console.error('Error reconnecting:', error);
      } else {
        console.log('Reconnected to database');
      }
    });
  } else {
    throw err;
  }
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
      res.redirect('index.html?success=false');
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
      req.session.firstName = results[0].fname;
      req.session.user_id = results[0].user_id
      console.log('User first name set in session:', req.session.firstName);
      res.redirect('/dashboard.html');
    } else {
      res.sendStatus(401);
    }
  });
});

// gets the user first name and stores it in id to be used in dashboard.html
app.get('/user', (req, res) => {
  if (req.session.firstName && req.session.user_id) {
    res.json({ firstName: req.session.firstName, userId: req.session.user_id });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

const port = 8200;
app.listen(port, () => {
  console.log(`The web server is alive! \nListening on http://localhost:${port}`);
});

/*
CALEB FROST
Created below is the get request that will display the logged in user's accounts
*/
app.get('/accounts', (req, res) => {
  const user_id = req.session.user_id; // setting the constant user_id variable with the express-session middleware

  if(!user_id){
    return res.sendStatus(401); //Unauthorized to see accounts if user_id is not validated
  }

  con.query('SELECT * FROM Account WHERE user_id = ?', [user_id], (error, results) => {
    if (error) {
      console.error('Error querying the database: ', error);
      res.sendStatus(500); //Internal server error
      return;
    }

    console.log('Accounts retrieved:', results); 
    res.json(results);
  })
})

// Add new accounts associated with the user to the database
// Define a route handler for inserting a new account
app.post('/insertUserInput', (req, res) => {
  const user_id = req.session.user_id; // Get user ID from session or request

  if (!user_id) {
      return res.sendStatus(401); // Check if user is authorized to add accounts
  }

  const { username, password, websiteName } = req.body;

  if (!username || !password || !websiteName) {
    console.log('Missing required fields')
    return res.sendStatus(400);
  }
  if (error) {
        console.error('Error inserting into the database:', error);
        return res.sendStatus(500); // Internal server error
    }

  // Execute SQL query to insert a new row into the Account table
  con.query('INSERT INTO Account (user_id, Username, Password, WebsiteName) VALUES (?, ?, ?, ?)', [user_id, username, password, websiteName], (error, result) => {
    // This checks to make sure there are all required fields.
    if (!username || !password || !websiteName) {
      console.log('Missing required fields')
      return res.sendStatus(400);
    }
    
    if (error) {
          console.error('Error inserting into the database:', error);
          return res.sendStatus(500); // Internal server error
      }

      console.log('New account inserted:', result);
      res.status(201).json({ message: 'Account inserted successfully' });
  });
});

// log out user and clear session data
app.post('/logout', (req, res) => {
  req.session.destroy(); // Clear session data
  res.sendStatus(200); // Respond with success status
});
