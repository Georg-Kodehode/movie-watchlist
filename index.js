import { getMovieHtml } from "./getMovieHtml.js";

const movieList = document.getElementById("movie-list");
const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("input");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

// KOMMENTÉR koden!!!

searchBtn.addEventListener("click", async () => {
  const movieQuery = input.value.trim().toLowerCase();

  if (movieQuery) {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=960903a6&s=${movieQuery}`
    );
    const data = await res.json();
    movieList.innerHTML = "";
    try {
      for (let i = 0; i < data.Search.length; i++) {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=960903a6&i=${data.Search[i].imdbID}`
        );
        const newdata = await response.json();
        movieList.innerHTML += getMovieHtml(newdata, false);
      }
    } catch (err) {
      noMovieFound();
    }
    document.querySelectorAll(".add-to-watchlist").forEach((movie) => {
      movie.addEventListener("click", (event) => {
        if (!watchlist.includes(event.target.parentNode.id)) {
          watchlist.unshift(event.target.parentNode.id);
          localStorage.setItem(`watchlist`, JSON.stringify(watchlist));
          alert("This movie was added to your watchlist.");
        } else {
          alert("This movie is already in your watchlist.");
        }
      });
    });
  } else {
    noMovieFound();
  }
});

function noMovieFound() {
  movieList.innerHTML = `
                            <div class="placeholder-wrapper">
                                <h3 class="placeholder-text" id="placeholder-text" style="color: #787878;">
                                Unable to find what you’re looking for. Please try another search.
                                </h3>
                            </div>`;
}
