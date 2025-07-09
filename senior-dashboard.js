window.addEventListener("DOMContentLoaded", () => {
  // Check logged-in user role
  const role = localStorage.getItem("currentUserRole");
  if (role !== "senior") {
    alert("Access denied. This page is for seniors only.");
    window.location.href = "index.html";
    return;
  }

  const name = localStorage.getItem("currentUserName");
  const year = localStorage.getItem("currentUserYear");
  const company = localStorage.getItem("currentUserCompany");
  const designation = localStorage.getItem("currentUserDesignation");
  const about = localStorage.getItem("currentUserAbout") || "";
  const email = localStorage.getItem("currentUserEmail");

  let specializations = [];
  let offers = [];
  let help = [];

  try {
    specializations = JSON.parse(localStorage.getItem("currentUserSpecializations")) || [];
    offers = JSON.parse(localStorage.getItem("currentUserOffers")) || [];
    help = JSON.parse(localStorage.getItem("currentUserHelp")) || [];
  } catch (err) {
    console.error("Failed to parse user arrays:", err);
  }

  console.log("🌟 Senior Dashboard Values:", { name, year, company, designation });

  // Update welcome text
  const welcomeText = document.getElementById("welcome-text");
  if (welcomeText) {
    welcomeText.textContent = name ? `Welcome, ${name}!` : "Welcome!";
  }

  // Update info line
  const infoText = document.getElementById("info-text");
  if (infoText) {
    infoText.textContent = `You're currently listed as: ${designation || "Designation"} at ${company || "Company"} | ${year || "Year"} Batch`;
  }

  // Update profile preview
  document.getElementById("profile-name").textContent = name || "";
  document.getElementById("profile-year").textContent = year ? `Class of ${year}` : "";
  document.getElementById("profile-company").textContent = company ? `Company: ${company}` : "";
  document.getElementById("profile-designation").textContent = designation ? `Designation: ${designation}` : "";

  // Update lists
  const specList = document.getElementById("profile-specializations");
  const offersList = document.getElementById("profile-offers");
  const helpList = document.getElementById("profile-help");
  const aboutPara = document.getElementById("profile-about");

  specList.innerHTML = specializations.length
    ? specializations.map(s => `<li>${s}</li>`).join("")
    : "<li>No specializations listed.</li>";

  offersList.innerHTML = offers.length
    ? offers.map(o => `<li>${o}</li>`).join("")
    : "<li>No offers listed.</li>";

  helpList.innerHTML = help.length
    ? help.map(h => `<li>${h}</li>`).join("")
    : "<li>No help topics listed.</li>";

  aboutPara.textContent = about || "No About Me added yet.";

  // Handle logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserRole");
      localStorage.removeItem("currentUserYear");
      localStorage.removeItem("currentUserCompany");
      localStorage.removeItem("currentUserDesignation");
      localStorage.removeItem("currentUserAbout");
      localStorage.removeItem("currentUserSpecializations");
      localStorage.removeItem("currentUserOffers");
      localStorage.removeItem("currentUserHelp");
      localStorage.removeItem("currentUserPhoto");
      localStorage.removeItem("currentUserEmail");
      window.location.href = "index.html";
    });
  }

  // ---------- TABS ----------
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));
      btn.classList.add("active");
      const tabName = btn.getAttribute("data-tab");
      const panel = document.getElementById(tabName);
      if (panel) panel.classList.add("active");
    });
  });

  // ---------- Edit Profile ----------
  const editModal = document.getElementById("editModal");
  const openEditBtn = document.getElementById("edit-profile-btn");
  const closeEditBtn = document.getElementById("closeEditModal");
  const editForm = document.getElementById("editProfileForm");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (openEditBtn) {
    openEditBtn.addEventListener("click", () => {
      document.getElementById("editName").value = name || "";
      document.getElementById("editCompany").value = company || "";
      document.getElementById("editDesignation").value = designation || "";
      document.getElementById("editYear").value = year || "";
      document.getElementById("editAbout").value = about || "";
      document.getElementById("editSpecializations").value = specializations.join(", ");
      document.getElementById("editOffers").value = offers.join(", ");
      document.getElementById("editHelp").value = help.join(", ");
      editModal.style.display = "block";
    });
  }

  if (closeEditBtn) {
    closeEditBtn.addEventListener("click", () => {
      editModal.style.display = "none";
      document.body.classList.remove("modal-open");
    });
  }

  if(cancelBtn){
    cancelBtn.addEventListener("click",(e) =>{
      if (editModal) {
      editModal.style.display = "none"; // Hide modal
    }
    if (editForm) {
      editForm.reset(); // Reset form fields
    }
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("editName").value.trim();
      const company = document.getElementById("editCompany").value.trim();
      const designation = document.getElementById("editDesignation").value.trim();
      const year = document.getElementById("editYear").value.trim();
      const about = document.getElementById("editAbout").value.trim();

      const specializations = document
        .getElementById("editSpecializations")
        .value
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const offers = document
        .getElementById("editOffers")
        .value
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const help = document
        .getElementById("editHelp")
        .value
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      // Save to session
      localStorage.setItem("currentUserName", name);
      localStorage.setItem("currentUserCompany", company);
      localStorage.setItem("currentUserDesignation", designation);
      localStorage.setItem("currentUserYear", year);
      localStorage.setItem("currentUserAbout", about);
      localStorage.setItem("currentUserSpecializations", JSON.stringify(specializations));
      localStorage.setItem("currentUserOffers", JSON.stringify(offers));
      localStorage.setItem("currentUserHelp", JSON.stringify(help));

      // ✅ Save flashcard data
      const email = localStorage.getItem("currentUserEmail");
      const flashcardData = {
        name,
        company,
        designation,
        year,
        email
      };
      localStorage.setItem(`flashcards_${email}`, JSON.stringify(flashcardData));

      // ✅ Update seniorProfiles
      let seniorProfiles = JSON.parse(localStorage.getItem("seniorProfiles")) || [];
      const existingIndex = seniorProfiles.findIndex(p => p.email === email);
      const newProfile = { name, company, designation, year, email, specializations, offers, help, about };

      if (existingIndex !== -1) {
        seniorProfiles[existingIndex] = newProfile;
      } else {
        seniorProfiles.push(newProfile);
      }
      localStorage.setItem("seniorProfiles", JSON.stringify(seniorProfiles));

      // ✅ Update allUsers
      let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
      const userIndex = allUsers.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        allUsers[userIndex] = {
          ...allUsers[userIndex],
          name,
          company,
          designation,
          year
        };
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
      }

      alert("Profile updated successfully!");
      editModal.style.display = "none";
      document.body.classList.remove("modal-open");
      window.location.reload();
    });
  }

  // ---------- Handle account deletion ----------
  const deleteBtn = document.getElementById("delete-account-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to permanently delete your account?")) {
        // Remove from allUsers
        let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
        const filtered = allUsers.filter(user => user.email !== email);
        localStorage.setItem("allUsers", JSON.stringify(filtered));

        // Remove seniorProfiles
        let seniorProfiles = JSON.parse(localStorage.getItem("seniorProfiles")) || [];
        seniorProfiles = seniorProfiles.filter(profile => profile.email !== email);
        localStorage.setItem("seniorProfiles", JSON.stringify(seniorProfiles));

        // Remove photo
        localStorage.removeItem(`photo_${email}`);

        // Remove flashcard
        localStorage.removeItem(`flashcards_${email}`);

        // Clear session
        localStorage.removeItem("currentUserName");
        localStorage.removeItem("currentUserRole");
        localStorage.removeItem("currentUserYear");
        localStorage.removeItem("currentUserCompany");
        localStorage.removeItem("currentUserDesignation");
        localStorage.removeItem("currentUserAbout");
        localStorage.removeItem("currentUserSpecializations");
        localStorage.removeItem("currentUserOffers");
        localStorage.removeItem("currentUserHelp");
        localStorage.removeItem("currentUserPhoto");
        localStorage.removeItem("currentUserEmail");

        alert("Your account has been deleted.");
        window.location.href = "index.html";
      }
    });
  }

  // ---------- PROFILE PHOTO ----------
  const profilePicEl = document.getElementById("profile-picture");
  const uploadInput = document.getElementById("upload-photo");

  if (profilePicEl && email) {
    const savedPhoto = localStorage.getItem(`photo_${email}`);
    profilePicEl.src = savedPhoto && savedPhoto.startsWith("data:")
      ? savedPhoto
      : "blank.jpg";
  }

  if (uploadInput) {
    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64 = event.target.result;
          if (profilePicEl) {
            profilePicEl.src = base64;
          }
          if (email) {
            localStorage.setItem(`photo_${email}`, base64);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const profileLink = document.getElementById("profile-link");

  if (profileLink && email) {
    profileLink.href = `profile.html?email=${encodeURIComponent(email)}`;
  }

});
