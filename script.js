// DOCUMENT EVENT LISTENER
document.addEventListener("DOMContentLoaded", function() {
  console.log('DOMContentLoaded event fired');

  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('editButton')) {
      // Get the parent row of the clicked button
      const row = event.target.closest('tr');
      if (!row) {
        console.error('Parent row not found');
        return;
      }
  
      // Extract account details from the row
      const accountId = row.cells[0].textContent;
      const websiteName = row.cells[1].textContent;
      const username = row.cells[2].textContent;
      const password = row.cells[3].textContent;
  
      // Populate form with account details for editing
      populateEditForm(accountId, websiteName, username, password);
    }
  });

   // Add event listener for the submit button in the edit form
   const editForm = document.getElementById('editForm');
   const editFormButton = document.getElementById('editFormSubmitButton');
 
     editFormButton.addEventListener('click', function(event) {
       console.log('button clicked')
       event.preventDefault(); // Prevent default button behavior
 
       const formData = new FormData(editForm);
       const data = {
         accountId: formData.get('editAccountId'),
         website: formData.get('editWebsiteInput'),
         username: formData.get('editUsernameInput'),
         password: formData.get('editPasswordInput')
       };
 
       console.log(data)
     
       fetch('/updateAccount', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
       })
       .then(response => {
         if (!response.ok) {
           throw new Error('Failed to edit data');
         }
         return response.json();
       })
       .then(result => {
         console.log('Account updated successfully:', result);
         // Update the UI by re-fetching accounts
         fetchAccounts();
         document.getElementById('editForm').style.display = 'none';
       })
       .catch(error => {
         console.error('Error updating account:', error);
       });
 });

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

      // Check for missing required fields on the client-side
      if (!data.username || !data.password || !data.websiteName) {
        alert('Please fill in all required fields.');
        return;
      }

      
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
  
// index.html specific code
document.addEventListener('DOMContentLoaded', function(){
  console.log('index.html code loaded')
  window.onload = function(){
    preventBack()
  }
})// end index.html document EventListener
  
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
    row.innerHTML = `<td style="display: none;"> ${account.acct_ID}</td>
                    <td>${account.WebsiteName}</td>
                    <td>${account.Username}</td>
                    <td>${account.Password}</td>
                    <td><button class="editButton">Edit</button></td>
                    <td><button class="deleteButton" data-acct-id="${account.acct_ID}">Delete</button></td>`;
    tableBody.appendChild(row);
  });

  document.querySelectorAll('.deleteButton').forEach(button => {
    button.addEventListener('click', function () {
      // const acct_id = 47;
      const acct_id = this.getAttribute('data-acct-id');
      // console.log('Clicked Delete Button. acct_id: ', acct_id); // This was added for testing
      deleteAccount(acct_id); // refer to line 291 for the deleteAccount function
    });
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

// Redirect user to login page after log out and clear session data
function logOut(){
  fetch('/logout', { method: 'POST' }) // Assuming you have a logout route on your server
    .then(response => {
      if (response.ok) {
        window.location.href = "/index.html"; // Redirect to login page
      } else {
        console.error('Failed to log out:', response.statusText);
        // Handle logout failure if necessary
      }
    })
    .catch(error => {
      console.error('Error logging out:', error);
      // Handle logout error if necessary
    });
}

// prevent user from returning after logout
function preventBack(){
  window.history.forward();
}

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
  
    // Call the password generation function (you can use the provided generateNewPassword function)
    const generatedPassword = generateNewPassword(passwordLength);
  
    // Display the generated password
    const passwordContainer = document.getElementById('passwordContainer');
    passwordContainer.innerHTML = `<p>Your Generated Password: ${generatedPassword}</p>`;

    if (passwordContainer.innerHTML.trim() !== '') {
      passwordContainer.classList.add('hasInnerHTML');
    }
    else {
      passwordContainer.classList.remove('hasInnerHTML');
    }

    const passwordInput = document.getElementById('passwordInputId')
    passwordInput.value = generatedPassword
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
    const charset = getCharset();
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
  
    return password;
  }

  // Helper function to determine character set based on teh checkboxes selected by the user.
function getCharset() {
  let charset = '';

  if (document.querySelector('.uppercase').checked) {
      charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (document.querySelector('.lowercase').checked) {
      charset += "abcdefghijklmnopqrstuvwxyz";
  }

  if (document.querySelector('.numbers').checked) {
      charset += "0123456789";
  }

  if (document.querySelector('.specialCharacters').checked) {
      charset += "!@#$%^&*()_-+=<>?";
  }  
  
  if (!charset) { //This will execute if the charset is empty.
    alert('Please select an option below for password generation.');
  }

  return charset;
  }

  function copyPassword() {
    const passwordInput = document.getElementById('passwordContainer');
    const passwordText = passwordInput.textContent || passwordInput.innerText;

    const password = passwordText.replace('Your Generated Password: ', '').trim(); // This is to trim out any of the uneeded text we may have when copying
  
    // This will write the password to the computer clipboard. This is the API suggested by Mr. GPT
    if (navigator.clipboard) {
      navigator.clipboard.writeText(password)
        .then(() => {
          console.log('Password Copied');
          alert('Password copied to clipboard.')
        })
        .catch((err) => {
          console.error('Unable to copy password', err);
          alert('Unable to copy password. Please try again.');
        });
    } else {
      console.error('Clipboard API not supported');
      alert('Clipboard API not supported. Please copy the password manually.');
    }
  }

  // show edit form 
  function showEditForm(websiteName, username, password) {
    // Populate form fields with data from selected row
    document.getElementById('editWebsiteInput').value = websiteName;
    document.getElementById('editUsernameInput').value = username;
    document.getElementById('editPasswordInput').value = password;
  
    // Display the edit form
    document.getElementById('editForm').style.display = 'block';
  }

  // Function to populate edit form with account details
function populateEditForm(accountId, websiteName, username, password) {

    // Get references to the input fields
    const editWebsiteInput = document.getElementById('editWebsiteInput');
    const editUsernameInput = document.getElementById('editUsernameInput');
    const editPasswordInput = document.getElementById('editPasswordInput');
    const accountIdInput = document.getElementById('editAccountId'); // Add a hidden input field for accountId
 
   // Assign values to the input fields
   editWebsiteInput.value = websiteName;
   editUsernameInput.value = username;
   editPasswordInput.value = password;
   accountIdInput.value = accountId; // Populate the hidden input field with accountId
 
   // Check if any of the elements are missing
   if (!editWebsiteInput || !editUsernameInput || !editPasswordInput) {
     console.error('One or more elements for editing not found');
     return;
   }
 
   // Show edit form (you may need to implement this)
   showEditForm(websiteName, username, password);
}

function deleteAccount(acctId) {
  // Display a confirmation modal
  const isConfirmed = window.confirm("Are you sure you want to delete this account?");

  if (!isConfirmed) {
    return; // If the user cancels, do nothing
  }
  // If the user confirms, proceed with the deletion
  
  // console.log('Deleting account with acct_id: ', acctId);
  fetch('/deleteAccount', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({acct_id: acctId})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
    return response.json();
  })
  .then(result => {
    console.log('Account deleted successfully: ', result);
    fetchAccounts(); //Update table after deletion
  })
  .catch(error => {
    console.error('Error deleting account: ', error);
  })
} // Reference line 151 in server.js for the query execution.
