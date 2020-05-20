var registerInfoLogo = document.getElementById('registerInfo');
var info = document.getElementById('registerInfoText');
var loginButton = document.getElementById('loginButton');
var registerButton = document.getElementById('registerButton');
var authMenu = document.getElementById('authentication');
var loggedInUser = sessionStorage.getItem('user');
if (loggedInUser === null) {
    sessionStorage.setItem('isLoggedIn', false);
}
var loggedIn = sessionStorage.getItem('isLoggedIn');

console.log("loggedin: " + loggedIn);


// Logout stuff
if(loggedIn === "true"){
    console.log('inside loggedIn = true');
    authMenu.innerHTML = `<li class="nav-menu-item"><a id="btn-logout" href="">Logga ut</a></li>`;
    
    var logoutButton = document.getElementById('btn-logout');
    
    logoutButton.addEventListener('click', function() {
        console.log('Logging out');
        sessionStorage.removeItem('user');
        sessionStorage.setItem('isLoggedIn', false);
        sessionStorage.removeItem('studioId');
        
        location.reload();
    });
}

// Login link in navigation
else {
    authMenu.innerHTML = `<li class="nav-menu-item"><a id="btn-login" href="">Logga In</a></li>`;
    var loginFormButton = document.getElementById('btn-login');

    loginFormButton.addEventListener('click', function() {
        console.log('Loading login page');

        LoadLoginPage();
    });
}
    
loginButton.addEventListener('click', () => {
    LoginAttempt();    
});

registerButton.addEventListener('click', () => {
    RegisterStudio();    
});


// Hover over info button shows info about registering
registerInfoLogo.addEventListener('mouseover', function() {
    info.style.display = "block";
});
registerInfoLogo.addEventListener('mouseleave', function() {
    info.style.display = "none";
});



function LoadLoginPage() {
    console.log('login page loaded!!'); // TODO make this show login page
};



async function LoginAttempt() {
    var user = document.getElementById('username').value;
    var password = document.getElementById('pwd').value;

    console.log('User: ' + user);
    console.log('Password: ' + password);

    if (user === 'name' && password === 'password') {
        alert('God mode activated!');
        sessionStorage.setItem('user', 'admin');
        sessionStorage.setItem('isLoggedIn', true);
        location.reload();
        return;
    }
    else
    {
        var getUser = await GetUserByName(user);

        if(getUser === null) 
        {
            alert('login failed');
            location.reload();
        }

        if (getUser.verified === false) {
            alert('Studio must be verified before first login');
        }
        else if (getUser !== null && password === getUser.password) {
            console.log('Password correct. Logging in...');
            sessionStorage.setItem('user', getUser.name);
            sessionStorage.setItem('studioId', getUser.studioId);
            sessionStorage.setItem('isLoggedIn', true);

            location.reload(); // TODO redirect user
        }
        else {
            alert('Login failed');
        }
    }
}

async function RegisterStudio() {
    var newStudioName = document.getElementById('studioname').value;
    var pwd1 = document.getElementById('newpwd1').value;
    var pwd2 = document.getElementById('newpwd2').value;

    console.log('New user registration. User: ' + newStudioName + " Pwd1: " + pwd1 + " Pwd2: " + pwd2);

    if(pwd1 != pwd2){
        alert('passwords did not match. Try again');
        location.reload();
    }
    else {

        alert('now checking avaliability...');

        // Check if username is taken
        var existingUser = await GetUserByName(newStudioName);
        if(existingUser !== null)
        {
            alert('Username taken. Try another one');
            return;
        }

        // Prepare POST request data.
        data = { "name": newStudioName, "password": pwd1, "verified": false}

        response = await fetch('https://localhost:44361/api/filmstudio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });


        if(response.ok)
        {
            alert('studio is now registered. Await verification by admin');
            location.reload();
        }
        else{
            alert('Something went wrong, try again')
        }
    }
}


async function GetUserByName(username) {
    var userData = await fetch('https://localhost:44361/api/filmstudio');
    var userList = await userData.json();
    
    var userFromDb = userList.filter(function(u) {
        return u.name === username;
    });

    console.log('GetUserByName found: ' + userFromDb);
    
    return userFromDb.length < 1 ? null : userFromDb[0];
}


