import * as shared from '../views/shared.js';


export function studioPage() {
    return 'studio page'
}

export function Logout() {
    console.log('Logging out');
    sessionStorage.clear();
    shared.Navbar();
    window.location = '#';

}

export function LoginRegisterPage() {

    let contentDiv = document.getElementById('main-content');

    console.log('Inside LoginRegisterPage');

    let output = "";
    output +=
        `<div id="studio-content" class="content">
        <div id="login-form">
            <div class="login-register">
                <div class="login">
                    <h2 class="login-title">Logga In</h2>
                    <div class="forms">
                        <div class="flex-col stretch-col">
                            <div>
                                <div class="form-item">
                                    <label for="username">Användarnamn:</label><br>
                                    <input class="input-field" type="text" id="username" name="username">
                                </div>
                                <div class="form-item">
                                    <label for="pwd">Lösenord:</label><br>
                                    <input class="input-field" type="password" id="pwd" name="pwd">
                                </div>
                            </div>
                            
                            <div class="">
                                <button class="btn btn-login" id="loginButton">Logga in</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="register">
                    <h2 class="login-title">Registrera Studio</h2>
                    <div class="forms">
                        <div class="flex-col stretch-col">
                            <div>
                                <div class="form-item">
                                    <label for="name">Namn:</label><br>
                                    <input class="input-field" type="text" id="studioname" name="name">
                                </div>
                                <div class="form-item">
                                    <label for="phonenumber">Lösenord:</label><br>
                                    <input class="input-field" type="password" id="newpwd1" name="newpwd1">
                                </div>
                                
                                <div class="form-item">
                                    <label for="phonenumber">Repetera lösenord:</label><br>
                                    <input class="input-field" type="password" id="newpwd2" name="newpwd2">
                                </div>
                            </div>
                            
                            <div class="flex-row reg-bottom">
                                <button class="btn btn-register" id="registerButton">Registrera</button>
                                <span class="registerInfo" id="registerInfo"><i class="fas fa-info-circle"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div id="registerInfoText">Registrera en ny filmstudio för att kunna hyra filmer samt ta del av våra andra medlemsförmåner</div>
        </div>`;

    console.log('should set login page visible here.');

    contentDiv.innerHTML = output;

    var registerInfoLogo = document.getElementById('registerInfo');
    var info = document.getElementById('registerInfoText');
    var loginButton = document.getElementById('loginButton');
    var registerButton = document.getElementById('registerButton');

    // Hover over info button shows info about registering
    registerInfoLogo.addEventListener('mouseover', function () {
        info.style.display = "block";
    });
    registerInfoLogo.addEventListener('mouseleave', function () {
        info.style.display = "none";
    });

    loginButton.addEventListener('click', () => {
        LoginAttempt();
    });

    registerButton.addEventListener('click', () => {
        RegisterStudio();
    });

    console.log('End of LoginPage');
}

export async function LoginAttempt() {
    var user = document.getElementById('username').value;
    var password = document.getElementById('pwd').value;

    console.log('User: ' + user);
    console.log('Password: ' + password);

    if (user === 'name' && password === 'password') {
        alert('God mode activated!');
        sessionStorage.setItem('user', 'admin');
        sessionStorage.setItem('isLoggedIn', 1);
    }
    else {
        var getUser = await GetUserByName(user);

        if (getUser == null) {
            alert('login failed');
            LoginRegisterPage();
        }

        if (getUser.verified === false) {
            alert('Studio must be verified before first login');
        }
        else if (getUser !== null && password === getUser.password) {
            console.log('Password correct. Logging in...');
            sessionStorage.setItem('user', getUser.name);
            sessionStorage.setItem('studioId', getUser.id);
            sessionStorage.setItem('isLoggedIn', 1);

            console.log('User: ' + user + ' StudioId: ' + getUser.id);
        }
        else {
            alert('Login failed');
        }
    }

    shared.Navbar();
    window.location = '#';
}

export async function RegisterStudio() {
    var newStudioName = document.getElementById('studioname').value;
    var pwd1 = document.getElementById('newpwd1').value;
    var pwd2 = document.getElementById('newpwd2').value;

    console.log('New user registration. User: ' + newStudioName + " Pwd1: " + pwd1 + " Pwd2: " + pwd2);

    if (pwd1 != pwd2) {
        alert('passwords did not match. Try again');
        RegisterStudio();
    }
    else {

        alert('now checking avaliability...');

        // Check if username is taken
        var existingUser = await GetUserByName(newStudioName);
        if (existingUser !== null) {
            alert('Username taken. Try another one');
            return;
        }

        // Prepare POST request data.
        let data = { "name": newStudioName, "password": pwd1, "verified": false }

        let response = await fetch('https://localhost:44361/api/filmstudio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('studio is now registered. Await verification by admin');
            LoginRegisterPage();
        }
        else {
            alert('Something went wrong, try again')
        }
    }
}

// Get user credentials
export async function GetUserByName(username) {
    var userData = await fetch('https://localhost:44361/api/filmstudio');
    var userList = await userData.json();

    var userFromDb = userList.filter(function (u) {
        return u.name === username;
    });

    console.log('GetUserByName found: ' + userFromDb);

    return userFromDb.length < 1 ? null : userFromDb[0];
}

// Should return a page with a table with non verified studios.
export async function ListUnverifiedStudios() {

    var contentDiv = document.getElementById("main-content");
    let output = "";

    var studioData = await fetch('https://localhost:44361/api/filmstudio');

    var studiosList = await studioData.json();

    var unverifiedStudios = studiosList.filter(function (s) {
        return s.verified === false;
    });

    if (unverifiedStudios.length < 1) {
        output = "<h3>No unverified studios</h3>";
    }

    else {

        output = `<div class="newStudioVerifications content">
                    <table style="width:100%">
                        <thead>
                            <tr>
                                <th>Studionamn</th>
                                <th>StudioId</th>
                                <th>Godkänn</th>
                            </tr>
                        </thead>
                        <tbody>`

        unverifiedStudios.forEach(s => {
            output += `<tr>
                            <td>${s.name}</td>
                            <td>${s.id}</td>
                            <td><button class="btn VerifyStudioButton triviabutton" id="verify-${s.id}">Godkänn</button></td>
                        </tr>
                    </tbody>`;
        });

        output += `</table>
                    </div>`

        contentDiv.innerHTML = output;
    }

    window.addEventListener('click', function (e) {
        console.log(e);
        shared.eventHandler(e);
    });
}

export async function VerifyStudio(id) {
    let studio = await fetch('https://localhost:44361/api/filmstudio/' + id);
    let studioData = await studio.json();

    const data = {
        "id": studioData.id,
        "name": studioData.name,
        "password": studioData.password,
        "studioId": true
    };

    console.log(data);

    var rentResponse = await fetch('https://localhost:44361/api/filmstudio/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (rentResponse.ok) {
        alert('Studio verified');
        ListUnverifiedStudios();
    }
    else {
        alert('Something went wrong');
        ListUnverifiedStudios();
    }
}