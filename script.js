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

  // run fetchAccounts to build list of user's accounts
  fetchAccounts();

  // function to handle form submission for adding accounts to the list
  const form = document.getElementById('inputAccountsForm');
  const addAccountButton = document.getElementById('addAccountButton');

  addAccountButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default button behavior

      const formData = new FormData(form);
      const data = {
        username: formData.get('usernameInput'),
        password: formData.get('passwordInput'),
        websiteName: formData.get('websiteInput')
      };

      console.log(data)

      fetch('/insertUserInput', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
            throw new Error('Failed to insert user input into database');
        }
        return response.json();
      })
      .then(result => {
        console.log('User input inserted into database successfully:', result);
        // Call fetchAccounts() to retrieve updated account data
        fetchAccounts();
        clearInputs();
      })
      .catch(error => {
        console.error('Error inserting user input into database:', error);
      });
    }); // end AccountButton EventListener

    // listen for user to log out
  const logOutButton = document.getElementById("logOut");
  logOutButton.addEventListener('click', function(event){
    event.preventDefault()
    logOut()
    preventBack()
  }); // end logout EventListener

}); // end document EventListener
  
// the following statement has been moved to previous dom event listener to prevent redundancy
// document.addEventListener('DOMContentLoaded', function () {
//   fetchAccounts();
// });
  
// fetch the accounts associated with the user
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
  tableBody.innerHTML = '';
  console.log('Updating table with accounts:', accounts);
  
  
  accounts.forEach(account => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${account.WebsiteName}</td>
                    <td>${account.Username}</td>
                    <td>${account.Password}</td>`;
    tableBody.appendChild(row);
  });
}

// send new user information to database upon registration
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

// verify user information for login
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
  
// clear the user inputs for adding an account
function clearInputs() { 
  document.getElementById("websiteInputId").value = "";
  document.getElementById("usernameInputId").value = "";
  document.getElementById("passwordInputId").value = "";
}

// redirect user to login page after log out
function logOut(){
  window.location.href="/index.html"
}

// prevent user from returning after logout
function preventBack(){
  window.history.forward();
}
window.addEventListener('load', function(){
  preventBack()
})

  // CALEB FROST
  function generatePassword() {
    // Get the user's desired password length
    const passwordLengthInput = document.getElementById('passwordLength');
    const passwordLength = parseInt(passwordLengthInput.value, 10);
  
    // Validate that the input is a number
    if (isNaN(passwordLength) || passwordLength <= 0) {
      alert('Please enter a valid positive number for password length.');
      return;
    }
  
    // Call your password generation function (you can use the provided generateNewPassword function)
    const generatedPassword = generateNewPassword(passwordLength);
  
    // Display the generated password
    const passwordContainer = document.getElementById('passwordContainer');
    passwordContainer.innerHTML = `<p>Your Generated Password: ${generatedPassword}</p>`;
  }
  
  // This will update the password length when the user selects a certain range.
  function updatePasswordLength() {
    // Update the displayed password length value
    const passwordLengthInput = document.getElementById('passwordLength');
    const passwordLengthValue = document.getElementById('passwordLengthValue');
    passwordLengthValue.textContent = passwordLengthInput.value;
  }
  
  // Password creation.
  function generateNewPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
  
    return password;
  }
