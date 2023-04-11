import { getMovieHtml } from "./getMovieHtml.js";

const movieWatchlist = document.getElementById("movie-watchlist");
// get the watchlist item from sessionStorage (localStorage does not work on GitHub Pages)
let watchlist = JSON.parse(sessionStorage.getItem("watchlist")) || [];
// allMoviesInWatchlist is used to sort the movies alphabetically
let allMoviesInWatchlist = {};

// for each movie in the watchlist, fetch the data for that movie
async function getWatchlist() {
  for (const movieId of watchlist) {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=960903a6&i=${movieId}`
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
  // for each entry in allMoviesInWatchlist, append HTML for that movie, and add remove "button" to each
  for (const [key, value] of Object.entries(allMoviesInWatchlist).sort()) {
    movieWatchlist.innerHTML += getMovieHtml(allMoviesInWatchlist[key], true);
    document.getElementById(allMoviesInWatchlist[key].imdbID).innerHTML = `
                                                <img src="images/minus-btn-image.png">
                                                <h6>Remove<h6>
                                                `;
  }
  // show placeholder html if watchlist is empty, hide it if not
  if (watchlist.length === 0) {
    document.getElementById("watchlist-placeholder").style.display = "flex";
  } else {
    document.getElementById("watchlist-placeholder").style.display = "none";
  }
  //add a click event listener to each movie's HTML
  document.querySelectorAll(".remove-from-watchlist").forEach((movie) => {
    movie.addEventListener("click", (event) => {
      // remove the clicked item from sessionStorage
      sessionStorage.removeItem(event.target.parentNode.id);
      // update the wathlist and update the 'watchlist' item in sessionStorage
      let updatedWatchlist = watchlist.filter(
        (movieId) => movieId != event.target.parentNode.id
      );
      sessionStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      // reload to show the updated watchlist
      location.reload();
    });
  });
}

getWatchlist();
