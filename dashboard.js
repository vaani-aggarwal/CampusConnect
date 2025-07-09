window.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("userName");
    const year = localStorage.getItem("userYear");
    const company = localStorage.getItem("userCompany");
    const designation = localStorage.getItem("userDesignation");

    // Update welcome text
    const welcomeText = document.getElementById("welcome-text");
    if (name && welcomeText) {
      welcomeText.textContent = `Welcome, ${name}!`;
    }

  // Update info line
  const infoText = document.getElementById("info-text");
  if (infoText) {
    const companyDisplay = company ? company : "Company";
    const designationDisplay = designation ? designation : "Designation";
    const yearDisplay = year ? year : "Year";

    infoText.textContent = `You're currently listed as: ${designationDisplay} at ${companyDisplay} | ${yearDisplay} Batch`;
  }

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }

  const container = document.getElementById("seniorlist");
  const profiles = JSON.parse(localStorage.getItem("seniorProfiles")) || [];

  if (profiles.length === 0) {
    container.innerHTML = `<p>No senior profiles found.</p>`;
  } else {
    container.innerHTML = ""; // Clear dummy cards
    profiles.forEach(profile => {
      const card = document.createElement("div");
      card.className = "flashcard";
      card.innerHTML = `
        <h4>${profile.name}</h4>
        <p>Company: ${profile.company || "N/A"}</p>
        <p>Designation: ${profile.designation || "N/A"}</p>
        <p>Graduation Year: ${profile.year || "N/A"}</p>
        <button>View Profile</button>
      `;
      container.appendChild(card);
    });
  }
});
