window.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("currentUserRole");
  if (role !== "junior") {
    alert("Access denied. This page is for juniors only.");
    window.location.href = "index.html";
    return;
  }

  const name = localStorage.getItem("currentUserName");
  const year = localStorage.getItem("currentUserYear");

  document.getElementById("welcome-text").textContent = name
    ? `Welcome, ${name}!`
    : `Welcome!`;

  const profilesRaw = localStorage.getItem("seniorProfiles");
  let profiles = [];

  try {
    profiles = JSON.parse(profilesRaw) || [];
  } catch (err) {
    console.error("Failed to parse seniorProfiles:", err);
  }

  const container = document.getElementById("seniorlist");

  function renderProfiles(list) {
    if (!container) return;
    container.innerHTML = "";

    if (list.length === 0) {
      container.innerHTML = `<p>No matching seniors found.</p>`;
      return;
    }

    list.forEach((profile) => {
      const flashcardsKey = `flashcards_${profile.email}`;
      const flashcardsRaw = localStorage.getItem(flashcardsKey);

      if (!flashcardsRaw) {
        console.log(`No flashcard for senior: ${profile.email}. Skipping.`);
        return;
      }

      let flashcardData;
      try {
        flashcardData = JSON.parse(flashcardsRaw);
      } catch (err) {
        console.error(`Failed to parse flashcard for ${profile.email}:`, err);
        return;
      }

      const card = document.createElement("div");
      card.className = "flashcard";
      card.innerHTML = `
        <h4>${flashcardData.name || "N/A"}</h4>
        <p>Company: ${flashcardData.company || "N/A"}</p>
        <p>Designation: ${flashcardData.designation || "N/A"}</p>
        <p>Graduation Year: ${flashcardData.year || "N/A"}</p>
        <button class="view-profile-btn" data-email="${profile.email}">View Profile</button>
      `;
      container.appendChild(card);
    });
  }

  renderProfiles(profiles);

  const searchInput = document.getElementById("search");

  function applySearch() {
    const searchVal = (searchInput?.value || "").trim().toLowerCase();

    if (!searchVal) {
      renderProfiles(profiles);
      return;
    }

    const filtered = profiles.filter((profile) => {
      const nameMatch = profile.name?.toLowerCase().includes(searchVal);
      const companyMatch = profile.company?.toLowerCase().includes(searchVal);
      const designationMatch = profile.designation?.toLowerCase().includes(searchVal);

      return nameMatch || companyMatch || designationMatch;
    });

    renderProfiles(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
  }

  // Wire up profile buttons
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-profile-btn")) {
      const email = e.target.getAttribute("data-email");
      if (email) {
        window.location.href = `profile.html?email=${encodeURIComponent(email)}`;
      }
    }
  });

  // Logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserRole");
      localStorage.removeItem("currentUserYear");
      window.location.href = "index.html";
    });
  }
});
