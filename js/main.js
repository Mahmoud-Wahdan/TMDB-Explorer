const apiKey = "5ea8225a17e81dc365a6c046475ae6bb";

document.addEventListener("DOMContentLoaded", async function () {
  // عرض الـ Hero Slider فقط على الشاشات الكبيرة (desktop)
  if (window.innerWidth >= 768) {
    await renderHeroSlider();
  }
  // عرض الأقسام الرئيسية
  await renderSection("movie", "popular", "popular-movies-items");
  await renderSection("movie", "top_rated", "rated-movies-items");
  await renderSection("tv", "popular", "popular-series-items");
  await renderSection("tv", "top_rated", "rated-series-items");

  // عرض التصنيفات (Genres)
  renderGenres();

  // تنفيذ الدالة لإزالة تأثير الـ hero section والـ carousel على الموبايل
  disableMobileHeroAndCarousel();

  // التعامل مع البحث عبر URL (في حالة وجود معطيات بحث)
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  const type = params.get("type") || "movie";
  if (query) {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("search-results").style.display = "block";
    handleSearch(query, type);
  }
});

// دالة جلب البيانات من API
async function fetchData(type, category) {
  const url = `https://api.themoviedb.org/3/${type}/${category}?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// دالة عرض الـ Hero Slider
async function renderHeroSlider() {
  const movies = await fetchData("movie", "popular");
  const heroItems = document.getElementById("hero-items");
  const heroIndicators = document.getElementById("hero-indicators");

  // تفريغ المحتوى السابق
  heroItems.innerHTML = "";
  heroIndicators.innerHTML = "";

  movies.slice(0, 5).forEach((movie, index) => {
    heroItems.insertAdjacentHTML(
      "beforeend",
      `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <img src="https://image.tmdb.org/t/p/original${
          movie.backdrop_path
        }" class="d-block w-100" alt="${movie.title}">
        <div class="fw-bold text-white-emphasis carousel-caption d-none d-md-flex">
          <h3>${movie.title}</h3>
          <p class="fw-normal">${movie.overview}</p>
          <a href="movie.html?id=${
            movie.id
          }" class="btn btn-outline-danger">View Details</a>
        </div>
      </div>
    `
    );

    heroIndicators.insertAdjacentHTML(
      "beforeend",
      `
      <button type="button" data-bs-target="#hero-slider" data-bs-slide-to="${index}" class="bg-danger ${
        index === 0 ? "active" : ""
      }"></button>
    `
    );
  });
}

// دالة عرض الأقسام (Popular/Top Rated)
// في حالة الشاشات الصغيرة (mobile) يتم بناء Grid Layout مع 4 كروت وبالتعديلات المطلوبة
// وعلى الشاشات الكبيرة (desktop) يتم عرض Carousel كما كانت سابقًا (مع 4 كروت لكل شريحة)
  async function renderSection(type, category, containerId) {
    const container = document.getElementById(containerId);

    // عرض Loading Cards مؤقتاً (عدد 4)
    container.innerHTML = `
      <div class="row">
        ${Array(4)
          .fill(
            `
          <div class="col-md-3">
            <div class="card" aria-hidden="true">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Loading" preserveAspectRatio="xMidYMid slice" focusable="false">
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
    // جلب البيانات من API
    const items = await fetchData(type, category);
    container.innerHTML = "";

    if (window.innerWidth < 768) {
      // شاشة الموبايل: بناء Grid Layout مع كل الكروت (تصميم أنيق)
      let gridHtml = '<div class="row justify-content-center">';
      items.forEach((item) => {
        gridHtml += `
          <div class="col-12 col-sm-6 col mb-3">
            <div class="card h-100 shadow rounded bg-black text-white">
              <img src="https://image.tmdb.org/t/p/w500${
                item.poster_path
              }" class="card-img-top rounded p-4" alt="${
          item.title || item.name
        }">
              <div class="card-body text-center">
                <h5 class="card-title mb-3">${item.title || item.name}</h5>
                <p class="card-text text-start">
                  ${
                    item.overview
                      ? item.overview.slice(0, 200)
                      : "No description available"
                  }
                </p>
                <a href="${
                  type === "movie" ? "movie.html?id=" : "series.html?id="
                }${item.id}" class="btn btn-outline-danger">View Details</a>
              </div>
            </div>
          </div>
        `;
      });
      gridHtml += "</div>";
      container.innerHTML = gridHtml;
    } else {
      // على التابلت والشاشات الكبيرة: بناء Carousel
      // تحديد عدد الكروت لكل شريحة بناءً على عرض الشاشة:
      // إذا كانت الشاشة أقل من 992px (تابلت) -> 3 كروت، وإلا -> 4 كروت.
      let chunkSize = window.innerWidth < 992 ? 3 : 4;
      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        container.innerHTML += `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <div class="row text-center justify-content-center align-items-center">
              ${chunk
                .map(
                  (item) => `
                    <div class="col mb-3">
                      <div class="card rounded shadow bg-black text-white mb-3">
                        <img src="https://image.tmdb.org/t/p/w500${
                          item.poster_path
                        }" class="card-img-top rounded p-4" alt="${
                    item.title || item.name
                  }">
                        <div class="card-body">
                          <h5 class="card-title mb-3">${
                            item.title || item.name
                          }</h5>
                          <p class="card-text text-start">
                            ${
                              item.overview
                                ? item.overview.slice(0, 200)
                                : "No description available"
                            }
                          </p>
                        </div>
                        <div class="card-footer">
                          <a href="${
                            type === "movie"
                              ? "movie.html?id="
                              : "series.html?id="
                          }${
                    item.id
                  }" class="btn btn-outline-danger">View Details</a>
                        </div>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        `;
      }
    }
  }

