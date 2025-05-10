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


// دالة عرض صفحة الملف الشخصي
function displayProfile() {
  const user = getLoggedInUser();
  if (!user) {
    window.location.href = "login.html";
    return;
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
            <div class="card  categ text-center justify-content-center align-items-center h-100 shadow rounded bg-black text-white">
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
                  r.type === "movie" ? "movie.html?id=" : "series.html?id="
                }${r.id}" class=" btn btn-outline-danger m-3">View Details</a>
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