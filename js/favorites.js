document.addEventListener("DOMContentLoaded", () => {
  const favoritesContainer = document.getElementById("favorites");

  // جلب المفضلة من localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length > 0) {
    favoritesContainer.innerHTML = favorites
      .map((item) => {
        return `
            <div class="col-12 col-sm-6 col-md-4 mb-3">
              <div class="card categ text-center justify-content-center align-items-center h-100 shadow rounded bg-black text-white">
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" 
                     class="card-img-top rounded p-4" alt="${
                       item.title || item.name
                     }">
                <div class="card-body text-center">
                  <h5 class="card-title mb-3">${item.title || item.name}</h5>
                  <p class="card-text text-start">
                    ${
                      item.overview
                        ? item.overview.slice(0, 200) + "..."
                        : "No description available"
                    }
                  </p>
                </div>
                <div class="card-footer">
                  <a href="${
                    item.type === "movie" ? "movie.html?id=" : "series.html?id="
                  }${item.id}" class="m-3 btn btn-outline-danger">View Details</a>
                </div>
              </div>
            </div>
          `;
      })
      .join("");
  } else {
    favoritesContainer.innerHTML = "<p>No favorites added yet.</p>";
  }
});
