const contentDiv = document.getElementById("test-content");

GetMovies();

async function GetMovies() {
    const response = await fetch("https://localhost:44361/api/film");
    const data = await response.json();
    
    for (let i = 0; i < data.length; i++) {
        let movieRow = document.createElement("h2");

        movieRow.innerHTML = `Title: ${data[i].name}, Id: ${data[i].id} `;

        contentDiv.insertAdjacentElement("beforeend", movieRow);
    }
}


// Krav för G

// Sidan skall kunna besökas publikt och då se en lista på samtliga tillgängliga filmer, samt en trivia lista per film. 
// Det skall visas ett omslag för varje film.                                                                           !!!Backend!!!
// Det skall finnas ett formulär för att registrera en ny filmstudio.
// En filmstudio skall kunna logga in med sitt användarnamn "name" samt lösenord "password".
// En inloggad filmstudio skall kunna låna en film, lämna tillbaka en film samt skriva en trivia om en film.


// Krav för VG

// En film skall bara kunna lånas det antal gånger totalt som det finns licenser "stock".                               !!!Backend!!!

// En SFF administratör skall kunna se vilka filmer som är uthyrda till vilka studios. // TODO StudioAdministration()


// En SFF administratör skall godkänna "verified" en filmstudio innan de kan logga in.
// Filmstudion skall automatiskt meddelas via epost när de blivit godkända.
// TODO Filter all studios not verified. Send Email when verification is done

// En SFF administratör skall kunna lägga till nya filmer. // TODO AddMovie()
// En skriven reflektion över hur du har löst uppgiften.