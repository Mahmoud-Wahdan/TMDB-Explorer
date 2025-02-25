const apiKey = "5ea8225a17e81dc365a6c046475ae6bb";

// الدالة العامة للبحث بناءً على نوع المحتوى والكلمة المفتاحية
async function search(query, type) {
  let url = "";

  if (type === "movie") {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`;
  } else if (type === "series") {
    url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`;
  } else if (type === "actor" || type === "director") {
    url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.results, type);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// دالة لعرض النتائج في صفحة البحث باستخدام بطاقات Bootstrap
function displayResults(results, type) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach((item) => {
    const title = item.title || item.name || "No Title";
    const imagePath = item.poster_path || item.profile_path;
    let link = "#";
    if (type === "movie") {
      link = `movie.html?id=${item.id}`;
    } else if (type === "series") {
      link = `series.html?id=${item.id}`;
    } else if (type === "actor" || type === "director") {
      link = `person.html?id=${item.id}`;
    }

    const cardHTML = `
      <div class="col-12 col-sm-6 col-md-4 mb-3">
        <div class="card h-100 shadow rounded bg-black text-white">
          <img src="https://image.tmdb.org/t/p/w500${imagePath}" class="card-img-top rounded p-4" alt="${title}">
          <div class="card-body text-center">
            <h5 class="card-title mb-3">${title}</h5>
            <p class="card-text text-start">
              ${
                item.overview
                  ? item.overview.slice(0, 200) + "..."
                  : "No description available"
              }
            </p>
          </div>
          <div class="card-footer">
            <a href="${link}" class="btn btn-outline-danger">View Details</a>
          </div>
        </div>
      </div>
    `;
    resultsContainer.innerHTML += cardHTML;
  });
}

// عند تحميل الصفحة، استخراج معطيات البحث من URL وتشغيل البحث
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  const type = params.get("type");
  if (query) {
    search(query, type);
  } else {
    document.getElementById("results").innerHTML =
      "<p>No search query provided.</p>";
  }
});
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