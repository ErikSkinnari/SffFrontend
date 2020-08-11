import * as moviehandler from '../modules/moviehandler.js';
import * as studiohandler from '../modules/studiohandler.js';

export function Footer() {
    let footer = document.getElementById('footer');
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
}

export function Navbar() {

    console.log('Navbar running');

    let navbar = document.getElementById('navbar');

    let loggedIn = sessionStorage.getItem('isLoggedIn');

    console.log('LoggedIn: ' + loggedIn);

    let user = sessionStorage.getItem('user');

    let output = `
    <div class="nav-menu content flex-h">
        <ul class="flex-h navbar">
            <li class="nav-menu-item"><a id="menu-movies" href="#movies"><i class="fas fa-film"></i> Filmer</a></li>
        </ul>
        <ul id="authentication" class="flex-h navbar">`;

    console.log('Loggedin should add logout button: ' + loggedIn);

    if (loggedIn == 1) {

        if (user == 'admin') {
            output += `<li class="nav-menu-item"><a id="menu-listRentedMovies" href="#rentedMovies">Uthyrda filmer</a></li>
            <li class="nav-menu-item"><a id="menu-verifyStudios" href="#newStudios">Nya Studios</a></li>`;
        }

        output += `<li class="nav-menu-item"><a id="menu-logout" href="#logout">Logga ut</a></li>`;
    }
    else {
        output += `<li class="nav-menu-item"><a id="menu-login" href="#login">Logga In / Registrera</a></li>`;
    }

    output += `</ul></div>`;

    navbar.innerHTML = output;

    // if (loggedIn == 1) {
    //     var logoutButton = document.getElementById('menu-logout');
    //     logoutButton.addEventListener('click', () => {
    //         Logout();
    //     });
    // }
    // else {
    //     var loginFormButton = document.getElementById('menu-login');
    //     loginFormButton.addEventListener('click', () => {
    //         studiohandler.LoginRegisterPage();
    //     });
    // }

    // if (loggedIn == 1 && user == 'admin') {
    //     var verifyStudiosButton = document.getElementById('menu-verifyStudios');
    //     verifyStudiosButton.addEventListener('click', () => {
    //         ListUnverifiedStudios();
    //     });

    //     var listRentedMoviesButton = document.getElementById('menu-listRentedMovies');
    //     listRentedMoviesButton.addEventListener('click', () => {
    //         ListRentedMovies();
    //     });
    // }
}

export async function eventHandler(event) {

    console.log('Event: ' + event.target.id);

    let target = event.target.id;
    let targetData = target.split('-');
    let buttonType = targetData[0];
    let id = targetData[1];

    switch (buttonType) {
        case 'loan':
            moviehandler.RequestMovie(id);
            break;
        case 'return':
            moviehandler.ReturnMovie(id);
            break;
        case 'displayTriviaBox':
            moviehandler.DisplayTriviaBox(id);
            break;
        case 'addTrivia':
            moviehandler.AddTrivia(id);
            break;
        case 'verify':
            studiohandler.VerifyStudio(id);
            break;
    }
}