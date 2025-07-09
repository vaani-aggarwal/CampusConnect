window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');

  const roleRadios = document.querySelectorAll('input[name="role"]');
  const juniorFields = document.getElementById("junior-fields");
  const seniorFields = document.getElementById("senior-fields");
  const nameInput = document.getElementById("fname");
  const emailInput = document.getElementById("mail");
  const passwordInput = document.getElementById("pass");
  const confirmPasswordInput = document.getElementById("cpass");
  const form = document.querySelector("form");

  function updateQuestions(selectedRole) {
    if (selectedRole === "junior") {
      juniorFields.style.display = "block";
      seniorFields.style.display = "none";
      toggleFieldset(juniorFields, true);
      toggleFieldset(seniorFields, false);
    } else if (selectedRole === "senior") {
      seniorFields.style.display = "block";
      juniorFields.style.display = "none";
      toggleFieldset(seniorFields, true);
      toggleFieldset(juniorFields, false);
    }
  }

  function toggleFieldset(container, enabled) {
    const inputs = container.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      input.disabled = !enabled;
    });
  }

  if (roleParam) {
    roleRadios.forEach(input => {
      if (input.value === roleParam.toLowerCase()) {
        input.checked = true;
        input.disabled = true;
      } else {
        input.disabled = true;
      }
    });
    updateQuestions(roleParam.toLowerCase());
  }

  roleRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      updateQuestions(radio.value);
    });
  });

  confirmPasswordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordInput.setCustomValidity("Passwords do not match");
    } else {
      confirmPasswordInput.setCustomValidity("");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (passwordInput.value !== confirmPasswordInput.value) {
      alert("Passwords do not match.");
      confirmPasswordInput.focus();
      return;
    }

    const selectedRoleInput = document.querySelector('input[name="role"]:checked');
    if (!selectedRoleInput) {
      alert("Please select a role.");
      return;
    }

    const role = selectedRoleInput.value.toLowerCase();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase(); // ensure lower-case email
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    let year = "";
    let company = "";
    let designation = "";

    if (role === "junior") {
      year = document.getElementById("junior-year")?.value.trim() || "";
      if (!year) {
        alert("Please select your graduation year.");
        document.getElementById("junior-year").focus();
        return;
      }
    } else if (role === "senior") {
      year = document.getElementById("senior-year")?.value.trim() || "";
      company = document.querySelector("#senior-fields #company")?.value.trim() || "";
      designation = document.querySelector("#senior-fields #designation")?.value.trim() || "";
      if (!year) {
        alert("Please select your graduation year.");
        document.getElementById("senior-year").focus();
        return;
      }
    }

    // Check if user already exists
    let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    const existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
      alert("A user with this email already exists. Please log in.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
      year,
      company,
      designation
    };

    // Save all users
    allUsers.push(userData);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    if (role === "senior") {
      let seniorProfiles = JSON.parse(localStorage.getItem("seniorProfiles")) || [];

      // avoid duplicate seniorProfiles entries
      const alreadyExists = seniorProfiles.some(
        profile => profile.email === email
      );

      if (!alreadyExists) {
        const newProfile = {
          name,
          company,
          designation,
          year,
          email
        };
        seniorProfiles.push(newProfile);
        localStorage.setItem("seniorProfiles", JSON.stringify(seniorProfiles));
      }

      // ✅ Save flashcard on signup
      const flashcardKey = `flashcards_${email}`;
      if (!localStorage.getItem(flashcardKey)) {
        const flashcardData = {
          name,
          company,
          designation,
          year,
          email
        };
        localStorage.setItem(flashcardKey, JSON.stringify(flashcardData));
      }
    }

    // Save session data
    localStorage.setItem("currentUserName", name);
    localStorage.setItem("currentUserEmail", email);
    localStorage.setItem("currentUserRole", role);
    localStorage.setItem("currentUserYear", year);
    localStorage.setItem("currentUserCompany", company);
    localStorage.setItem("currentUserDesignation", designation);

    // Redirect
    if (role === "junior") {
      window.location.href = "junior-dashboard.html";
    } else if (role === "senior") {
      window.location.href = "senior-dashboard.html";
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
