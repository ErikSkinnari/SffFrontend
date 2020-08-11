import * as moviehandler from './modules/moviehandler.js';
import * as studiohandler from './modules/studiohandler.js';
import * as shared from './modules/shared.js';

shared.Navbar();
shared.Footer();

let mainRouter = async function (route) {
    if (route == '#logout') {
        studiohandler.Logout();
    }
    else if (route == '#movies') {
        moviehandler.moviePage();
    }
    else if (route == '#studios') {
        studiohandler.studioPage();
    }
    else if (route == '#rentedMovies') {
        moviehandler.ListRentedMovies();
    }
    else if (route == '#newStudios') {
        studiohandler.ListUnverifiedStudios();
    }
    else if (route == '#login') {
        studiohandler.LoginRegisterPage();
    }
    else {
        moviehandler.moviePage();
    }
};

async function routeFunction() {
    var route = window.location.hash;

    if (route.length == 0) { route = "#"; }
    await mainRouter(route);
}

window.addEventListener("hashchange", function () {
    routeFunction();
});

window.addEventListener("DOMContentLoaded", function (ev) {
    routeFunction();
});