import * as moviehandler from './modules/moviehandler.js';
import * as studiohandler from './modules/studiohandler.js';
import * as shared from './views/shared.js';

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
    console.log(route);

    if (route.length == 0) { route = "#"; }
    console.log(route);
    await mainRouter(route);
}

window.addEventListener("hashchange", function () {
    console.log("hashchange event");
    routeFunction();
});

window.addEventListener("DOMContentLoaded", function (ev) {
    console.log("DOMContentLoaded event");
    routeFunction();
});