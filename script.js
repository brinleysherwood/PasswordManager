// Use body parser to parse information to JSON
app.use(bodyParser.json());

// Database connection
con.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});


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

// Move the registration route outside the register function
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
      res.status(200).json({ success: true });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

/* BRINLEY SHERWOOD
beginning logic for login validation below! */

// login function 
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
      // Redirect to home page if login is successful
      window.location.href = '/dashboard.html'; 
    } else {
        alert('Login failed. Please try again.');
    }
})
.catch(error => {
    console.error('Error:', error);
});
}