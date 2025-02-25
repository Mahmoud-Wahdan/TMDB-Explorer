const apiKey = "5ea8225a17e81dc365a6c046475ae6bb";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const personId = params.get("id");
  if (!personId) {
    document.getElementById("person-details").innerHTML =
      "<p>No person ID provided.</p>";
    return;
  }

  try {
    // جلب تفاصيل الشخص
    const personResponse = await fetch(
      `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}`
    );
    if (!personResponse.ok) throw new Error("Failed to fetch person details");
    const person = await personResponse.json();
    displayPersonDetails(person);

    // جلب الأعمال (Credits) المشتركة (Cast + Crew)
    const creditsResponse = await fetch(
      `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${apiKey}`
    );
    if (!creditsResponse.ok) throw new Error("Failed to fetch credits");
    const creditsData = await creditsResponse.json();
    const works = creditsData.cast.concat(creditsData.crew);

    // إزالة التكرار
    const uniqueWorks = [];
    const workIds = new Set();
    works.forEach((work) => {
      if (!workIds.has(work.id)) {
        workIds.add(work.id);
        uniqueWorks.push(work);
      }
    });

    // إضافة خاصية sortDate لكل عمل (release_date أو first_air_date)
    uniqueWorks.forEach((work) => {
      work.sortDate = null;
      if (work.media_type === "movie") {
        work.sortDate = work.release_date ? new Date(work.release_date) : null;
      } else if (work.media_type === "tv") {
        work.sortDate = work.first_air_date
          ? new Date(work.first_air_date)
          : null;
      }
    });

    // فصل الأعمال حسب النوع
    const movies = uniqueWorks.filter((work) => work.media_type === "movie");
    const tvSeries = uniqueWorks.filter((work) => work.media_type === "tv");

    // ترتيب الأعمال:
    // للأفلام:
    const mostPopularMovies = movies
      .slice()
      .sort((a, b) => b.popularity - a.popularity);
    const mostRecentMovies = movies
      .filter((m) => m.sortDate)
      .slice()
      .sort((a, b) => b.sortDate - a.sortDate);
    // للمسلسلات:
    const mostPopularTV = tvSeries
      .slice()
      .sort((a, b) => b.popularity - a.popularity);
    const mostRecentTV = tvSeries
      .filter((tv) => tv.sortDate)
      .slice()
      .sort((a, b) => b.sortDate - a.sortDate);

    // عرض النتائج باستخدام دالة renderWorks (نفس منطق main.js)
    renderWorks(mostPopularMovies, "popular-movies");
    renderWorks(mostPopularTV, "popular-tv");
    renderWorks(mostRecentMovies, "recent-movies");
    renderWorks(mostRecentTV, "recent-tv");
  } catch (error) {
    console.error("Error fetching person data:", error);
    document.getElementById("person-details").innerHTML =
      "<p>Error loading person details.</p>";
  }
});

function displayPersonDetails(person) {
  const container = document.getElementById("person-details");
  container.innerHTML = `
    <div class="row  mb-4">
      <div class="col-md-4">
        <img src="https://image.tmdb.org/t/p/w500${
          person.profile_path
        }" class="img-fluid rounded shadow" alt="${person.name}">
      </div>
      <div class="col-md-8">
        <h1>${person.name}</h1>
        <p><strong>Birthday:</strong> ${person.birthday || "N/A"}</p>
        <p><strong>Place of Birth:</strong> ${
          person.place_of_birth || "N/A"
        }</p>
        <p>${person.biography || "No biography available."}</p>
      </div>
    </div>
  `;
}

/**
 * دالة عرض الأعمال (works) بنفس منطق main.js:
 * - تعرض أولاً Loading placeholder.
 * - على الموبايل (<768px): Grid Layout.
 * - على التابلت/الديكستوب: Carousel مع تقسيم الشرائح (3 كروت للتابلت، 4 للديكستوب).
 *
 * @param {Array} works - قائمة الأعمال (credits) التي سيتم عرضها.
 * @param {String} containerId - معرف الحاوية (div) الذي ستُعرض فيه الأعمال.
 */
