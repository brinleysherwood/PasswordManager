document.addEventListener("DOMContentLoaded", function() {
    console.log('DOMContentLoaded event fired');
    // Fetch user data from server
    fetch('/user')
        .then(response => response.json())
        .then(data => {
          console.log('User data fetched:', data);
            const firstName = data.firstName;
  
            // Update HTML to display first name
            const userFirstNameElement = document.getElementById('userFirstName');
            if (!userFirstNameElement) {
                console.error("User first name element not found!");
                return;
            }
            userFirstNameElement.textContent = `Welcome, ${firstName}!`;
        })
        .catch(error => console.error('Error fetching user data:', error));
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    fetchAccounts();
  });
  
    function fetchAccounts() {
      fetch('/accounts')
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Error fetching accounts:', error));
    }
  
  // This function should help to update the table contents on the dashboard.
  function updateTable(accounts)
  {
    const tableBody = document.getElementById('accountResultsTable');
  
    console.log('Updating table with accounts:', accounts);
  
  
    accounts.forEach(account => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${account.WebsiteName}</td>
                      <td>${account.Username}</td>
                      <td>${account.Password}</td>`;
      tableBody.appendChild(row);
    });
  }

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
        alert('Login failed. Enter correct credentials, or create an account');
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