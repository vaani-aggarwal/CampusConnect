document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  if (!email) {
    document.body.innerHTML = "<p>No senior specified.</p>";
    return;
  }

  const seniorProfiles = JSON.parse(localStorage.getItem("seniorProfiles")) || [];
  const senior = seniorProfiles.find(profile => profile.email === email);

  if (!senior) {
    document.body.innerHTML = "<p>Senior profile not found.</p>";
    return;
  }

  // Fill name
  document.querySelector(".profile-info h1").textContent = senior.name || "";

  // Fill company and designation
  const infoParas = document.querySelectorAll(".profile-info p");
  if (infoParas[0]) {
    infoParas[0].textContent = senior.company
      ? `Company: ${senior.company}`
      : "";
  }
  if (infoParas[1]) {
    infoParas[1].textContent = senior.designation
      ? `Designation: ${senior.designation}`
      : "";
  }

  // About
  const aboutSection = document.querySelector("#about-text");
  if (aboutSection) {
    const aboutPara = aboutSection.nextElementSibling;
    if (aboutPara) {
      aboutPara.textContent = senior.about || "No About Me added yet.";
    }
  }

  // Specializations
  const specList = document.getElementById("specializations-list");
  if (specList) {
    if (senior.specializations && senior.specializations.length > 0) {
      specList.innerHTML = senior.specializations
        .map(s => `<li>${s}</li>`)
        .join("");
    } else {
      specList.innerHTML = "<li>No specializations listed.</li>";
    }
  }

  // Placement Offers
  const offersList = document.getElementById("offers-list");
  if (offersList) {
    if (senior.offers && senior.offers.length > 0) {
      offersList.innerHTML = senior.offers
        .map(o => `<li>${o}</li>`)
        .join("");
    } else {
      offersList.innerHTML = "<li>No offers listed.</li>";
    }
  }

  // Help Offered
  const helpList = document.getElementById("help-list");
  if (helpList) {
    if (senior.help && senior.help.length > 0) {
      helpList.innerHTML = senior.help
        .map(h => `<li>${h}</li>`)
        .join("");
    } else {
      helpList.innerHTML = "<li>No help topics listed.</li>";
    }
  }

  // Profile photo
  const photoEl = document.getElementById("profile-photo");
  if (photoEl && email) {
    const savedPhoto = localStorage.getItem(`photo_${email}`);
    photoEl.src = savedPhoto || "blank.jpg";
  }

  // Set mailto link for guidance button
  const mailLink = document.querySelector(".contact-card a.guidance-btn[href^='mailto']");
  if (mailLink && senior.email) {
    mailLink.href = `mailto:${senior.email}`;
  }

  // Set LinkedIn link
  const linkedinLink = document.getElementById("linkedinLink");
  if (linkedinLink) {
    if (senior.linkedin) {
      linkedinLink.href = senior.linkedin;
      linkedinLink.textContent = senior.linkedin;
    } else {
      linkedinLink.href = "#";
      linkedinLink.textContent = "LinkedIn not provided";
    }
  }

  // Back button
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.history.back();
    });
  }
});
