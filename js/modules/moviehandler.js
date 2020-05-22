export async function MovieString() {

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

export function AddMovie() {
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
    });
}

export function DisplayTriviaBox(id) {
    console.log("DisplayTriviaBox function called. Id: " + id);
    var triviaboxid = `triviaadd` + id;
    console.log('Triviaboxid: ' + triviaboxid);
    var triviabox = document.getElementById(triviaboxid);
    console.log('removing hidden from ' + triviabox.id);
    triviabox.classList.toggle("hidden");
}

export async function AddTrivia(id) {
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
}

export async function ReturnMovie(id) {

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
}

export async function RequestMovie(id) {

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
}

export async function ListRentedMovies() {

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

    console.log(rentedMovies);

    var contentDiv = document.getElementById("main-content");

    contentDiv.innerHTML = rentedMovies;
}