document.addEventListener("DOMContentLoaded", () => {
  const navbarHTML = `
            <div class="container-fluid">
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
                <!-- Navbar (يمكنك إعادة استخدام نفس الكود المحدث للـ Navbar) -->
    <ul class="navbar-nav ms-auto" id="navbar-links">
      <li class="nav-item" id="login-link-item">
        <a class="nav-link" href="login.html" id="login-link">Login</a>
      </li>
      <li class="nav-item" id="register-link-item">
        <a class="nav-link" href="signup.html" id="register-link">Register</a>
      </li>
<li class="nav-item dropdown" id="profile-link-item" style="display: none">
  <a
    class="nav-link dropdown-toggle"
    href="#"
    id="profileDropdown "
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Profile
  </a>
  <ul class="dropdown-menu shadow bg-dark text-white " aria-labelledby="profileDropdown">
    <li id="profile-link-item">
      <a class="dropdown-item text-white" href="profile.html">Profile</a>
    </li>
    
    <li>
      <a class="dropdown-item text-white" href="favorite.html">Favorite</a>
    </li>
    <li id="logout-link-item" style="display: none">
      <a class="dropdown-item text-white" href="#" onclick="logoutUser()">Logout</a>
    </li>
  </ul>
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
              </div>
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
    // إذا كان لديك رابط Favorite خارجي، تأكد من وجود العنصر مع id="favorite-link"
    const favoriteLink = document.getElementById("favorite-link");
    if (favoriteLink) {
      favoriteLink.style.display = "block";
    }

    // تحديث نص الرابط ليظهر اسم المستخدم بدلاً من "Profile"
    const profileLink = document.querySelector("#profile-link-item a");
    if (profileLink) {
      profileLink.textContent = loggedInUser.name;
    }
  } else {
    // إذا لم يكن هناك مستخدم مسجل، إظهار روابط الدخول والتسجيل وإخفاء الملف الشخصي والخروج
    document.getElementById("login-link-item").style.display = "block";
    document.getElementById("register-link-item").style.display = "block";

    document.getElementById("profile-link-item").style.display = "none";
    document.getElementById("logout-link-item").style.display = "none";
    const favoriteLink = document.getElementById("favorite-link");
    if (favoriteLink) {
      favoriteLink.style.display = "none";
    }
  }
});

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}