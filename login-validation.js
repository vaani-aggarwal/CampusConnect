document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('mail');
  const passwordInput = document.getElementById('pass');
  const emailError = document.getElementById('emailError');
  const passError = document.getElementById('passError');
  const togglePassword = document.getElementById('togglePassword');
  const rememberMe = document.getElementById('rememberMe');
  const loginError = document.getElementById('loginError');

  // Load saved credentials
  const storedEmail = localStorage.getItem('savedEmail');
  const storedPassword = localStorage.getItem('savedPassword');
  if (storedEmail && storedPassword) {
    emailInput.value = storedEmail;
    passwordInput.value = storedPassword;
    rememberMe.checked = true;
  }

  // Show/hide password toggle
  togglePassword.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    emailError.textContent = '';
    passError.textContent = '';
    loginError.textContent = '';

    let valid = true;

    // Simple email format check
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z]+\.[a-z]{2,}$/;
    const emailValue = emailInput.value.trim().toLowerCase();

    if (!emailPattern.test(emailValue)) {
      emailError.textContent = 'Enter a valid email';
      valid = false;
    }

    if (!passwordInput.value.trim()) {
      passError.textContent = 'Password cannot be empty';
      valid = false;
    }

    if (!valid) return;

    // Check stored users
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    const user = allUsers.find(
      (u) => u.email === emailValue &&
             u.password === passwordInput.value
    );

    if (!user) {
      loginError.textContent = "Invalid email or password.";
      return;
    }

    // ✅ Save session user data
    localStorage.setItem("currentUserName", user.name);
    localStorage.setItem("currentUserRole", user.role);
    localStorage.setItem("currentUserEmail", user.email);
    localStorage.setItem("currentUserYear", user.year || "");
    localStorage.setItem("currentUserCompany", user.company || "");
    localStorage.setItem("currentUserDesignation", user.designation || "");

    if (rememberMe.checked) {
      localStorage.setItem('savedEmail', emailValue);
      localStorage.setItem('savedPassword', passwordInput.value);
    } else {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
    }

    if (user.role === "junior") {
      window.location.href = "junior-dashboard.html";
    } else if (user.role === "senior") {
      window.location.href = "senior-dashboard.html";
    } else {
      alert("Unknown role. Please sign up again.");
    }
  });

  const backBtn = document.getElementById("back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.history.back();
      });
    }
});
