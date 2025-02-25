// دوال مساعدة للتعامل مع بيانات المستخدم
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

function updateUser(user) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const updatedUsers = users.map((u) => (u.email === user.email ? user : u));
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// دالة عرض صفحة الملف الشخصي
function displayProfile() {
  const user = getLoggedInUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // عرض اسم المستخدم
  document.getElementById("user-name").textContent = `Welcome, ${user.name}!`;

  // عرض المفضلة بتصميم الكارد
  const favoritesContainer = document.getElementById("favorites");
  if (user.favorites && user.favorites.length > 0) {
    favoritesContainer.innerHTML = user.favorites
      .map((item) => {
        return `
        <div class="col-12 col-sm-6 col-md-4 mb-3">
          <div class="card text-center justify-content-center align-items-center h-100 shadow rounded bg-black text-white">
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
              }${item.id}" class="btn btn-outline-danger">View Details</a>
            </div>
          </div>
        </div>
        `;
      })
      .join("");
  } else {
    favoritesContainer.innerHTML = "<p>No favorites added yet.</p>";
  }

  // عرض التقييمات بتصميم الكارد
  const ratingsContainer = document.getElementById("ratings");
  if (user.ratings && user.ratings.length > 0) {
    // نغلف التقييمات في صف (row)
    ratingsContainer.innerHTML =
      `<div class="row">` +
      user.ratings
        .map((r) => {
          // نحاول جلب بيانات الفيلم أو المسلسل من الخاصية movieData أو seriesData
          const itemData = r.movieData
            ? r.movieData
            : r.seriesData
            ? r.seriesData
            : null;
          if (!itemData) {
            // في حالة عدم وجود بيانات مفصلة، نعرض فقط النص البسيط
            return `
           `;
          }
          return `
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <div class="card text-center justify-content-center align-items-center h-100 shadow rounded bg-black text-white">
              <img src="https://image.tmdb.org/t/p/w500${itemData.poster_path}" 
                   class="card-img-top rounded p-4" alt="${
                     itemData.title || itemData.name
                   }">
              <div class="card-body">
                <h5 class="card-title mb-3">${
                  itemData.title || itemData.name
                }</h5>
                <p class="card-text text-start">
                  ${
                    itemData.overview
                      ? itemData.overview.slice(0, 200) + "..."
                      : "No description available"
                  }
                </p>
              </div>
              <div class="card-footer">
                <span class="badge bg-warning text-dark">Your Rating: ${
                  r.rating
                } / 5</span>
                <a href="${
                  itemData.type === "movie"
                    ? "movie.html?id="
                    : "series.html?id="
                }${r.id}" class="btn btn-outline-danger ms-2">View Details</a>
              </div>
            </div>
          </div>
          `;
        })
        .join("") +
      `</div>`;
  } else {
    ratingsContainer.innerHTML = "<p>No ratings submitted yet.</p>";
  }
}

document.addEventListener("DOMContentLoaded", displayProfile);
document.addEventListener("DOMContentLoaded", () => {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg bg-transparent navbar-dark" id="main-navbar">
      <div class="container-fluid">
        <!-- Logo -->
        <a class="navbar-brand fw-bold" href="index.html" id="navbar-logo">TMDB Explorer</a>

        <!-- Toggle Button -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto" id="navbar-links">
            <li class="nav-item" id="login-link-item">
              <a class="nav-link" href="login.html" id="login-link">Login</a>
            </li>
            <li class="nav-item" id="register-link-item">
              <a class="nav-link" href="signup.html" id="register-link">Register</a>
            </li>
            <li class="nav-item" id="profile-link-item" style="display: none;">
              <a class="nav-link" href="profile.html" id="profile-link">Profile</a>
            </li>
            <li class="nav-item" id="logout-link-item" style="display: none;">
              <a class="nav-link" href="#" id="logout-link" onclick="logoutUser()">Logout</a>
            </li>
          </ul>

          <!-- Search Form -->
          <form class="d-flex mt-3 mt-lg-0" role="search" id="search-form" method="get" action="search.html">
            <input class="form-control me-2" type="search" placeholder="Search" id="search-input" name="query" aria-label="Search" />
            <select id="type" name="type" class="form-select me-2">
              <option value="movie" selected>Movies</option>
              <option value="series">Series</option>
              <option value="actor">Actors</option>
              <option value="director">Directors</option>
            </select>
            <button class="btn btn-outline-warning" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  `;

  // نقوم بإدراج الـ Navbar في أعلى الصفحة
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
});
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = getLoggedInUser();

  if (loggedInUser) {
    // إخفاء روابط الدخول والتسجيل
    document.getElementById("login-link-item").style.display = "none";
    document.getElementById("register-link-item").style.display = "none";

    // إظهار روابط الملف الشخصي والخروج
    document.getElementById("profile-link-item").style.display = "block";
    document.getElementById("logout-link-item").style.display = "block";

    // تحديث نص الرابط الخاص بالملف الشخصي ليظهر اسم المستخدم
    const profileLink = document.querySelector("#profile-link-item a");
    if (profileLink) {
      profileLink.textContent = loggedInUser.name;
    }
  } else {
    // إذا لم يكن هناك مستخدم مسجل، إظهار روابط الدخول والتسجيل
    document.getElementById("login-link-item").style.display = "block";
    document.getElementById("register-link-item").style.display = "block";

    // إخفاء روابط الملف الشخصي والخروج
    document.getElementById("profile-link-item").style.display = "none";
    document.getElementById("logout-link-item").style.display = "none";
  }
});
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}