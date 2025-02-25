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
