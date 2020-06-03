var navbar = document.getElementById('navbar');
var loggedIn = sessionStorage.getItem('isLoggedIn');

if (loggedIn === null) {
    loggedIn = false;
}
var footer = document.getElementById('footer');

var user = 'admin';
var loggedIn = true;


var isFirstRun = true;

if (isFirstRun) {
    isFirstRun = true;
    Navbar();
    LoginRegisterPage();
}





footer.innerHTML = `
<div class="footer content flex-h">
<div class="contact">
<p>&copy;2020 - Svenska Förenade Filmstudios</p>
</div>
<div class="spacer-40">|</div>
<div class="social">
<a href="mailto:info@sff.se"><i class="far fa-envelope"> Kontakta SFF</i></a>
</div>
</div>`;

async function MovieString() {

    var contentDiv = document.getElementById("main-content");

    let output = "";

    var user = sessionStorage.getItem('user');
    var loggedIn = sessionStorage.getItem('isLoggedIn');
    var studio = sessionStorage.getItem('studioId');

    document.title = "Filmbibliotek";

    console.log('Sessionstorage. User: ' + user + ' LoggedIn: ' + loggedIn + ' Studio: ' + studio);

    var movieresponse = await fetch('https://localhost:44361/api/film');
    var triviaresponse = await fetch('https://localhost:44361/api/filmtrivia');
    var rentalsresponse = await fetch('https://localhost:44361/api/rentedfilm');

    if(!movieresponse.ok || !triviaresponse.ok || !rentalsresponse.ok){
        return 'Unable to fetch data from API, try to reload the page.';
    }
    var moviedata = await movieresponse.json();
    var triviadata = await triviaresponse.json();
    var rentaldata = await rentalsresponse.json();

    if (studio !== null) {
        var rentalresult = rentaldata.filter(function(rental) {
            return rental.studioId == studio && rental.returned == false;
        });
    }

    moviedata.forEach(function(movie) {
        var triviaresult = triviadata.filter(function(trivia) {
            return trivia.filmId === movie.id;
        });

        if(loggedIn === "true" && user !== "admin"){
            let rented = rentalresult.filter(function(r) {
                return r.filmId === movie.id;
            })
            if(rented.length > 0) movie.rented = true;
            else movie.rented = false;
        }

        if(triviaresult.length > 0) movie.trivia = triviaresult;
        else movie.trivia = false;
    });

    let tempstring = '<div class="content" id="movie-content">';

    moviedata.forEach(m => {
        tempstring += 
        `<div class="moviecard">
            <div class="moviecontent">
                <img src="img/poster.jpg" alt="" class="movieimg">
                <div class="movieinfo">
                    <div>
                        <h2 class="movietitle">${m.name}</h2>
                        <ul class="movietrivia">`
                        if(m.trivia === false){
                            tempstring += `<li class="trivia-item">No trivia added</li>`;
                        }
                        else {
                            m.trivia.forEach(function(t) {
                            tempstring += `<li class="trivia-item">${t.trivia}</li>`
                            });
                        }
                        tempstring += `
                        </ul>
                    </div>

                    <div class="moviefooter">

                        <div class="moviebuttons">`
                            if(loggedIn == "true") 
                            {
                                tempstring += ` <button class="loanbutton`;
                                if (m.stock < 1 || m.rented) {
                                    tempstring += ' btn-disabled';                                    
                                }
                                else tempstring += ` btn" id="loan-${m.id}`
                                tempstring += `">Hyr</button>                            
                                <button class="returnbutton`
                                if(!m.rented) tempstring += ` btn-disabled`;
                                else tempstring +=` btn" id="return-${m.id}`
                                tempstring += `">Returnera</button>
                                <button class="btn triviabutton" id="displayTriviaBox-${m.id}">Lägg till Trivia</button>`;

                                tempstring += `
                                <div class="add-trivia hidden" id="triviaadd${m.id}">
                                    <div>
                                        <textarea name="trivia" id="triviatext${m.id}" rows="10" cols="40"></textarea><br>
                                        <button class="btn triviabutton" id="addTrivia-${m.id}">Lägg till Trivia</button>
                                    </div>
                                </div>`;
                            }
                            tempstring += `</div>
                        <div class="stocknumber">
                            <h4>Tillgängligt antal: ${m.stock > 0 ? m.stock : 0 }</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    });
    
    output += tempstring;
    output += '</div>';

    console.log('before admin check');
    console.log(user);
    if (user === 'admin') {
        console.log('inside admin if');
        output += `<div class="add-movie"><i class="fas fa-plus-circle" id="addMovieButton" onclick="AddMovie()"></i>
        <p id="addMovieInfo" class="hidden addMovieInfo">Lägg till ny film</p></div>`;

    }

    contentDiv.innerHTML = output;

    if (user == 'admin') {

        var addMovieButton = document.getElementById('addMovieButton');
        var addMovieInfoText = document.getElementById('addMovieInfo');
        
        addMovieButton.addEventListener('mouseover', function() {
            addMovieInfoText.classList.toggle('hidden');
            console.log('mouse over add movie');
        });
        addMovieButton.addEventListener('mouseout', function() {
            addMovieInfoText.classList.toggle('hidden');
        });

        addMovieButton.addEventListener('click', function() {
            AddMovie();
        });
    }

}


async function AddMovie() {
    var contentDiv = document.getElementById("main-content");
    let contentstring = 
    `<div id="add-movie-content" class="content addMovieForm">
        <div class="newMovieDiv">
            <div class="newMovieInput">
                <label for="newMovieTitle">Filmtitel:</label><br>
                <input type="text" name="newMovieTitle" id="newMovieTitle">
            </div>
            <div class="newMovieInput">
                <label for="newMovieTitle">Lägg till Bild</label><br>
                <input type="file" name="newMovieImg" id="newMovieImg">
            </div>
            <div class="newMovieInput">
                <label for="newMovieAvaliable">Tillgängligt antal:</label><br>
                <input type="text" name="newMovieAvaliable" id="newMovieAvaliable">
            </div>
            <button class="btn addMovieButton triviabutton" id="addMovieButton">Spara film</button>
        </div>            
    </div>`
    contentDiv.innerHTML = contentstring;

    var addNewMovieButton = document.getElementById('addMovieButton');

    addNewMovieButton.addEventListener('click', async function() {

        var newMovieTitle = document.getElementById('newMovieTitle').value;
        var newMovieImg = document.getElementById('newMovieImg').value;
        var newMovieAvaliable = document.getElementById('newMovieAvaliable').value;

        // Send trivia to API
        const newMovieData = { 
        "name": newMovieTitle,
        "stock": Number(newMovieAvaliable)
        }

        console.log(newMovieData);

        var rentResponse = await fetch('https://localhost:44361/api/film', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovieData),
        });

        GetMovies();
    });
}

async function AddTrivia(id) {
    var movieId = id;
    var textId = 'triviatext' + id;
    var textBox = document.getElementById(textId);
    var triviatext = textBox.value;

    // Reset textbox
    textBox.value = "";

    // Hide trivia input div
    var triviaboxid = `triviaadd` + id;
    console.log('Triviaboxid: ' + triviaboxid);
    var triviabox = document.getElementById(triviaboxid);
    console.log('removing hidden from ' + triviabox.id);
    triviabox.classList.toggle("hidden");


    console.log('MovieId: ' + id);
    console.log('Triviatext: ' + triviatext);


    // Send trivia to API
    const triviadata = { 
        "filmId": Number(movieId),
        "trivia": triviatext
    };

    console.log(triviadata);

    var rentResponse = await fetch('https://localhost:44361/api/filmtrivia/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(triviadata),
    });
    GetMovies();
}

function DisplayTriviaBox(id) {
    console.log("DisplayTriviaBox function called. Id: " + id);
    var triviaboxid = `triviaadd` + id;
    console.log('Triviaboxid: ' + triviaboxid);
    var triviabox = document.getElementById(triviaboxid);
    console.log('removing hidden from ' + triviabox.id);
    triviabox.classList.toggle("hidden");
}

async function ListRentedMovies() {

    var rentalsresponse = await fetch('https://localhost:44361/api/rentedfilm');
    var movieresponse = await fetch('https://localhost:44361/api/film');

    if(!rentalsresponse.ok || !movieresponse.ok){
        return 'Unable to fetch data from API, try to reload the page.';
    }
    var rentaldata = await rentalsresponse.json();
    var moviedata = await movieresponse.json();
    
    var rentedMovies = rentaldata.filter(function(rental) {
        return rental.returned == false;
    });

    rentedMovies.forEach(function(r){
        var title = moviedata.filter(function(m) {
            return m.id === r.filmId;
        });

        r.movieTitle = title.name;
    });

    var contentDiv = document.getElementById("main-content");
    let output;

    // Not finished.....
    rentedMovies.forEach(function(movie){
        output += `
        <div class="rented-movie content">
        <h3>StudioId: ${movie.movieTitle}</h3>
        <h3>StudioId</h3>
        </div>
        `
    })

    contentDiv.innerHTML = rentedMovies;
}

async function RequestMovie(id) {

    var studio = sessionStorage.getItem('studioId');


    const data = { "FilmId": Number(id), "StudioId": Number(studio) };

    console.log(data);

    var rentResponse = await fetch('https://localhost:44361/api/rentedfilm', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    });

    console.log(rentResponse.json());

    console.log('movie requested' + rentResponse);
    GetMovies();
}

async function ReturnMovie(id) {

    var studio = sessionStorage.getItem('studioId');

    var rentalsresponse = await fetch('https://localhost:44361/api/rentedfilm');

    if(!rentalsresponse.ok){
        return 'Unable to fetch data from API, try to reload the page.';
    }
    var rentaldata = await rentalsresponse.json();

    console.log(rentaldata);

    if (rentaldata.length > 0) {
        var rentalresult = rentaldata.filter(function(rental) {
            return rental.studioId == studio && rental.filmId == id && rental.returned == false;
        });

        console.log(rentalresult);

        const data = { 
            "filmId": rentalresult[0].filmId,
            "id": rentalresult[0].id,
            "returned": true,
            "studioId": rentalresult[0].studioId 
        };

        console.log(data);

        var rentResponse = await fetch('https://localhost:44361/api/rentedfilm/' + rentalresult[0].id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
    }
    GetMovies();
}

async function GetMovies() {

    await MovieString();
    
    var movielist = document.getElementById('movie-content');
    movielist.addEventListener('click', function(e) {

        let target = e.target.id;
        let targetData = target.split('-');
        let buttonType = targetData[0];
        let id = targetData[1];

        switch (buttonType) {
            case 'loan':
                RequestMovie(id);
                GetMovies();
                break;
            case 'return':
                ReturnMovie(id);
                GetMovies();
                break;
            case 'displayTriviaBox':
                DisplayTriviaBox(id);
                break;
            case 'addTrivia':
                AddTrivia(id);
                GetMovies();
                break;
            case 'verify':
                VerifyStudio(id);
                break;
        }
    })
}

function Logout() {
    console.log('Logging out');
    sessionStorage.clear();
    GetMovies();
}

function Navbar() {

    let navbar = document.getElementById('navbar');

    let loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn === null) {
        loggedIn = false;
    }

    console.log('LoggedIn: ' + loggedIn);

    let user = sessionStorage.getItem('user');

    let output = `
    <div class="nav-menu content flex-h">
        <ul class="flex-h navbar">
            <li class="nav-menu-item"><a id="menu-movies" href=""><i class="fas fa-film"></i> Filmer</a></li>
        </ul>
        <ul id="authentication" class="flex-h navbar">`;

    if(loggedIn === true) {
        output += `<li class="nav-menu-item"><a id="menu-logout" href="">Logga ut</a></li>`;

        if (user === 'admin') {
            output += `<li class="nav-menu-item"><a id="menu-listRentedMovied" href="">Uthyrda filmer</a></li>
                <li class="nav-menu-item"><a id="menu-verifyStudios" href="">Nya Studios</a></li>`;
        }
    }
    else {
        output += `<li class="nav-menu-item"><a id="menu-login" href="">Logga In</a></li>`;
    }

    output += `</ul></div>`;

    navbar.innerHTML = output;


    // Something here is causing me big problems!! Why?
    // If this event listener is uncommented the loginpage flashes by and you continue to GetMovies()
    var movieButton = document.getElementById('menu-movies');
    movieButton.addEventListener('click', GetMovies());

    if(loggedIn === true) {
        var logoutButton = document.getElementById('menu-logout');
        logoutButton.addEventListener('click', Logout());
    }
    else {
        var loginFormButton = document.getElementById('menu-login');
        loginFormButton.addEventListener('click', LoginRegisterPage());
    }

    if (loggedIn === true && user === "admin") {
        var verifyStudiosButton = document.getElementById('menu-verifyStudios');
        verifyStudiosButton.addEventListener('click', ListUnverifiedStudios());

        var listRentedMoviesButton = document.getElementById('menu-listRentedMovied');
        listRentedMoviesButton.addEventListener('click', ListRentedMovies());
    }
}

function LoginRegisterPage() {


    let contentDiv = document.getElementById("main-content");

    contentDiv.innerHTML = "";
    let contentstring = 
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
                            
                            <div>
                                <div class="flex-row">
                                    <button class="btn btn-register" id="registerButton">Registrera</button>
                                    <p class="registerInfo" id="registerInfo"><i class="fas fa-info-circle"></i></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div id="registerInfoText">Registrera en ny filmstudio för att kunna hyra filmer samt ta del av våra andra medlemsförmåner</div>
        </div>`;

    contentDiv.innerHTML = contentstring;

    var registerInfoLogo = document.getElementById('registerInfo');
    var info = document.getElementById('registerInfoText');
    var loginButton = document.getElementById('loginButton');
    var registerButton = document.getElementById('registerButton');

    // Hover over info button shows info about registering
    registerInfoLogo.addEventListener('mouseover', function() {
        info.style.display = "block";
    });
    registerInfoLogo.addEventListener('mouseleave', function() {
        info.style.display = "none";
    });

    loginButton.addEventListener('click', () => {
        LoginAttempt();
    });
    
    registerButton.addEventListener('click', () => {
        RegisterStudio();    
    });
}

async function LoginAttempt() {
    var user = document.getElementById('username').value;
    var password = document.getElementById('pwd').value;

    console.log('User: ' + user);
    console.log('Password: ' + password);

    if (user === 'name' && password === 'password') {
        alert('God mode activated!');
        sessionStorage.setItem('user', 'admin');
        sessionStorage.setItem('isLoggedIn', true);
        // location.reload();
        GetMovies();
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
            sessionStorage.setItem('studioId', getUser.id);
            sessionStorage.setItem('isLoggedIn', true);

            console.log('User: ' + user + ' StudioId: ' + getUser.id);
        }
        else {
            alert('Login failed');
        }
    }

    Navbar();

    GetMovies();
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


// Get user credentials
async function GetUserByName(username) {
    var userData = await fetch('https://localhost:44361/api/filmstudio');
    var userList = await userData.json();
    
    var userFromDb = userList.filter(function(u) {
        return u.name === username;
    });

    console.log('GetUserByName found: ' + userFromDb);
    
    return userFromDb.length < 1 ? null : userFromDb[0];
}


// Should return a page wit ha table with non verified studios.
async function ListUnverifiedStudios() {

    var contentDiv = document.getElementById("main-content");
    let htmlString = "";

    var studioData = await fetch('https://localhost:44361/api/filmstudio');

    var studiosList = await studioData.json();

    var unverifiedStudios = studiosList.filter(function(s) {
        return s.verified === false;
    });

    if (unverifiedStudios.length < 1) {
        htmlString = "No unverified studios";
    }

    else {

    htmlString = `
    <div class="newStudioVerifications content">
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
        htmlString += `
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.id}</td>
                        <td><button class="btn VerifyStudioButton triviabutton" id="verify-${s.id}">Godkänn</button></td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    });

    contentDiv.innerHTML = htmlString;
    }
}

async function VerifyStudio(id) {
    let studio = await fetch('https://localhost:44361/api/filmstudio/' + id);
    let studioData = await studio.json();

    const data = { 
        "id": studioData.id,
        "name": studioData.name,
        "password": trstudioData.password,
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