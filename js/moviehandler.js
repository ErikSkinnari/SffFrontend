var div = document.getElementById('movie-content');
var user = sessionStorage.getItem('user');
var loggedIn = sessionStorage.getItem('isLoggedIn');
var studio = sessionStorage.getItem('studioId');

GetMovies();

async function GetMovies() {
    var movieresponse = await fetch('https://localhost:44361/api/film');
    var triviaresponse = await fetch('https://localhost:44361/api/filmtrivia');
    var rentalsresponse = await fetch('https://localhost:44361/api/rentedfilm');

    if(!movieresponse.ok || !triviaresponse.ok || !rentalsresponse.ok){
        return 'Unable to fetch data from API, try to reload the page.';
    }
    var moviedata = await movieresponse.json();
    var triviadata = await triviaresponse.json();
    var rentaldata = await rentalsresponse.json();

    console.log(moviedata);
    console.log(triviadata);
    console.log(rentaldata);

    if (studio !== null) {
        var rentalresult = rentaldata.filter(function(rental) {
            return rental.studioId == studio && rental.returned == false;
        });
    }

    moviedata.forEach(function(movie) {
        var triviaresult = triviadata.filter(function(trivia) {
            return trivia.filmId === movie.id;
        });

        let rented = rentalresult.filter(function(r) {
            return r.filmId === movie.id;
        })
        if(rented.length > 0) movie.rented = true;
        else movie.rented = false;

        if(triviaresult.length > 0) movie.trivia = triviaresult;
        else movie.trivia = false;

    });

    console.log(moviedata);

    div.innerHTML = "";

    moviedata.forEach(m => {
        tempstring = 
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
                            if(studio !== -1) 
                            {
                                tempstring += ` <button class="loanbutton`;
                                if (m.stock < 1 || m.rented) {
                                    tempstring += ' btn-disabled';                                    
                                }
                                else tempstring += ` btn" onclick="RequestMovie(${m.id})`
                                tempstring += `
                                ">Hyr</button>                            
                                <button class="returnbutton`
                                if(!m.rented) tempstring += ` btn-disabled`;
                                else tempstring +=` btn" onclick="ReturnMovie(${m.id})`
                                tempstring += `">Returnera</button>
                                <button class="btn triviabutton" onclick="AddTrivia(${m.id})>Lägg till Trivia</button>
                                <button class="btn btn-disabled" id="">Lägg till Trivia</button>`
                            }
                            tempstring += `</div>
                        <div class="stocknumber">
                            <h4>Tillgängligt antal: ${m.stock > 0 ? m.stock : 0 }</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

        div.innerHTML += tempstring;
    });
}

async function ReturnMovie(id) {
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

        GetMovies();
    }
}

async function RequestMovie(id) {

    const data = { "FilmId": id, "StudioId": Number(studio) };

    console.log(data);

    var rentResponse = await fetch('https://localhost:44361/api/rentedfilm', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });

    GetMovies();
}