import { LoginRegisterPage, LoginAttempt, ListUnverifiedStudios } from './modules/studioHandler.js';
import { MovieString, RequestMovie, ReturnMovie, AddTrivia, DisplayTriviaBox, ListRentedMovies } from './modules/movieHandler.js';

var navbar = document.getElementById('navbar');
var loggedIn = sessionStorage.getItem('isLoggedIn');
var footer = document.getElementById('footer');

Navbar();

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

LoginPage();

ListRentedMovies();


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
        }
    })
}

function Logout() {
    console.log('Logging out');
    sessionStorage.clear();
    Navbar();
    GetMovies();
}

function Navbar() {

    navbar = document.getElementById('navbar');

    let loggedIn = sessionStorage.getItem('isLoggedIn');
    let user = sessionStorage.getItem('user');

    loggedIn = true;
    console.log('Logged in status: ' + loggedIn);

    console.log('Navbar updating. isLoggedIn: ' + loggedIn);
    console.log('navbar faunction running....');
    let output = `
    <div class="nav-menu content flex-h">
        <ul class="flex-h navbar">
            <li class="nav-menu-item"><a id="menu-movies" href=""><i class="fas fa-film"></i> Filmer</a></li>
        </ul>
        <ul id="authentication" class="flex-h navbar">`;

        if (loggedIn === true && user === "admin") {
            output += `
            <div class="dropdown">
                <button class="dropbtn">Dropdown 
                <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
                </div>
            </div>`;
        }

        if(loggedIn === true) {
            console.log('this should add logout option');
            output += `<li class="nav-menu-item"><a id="menu-logout" href="">Logga ut</a></li>`;
        }
        else {
            console.log('this should add logIN option');
            output += `<li class="nav-menu-item"><a id="menu-login" href="">Logga In</a></li>`;
        }
        output += `</ul></div>`;    

    navbar.innerHTML = output;

    
    var movieButton = document.getElementById('menu-movies');
    movieButton.addEventListener('click', GetMovies());


    if(loggedIn === true) {
        var logoutButton = document.getElementById('menu-logout');
        logoutButton.addEventListener('click', Logout());
    }
    else {
        var loginFormButton = document.getElementById('menu-login');
        loginFormButton.addEventListener('click', LoginPage());
    }

}

function LoginPage() {

    LoginRegisterPage();

    console.log('Login page loaded');

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
        Navbar();
    });
    
    registerButton.addEventListener('click', () => {
        RegisterStudio();    
    });
}