// دالة عرض التصنيفات (Genres)
function renderGenres() {
  const genresContainer = document.getElementById("genres");
  const genres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 10749, name: "Romance" },
    { id: 27, name: "Horror" },
    { id: 14, name: "Fantasy" },
    { id: 16, name: "Animation" },
    { id: 12, name: "Adventure" },
  ];
  genres.forEach((genre) => {
    const genreLink = document.createElement("a");
    genreLink.href = `categories.html?genre=${genre.id}`;
    genreLink.className = "btn btn-outline-info text-decoration-none";
    genreLink.textContent = genre.name;
    genresContainer.appendChild(genreLink);
  });
}

// دالة التعامل مع البحث داخل الصفحة الرئيسية
async function handleSearch(query, type) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "<p>Loading search results...</p>";
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
  } else {
    console.error("Invalid type");
    resultsContainer.innerHTML = "<p>Error: Invalid search type.</p>";
    return;
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.results, type);
  } catch (error) {
    console.error("Error fetching search data:", error);
    resultsContainer.innerHTML = "<p>Error fetching search results.</p>";
  }
}

// دالة عرض نتائج البحث باستخدام بطاقات Bootstrap
function displayResults(results, type) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  if (!results || results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }
  results.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card mb-3 col-md-3";
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${
        item.poster_path || item.profile_path
      }" class="card-img-top" alt="${item.title || item.name}">
      <div class="card-body">
        <h5 class="card-title">${item.title || item.name}</h5>
        <p class="card-text">${
          item.overview
            ? item.overview.slice(0, 200)
            : "No description available"
        }</p>
        <a href="${
          type === "movie"
            ? `movie.html?id=${item.id}`
            : type === "series"
            ? `series.html?id=${item.id}`
            : "#"
        }" class="btn btn-primary">View Details</a>
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}

// دالة إخفاء الـ hero section وعناصر الـ carousel على شاشات الموبايل
function disableMobileHeroAndCarousel() {
  if (window.innerWidth < 768) {
    // إخفاء قسم الـ hero (إذا كان موجودًا)
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.style.display = "none";
    }
    // إخفاء عناصر الـ carousel مثل المؤشرات وأزرار التحكم
    document
      .querySelectorAll(
        ".carousel-indicators, .carousel-control-prev, .carousel-control-next"
      )
      .forEach((element) => {
        element.style.display = "none";
      });
  }
}
