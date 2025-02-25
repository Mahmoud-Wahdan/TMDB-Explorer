document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    // تحقق من صحة البريد الإلكتروني: نسمح فقط للبريد الإلكتروني الذي ينتهي بـ gmail.com، yahoo.com، أو outlook.com
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    if (!emailRegex.test(email)) {
      showNotification(
        "Please enter a valid email address (e.g. example@gmail.com, example@yahoo.com, or example@outlook.com).",
        "danger"
      );
      return;
    }

    // تحقق من صحة كلمة المرور:
    // - على الأقل 8 أحرف
    // - يحتوي على حرف كبير واحد على الأقل
    // - يحتوي على حرف صغير واحد على الأقل
    // - يحتوي على رقم واحد على الأقل
    // - يحتوي على حرف مميز واحد على الأقل (@، -، أو _)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W.])[A-Za-z\d\W.]{8,}$/;
    if (!passwordRegex.test(password)) {
      showNotification(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "danger"
      );
      return;
    }

    // استرجاع بيانات المستخدمين أو تهيئتها إذا لم توجد
    const users = JSON.parse(localStorage.getItem("users")) || [];
    // التأكد من عدم وجود نفس البريد الإلكتروني
    if (users.some((u) => u.email === email)) {
      showNotification("Email is allready exist !", "danger");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    // مثال:
    showNotification("Sign up successful! You can now login.", "success");

    window.location.href = "login.html";
  });
});
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  // تغيير نوع التنبيه بناءً على المعطى (success, danger, info, warning)
  notification.className = `alert alert-${type}`;
  notification.textContent = message;
  notification.style.display = "block";
  // اخفاء الرسالة بعد 3 ثوانٍ
  setTimeout(() => {
    notification.style.display = "none";
  }, 10000);
}
document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("signup-password");
    const toggleIcon = document.getElementById("toggle-password-icon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
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
