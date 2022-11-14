import { getMovieHtml } from "./getMovieHtml.js";

const movieWatchlist = document.getElementById("movie-watchlist");
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let allMoviesInWatchlist = {};

async function getWatchlist() {
  for (const movieId of watchlist) {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=960903a6&i=${movieId}`
    );
    const data = await res.json();

    /**
     * key is set to "[movie title] ([year]), [movieId]". Movie title is used in order to sort keys by title. If title is the
     * same, it is sorted based on year instead. If both title and year are the same, the unique imdbId has been added to the
     * key to assure that any movie can be added to watchlist.
     */
    allMoviesInWatchlist[data.Title + " (" + data.Year + "), " + movieId] =
      data;
  }
  for (const [key, value] of Object.entries(allMoviesInWatchlist).sort()) {
    movieWatchlist.innerHTML += getMovieHtml(allMoviesInWatchlist[key], true);
    document.getElementById(allMoviesInWatchlist[key].imdbID).innerHTML = `
                                                <img src="images/minus-btn-image.png">
                                                <h6>Remove<h6>
                                                `;
  }

  if (watchlist.length === 0) {
    document.getElementById("watchlist-placeholder").style.display = "flex";
  } else {
    document.getElementById("watchlist-placeholder").style.display = "none";
  }

  document.querySelectorAll(".remove-from-watchlist").forEach((movie) => {
    movie.addEventListener("click", (event) => {
      localStorage.removeItem(event.target.parentNode.id);
      let updatedWatchlist = watchlist.filter(
        (movieId) => movieId != event.target.parentNode.id
      );
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      location.reload();
    });
  });
}

getWatchlist();