function renderWorks(works, containerId) {
  const container = document.getElementById(containerId);

  // عرض Loading placeholder (4 بطاقات)
  container.innerHTML = `
    <div class="row">
      ${Array(4)
        .fill(
          `
          <div class="col-md-3">
            <div class="card" aria-hidden="true">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="180"
                   xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Loading"
                   preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Loading</title>
                <rect width="100%" height="100%" fill="#868e96"></rect>
              </svg>
              <div class="card-body">
                <h5 class="card-title placeholder-glow"><span class="placeholder col-6"></span></h5>
                <p class="card-text placeholder-glow">
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-4"></span>
                  <span class="placeholder col-4"></span>
                  <span class="placeholder col-6"></span>
                  <span class="placeholder col-8"></span>
                </p>
                <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
              </div>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  // بعد تأخير بسيط، استبدال الـ placeholder بالمحتوى الفعلي
  setTimeout(() => {
    container.innerHTML = "";
    if (window.innerWidth < 768) {
      // شاشة الموبايل: Grid Layout
      let gridHtml = '<div class="row justify-content-center">';
      works.forEach((item) => {
        const title = item.title || item.name || "No Title";
        const imagePath = item.poster_path || item.profile_path;
        let link = "#";
        if (item.media_type === "movie") {
          link = `movie.html?id=${item.id}`;
        } else if (item.media_type === "tv") {
          link = `series.html?id=${item.id}`;
        } else if (item.media_type === "person") {
          link = `person.html?id=${item.id}`;
        }
        gridHtml += `
          <div class="col-12 col-sm-6 col-md-4 mb-3">
            <div class="card shadow rounded bg-black text-white">
              <img src="https://image.tmdb.org/t/p/w500${imagePath}" class="card-img-top rounded p-4" alt="${title}">
              <div class="card-body text-center">
                <h5 class="card-title mb-3">${title}</h5>
                <p class="card-text text-start">
                  ${
                    item.overview
                      ? item.overview.slice(0, 200)
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
      });
      gridHtml += "</div>";
      container.innerHTML = gridHtml;
    } else {
      // التابلت والديكستوب: Carousel Layout
      let chunkSize = window.innerWidth < 992 ? 3 : 4;
      const carouselId = containerId + "-carousel";
      let carouselHTML = `
        <div id="${carouselId}" class="carousel slide d-flex" data-bs-ride="carousel">
          <div class="carousel-inner">
      `;
      for (let i = 0; i < works.length; i += chunkSize) {
        const chunk = works.slice(i, i + chunkSize);
        carouselHTML += `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <div class="row text-center justify-content-center align-items-center">
        `;
        chunk.forEach((item) => {
          const title = item.title || item.name || "No Title";
          const imagePath = item.poster_path || item.profile_path;
          let link = "#";
          if (item.media_type === "movie") {
            link = `movie.html?id=${item.id}`;
          } else if (item.media_type === "tv") {
            link = `series.html?id=${item.id}`;
          } else if (item.media_type === "person") {
            link = `person.html?id=${item.id}`;
          }
          carouselHTML += `
            <div class="col mb-3">
              <div class="card  rounded shadow bg-black text-white mb-3 h-100">
                <img src="https://image.tmdb.org/t/p/w500${imagePath}" class="card-img-top rounded p-4" alt="${title}">
                <div class="card-body text-center">
                  <h5 class="card-title mb-3">${title}</h5>
                  <p class="card-text text-start">
                    ${
                      item.overview
                        ? item.overview.slice(0, 200)
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
        });
        carouselHTML += `
            </div>
          </div>
        `;
      }
      carouselHTML += `
          </div>
          <div class="mt-2 group">
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="rounded-circle bg-danger carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next rounded-circle" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
              <span class="rounded-circle bg-danger carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      `;
      container.innerHTML = carouselHTML;
    }
  }, 1000); // تأخير لمدة ثانية (يمكن تعديله حسب الحاجة)
}
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