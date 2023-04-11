const placeholderImg = "images/film-logo.png";

// returns HTML for each movie listed either in search or the watchlist, border-bottom is different based on which .html file is used
export function getMovieHtml(data, isWatchlist) {
  const { Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID } = data;
  // use placeholderImg if no poster found in the data
  const moviePoster = Poster !== "N/A" ? Poster : placeholderImg;
  return `
          <div class="movie-wrapper" style="border-bottom: 1.5px solid #${
            isWatchlist ? "E5E7EB" : "2c2c2c"
          };">
              <img src="${moviePoster}" class="movie-poster-img">
              <div class="movie-info">
                  <div class="movie-title-wrapper">
                      <h3 class="movie-title"><a href="https://www.imdb.com/title/${imdbID}" target="_blank">${Title}</a></h3>
                      <img src="images/star-image.png" class="star-img">
                      <h6 class="movie-rating">${imdbRating}</h6>
                  </div>
                  
                  <div class="movie-about-wrapper">
                      <h6>${Runtime}<h6>
                      <h6>${Genre}<h6>
                      <div class="add-to-watchlist remove-from-watchlist" id="${imdbID}">
                          <img src="images/plus-btn-image.png">
                          <h6>Watchlist<h6>
                      </div>
                  </div>
                  <p class="movie-plot">${Plot}</p>
              </div>
          </div>
      `;
}
