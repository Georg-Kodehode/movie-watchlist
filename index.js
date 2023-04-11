import { getMovieHtml } from "./getMovieHtml.js";

const movieList = document.getElementById("movie-list");
const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("input");

let watchlist = JSON.parse(sessionStorage.getItem("watchlist")) || [];

//add a click event listener to the search button
searchBtn.addEventListener("click", async () => {
  // the input value when the button is clicked is trimmed and converted to lowercase
  const movieQuery = input.value.trim().toLowerCase();

  // if input is not empty, fetch the 10 first results from the API based on the input
  if (movieQuery) {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=960903a6&s=${movieQuery}`
    );
    const data = await res.json();
    movieList.innerHTML = "";
    // try to fetch each of the 10 first results, then append HTML for each movie to the movie list's innerHTML
    try {
      for (let i = 0; i < data.Search.length; i++) {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=960903a6&i=${data.Search[i].imdbID}`
        );
        const newdata = await response.json();
        movieList.innerHTML += getMovieHtml(newdata, false);
      }
    } catch (err) {
      // if the movie query returns too many results, the for loop will not work and noMovieFound HTML will be displayed
      noMovieFound();
    }
    // add eventlistener to each movie listed in search
    document.querySelectorAll(".add-to-watchlist").forEach((movie) => {
      movie.addEventListener("click", (event) => {
        // if the movie's imdbID is not in watchlist, add it to watchlist and update the 'watchlist' sessionStorage item
        // (localStorage does not work on GitHub Pages)
        if (!watchlist.includes(event.target.parentNode.id)) {
          watchlist.unshift(event.target.parentNode.id);
          sessionStorage.setItem(`watchlist`, JSON.stringify(watchlist));
          alert("This movie was added to your watchlist.");
        } else {
          // alert the user if the movie was already in the user's watchlist
          alert("This movie is already in your watchlist.");
        }
      });
    });
  } else {
    // if input is empty show noMovieFound HTML
    noMovieFound();
  }
});

// html to be shown if no input or too many movies
function noMovieFound() {
  movieList.innerHTML = `
                            <div class="placeholder-wrapper">
                                <h3 class="placeholder-text" id="placeholder-text" style="color: #787878;">
                                Unable to find what you’re looking for. Please try another search.
                                </h3>
                            </div>`;
}
