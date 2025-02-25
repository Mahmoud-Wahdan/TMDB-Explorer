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
