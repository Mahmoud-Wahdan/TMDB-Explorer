const apiKey = "5ea8225a17e81dc365a6c046475ae6bb";

// دالة لاسترجاع المحتوى حسب التصنيف
async function fetchByGenre(type, genreId) {
  const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&with_genres=${genreId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results || [];
}

window.onload = async () => {
  // استخراج معطيات الـ URL: نستخدم المفتاح "genre" بدلاً من "genre_id"
  const params = new URLSearchParams(window.location.search);
  const genreId = params.get("genre");
  let typeParam = params.get("type") || "movie"; // movie افتراضيًا

  // تحديث عنوان الصفحة بناءً على النوع
  let categoryTitle = "";
  if (typeParam === "movie") {
    categoryTitle = "Movies Category";
  } else if (typeParam === "tv") {
    categoryTitle = "Series Category";
  } else {
    categoryTitle = "Category Results";
  }
  document.getElementById("category-title").textContent = categoryTitle;

  // جلب النتائج باستخدام دالة fetchByGenre
  const results = await fetchByGenre(typeParam, genreId);
  const resultsContainer = document.getElementById("category-results");

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found for this category.</p>";
  } else {
    // قم بالفرز الابتدائي (افتراضي) ثم عرض النتائج
    let sortedResults = sortResults(results, "default");
    displayCategoryResults(sortedResults, typeParam);

    // إضافة مستمع حدث لقائمة الفرز
    document.getElementById("sort-options").addEventListener("change", (e) => {
      const sortOption = e.target.value;
      const sorted = sortResults(results, sortOption);
      displayCategoryResults(sorted, typeParam);
    });
  }
};

function displayCategoryResults(results, typeParam) {
  const resultsContainer = document.getElementById("category-results");
  resultsContainer.innerHTML = "";
  results.forEach((item) => {
    resultsContainer.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 mb-3 text-center">
        <div class="card h-100 shadow rounded bg-black text-white">
          <img src="https://image.tmdb.org/t/p/w500${
            item.poster_path
          }" class="card-img-top rounded p-4" alt="${item.title || item.name}">
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
              typeParam === "movie" ? "movie.html?id=" : "series.html?id="
            }${item.id}" class="btn btn-outline-danger">View Details</a>
          </div>
        </div>
      </div>
    `;
  });
}

function sortResults(results, sortOption) {
  if (sortOption === "default") return results;
  let sorted = results.slice();
  if (sortOption === "title-asc") {
    sorted.sort((a, b) => {
      let titleA = (a.title || a.name || "").toLowerCase();
      let titleB = (b.title || b.name || "").toLowerCase();
      return titleA.localeCompare(titleB);
    });
  } else if (sortOption === "title-desc") {
    sorted.sort((a, b) => {
      let titleA = (a.title || a.name || "").toLowerCase();
      let titleB = (b.title || b.name || "").toLowerCase();
      return titleB.localeCompare(titleA);
    });
  } else if (sortOption === "release-asc") {
    sorted.sort((a, b) => {
      let dateA = new Date(a.release_date || a.first_air_date || 0);
      let dateB = new Date(b.release_date || b.first_air_date || 0);
      return dateA - dateB;
    });
  } else if (sortOption === "release-desc") {
    sorted.sort((a, b) => {
      let dateA = new Date(a.release_date || a.first_air_date || 0);
      let dateB = new Date(b.release_date || b.first_air_date || 0);
      return dateB - dateA;
    });
  } else if (sortOption === "rating-asc") {
    sorted.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
  } else if (sortOption === "rating-desc") {
    sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if (sortOption === "popularity-asc") {
    sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
  } else if (sortOption === "popularity-desc") {
    sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
  return sorted;
}
