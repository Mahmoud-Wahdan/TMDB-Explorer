const apiKey = "5ea8225a17e81dc365a6c046475ae6bb";

// دالة لاسترجاع المستخدم المُسجّل من localStorage
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

// دالة لتحديث بيانات المستخدم في localStorage
function updateUser(user) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const updatedUsers = users.map((u) => (u.email === user.email ? user : u));
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// دالة لإضافة المسلسل إلى المفضلة
function addToFavorites(item) {
  const user = getLoggedInUser();
  if (!user) {
    showNotification("Please log in to add to favorites.", "danger");
    return;
  }
  // تأكيد وجود مصفوفة المفضلة للمستخدم
  user.favorites = user.favorites || [];
  if (!user.favorites.some((fav) => fav.id === item.id)) {
    item.type = "series"; // تحديد نوع المحتوى كمسلسل
    user.favorites.push(item);
    updateUser(user);

    // تحديث المفضلة في localStorage بشكل منفصل
    updateFavoritesStorage(item);

    showNotification("Added to favorites!", "success");
  } else {
    showNotification("Already in favorites!", "warning");
  }
}

// دالة لتحديث المفضلة في localStorage
function updateFavoritesStorage(item) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some((fav) => fav.id === item.id)) {
    favorites.push(item);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log("Favorites updated:", favorites);
  }
}

// دالة تقييم المسلسل
function rateContent(itemId, rating, title, seriesData) {
  const user = getLoggedInUser();
  if (!user) {
    alert("Please log in to rate.");
    return;
  }
  user.ratings = user.ratings || [];
  const existingRating = user.ratings.find((r) => r.id === itemId);
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.title = title;
    existingRating.seriesData = seriesData;
    existingRating.type = "series";
  } else {
    user.ratings.push({
      id: itemId,
      rating,
      title,
      seriesData,
      type: "series",
    });
  }
  updateUser(user);
  showNotification("Rating submitted!", "success");
}

// دالة عرض الإشعارات للمستخدم
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type}`;
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.zIndex = "9999";
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// عند تحميل صفحة DOM
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const seriesId = params.get("id");
  const container = document.getElementById("series-details-container");

  if (!seriesId) {
    if (container) {
      container.innerHTML = "<p>No series id provided.</p>";
    }
    return;
  }

  try {
    // جلب تفاصيل المسلسل
    const seriesUrl = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}`;
    const seriesResponse = await fetch(seriesUrl);
    const series = await seriesResponse.json();

    // جلب بيانات الكاست
    const castUrl = `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}`;
    const castResponse = await fetch(castUrl);
    const castData = await castResponse.json();
    const cast = castData.cast.slice(0, 8);

    // جلب بيانات التريلر
    const trailerUrl = `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${apiKey}`;
    const trailerResponse = await fetch(trailerUrl);
    const trailerData = await trailerResponse.json();
    const trailer = trailerData.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );

    // عرض تفاصيل المسلسل داخل الصفحة
    if (container) {
      container.innerHTML = `
        <div class="row">
          <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" class="img-fluid shadow" alt="${series.name}" />
          </div>
          <div class="col-md-8">
            <h1>${series.name}</h1>
            <p><strong>Genre:</strong> ${series.genres.map((g) => g.name).join(", ")}</p>
            <p><strong>Seasons:</strong> ${series.number_of_seasons}</p>
            <p><strong>Overview:</strong> ${series.overview}</p>
            <p><strong>Rating:</strong> ${series.vote_average}</p>
            <div class="row mb-3 justify-content-between align-items-center">
              <div class="col my-3">
                <span class="ms-3">Add to Favorites:</span>
                <button id="fav-btn" class="btn btn-outline-danger ms-2">Add to Favorites</button>
              </div>
              <div class="col-md-6">
                <span class="ms-3">Rate:</span>
                <div id="rating-stars" class="d-inline-block ms-2">
                  <i class="fa fa-star star" data-value="1"></i>
                  <i class="fa fa-star star" data-value="2"></i>
                  <i class="fa fa-star star" data-value="3"></i>
                  <i class="fa fa-star star" data-value="4"></i>
                  <i class="fa fa-star star" data-value="5"></i>
                </div>
              </div>
            </div>
            <h3>Cast</h3>
            <div class="row">
              ${cast
                .map(
                  (actor) => `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-3">
                  <a class="text-decoration-none" href="person.html?id=${actor.id}">
                    <div class="card cast shadow bg-black text-white h-100">
                      <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" class="card-img-top rounded-circle p-3" alt="${actor.name}">
                      <div class="card-body text-center">
                        <h5 class="card-title mb-3">${actor.name}</h5>
                        <p class="card-text">${actor.character}</p>
                      </div>
                    </div>
                  </a>
                </div>
              `
                )
                .join('')}
            </div>
            <h3>Trailer</h3>
            ${ trailer ? `<div class="my-2 ratio ratio-16x9"><iframe src="https://www.youtube.com/embed/${trailer.key}" title="Trailer" allowfullscreen></iframe></div>` : '' }
          </div>
        </div>
      `;
    }

    // إضافة حدث لزر "Add to Favorites"
    const favButton = document.getElementById("fav-btn");
    if (favButton) {
      favButton.addEventListener("click", () => {
        addToFavorites(series);
      });
    }

    // إعداد نظام تقييم النجوم
    const stars = document.querySelectorAll("#rating-stars .star");
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const rating = parseInt(this.getAttribute("data-value"));

        // تحديث عرض النجوم بحسب التقييم
        stars.forEach((s) => {
          const starValue = parseInt(s.getAttribute("data-value"));
          if (starValue <= rating) {
            s.classList.add("text-warning");
            s.classList.remove("text-muted");
          } else {
            s.classList.add("text-muted");
            s.classList.remove("text-warning");
          }
        });

        // إرسال التقييم وتحديث بيانات المستخدم
        rateContent(series.id, rating, series.name, {
          poster_path: series.poster_path,
          title: series.name,
          overview: series.overview,
          vote_average: series.vote_average,
          type: "series",
        });
      });
    });
  } catch (error) {
    console.error("Error fetching series details:", error);
    if (container) {
      container.innerHTML = "<p>Error loading series details. Please try again later.</p>";
    }
  }
});
