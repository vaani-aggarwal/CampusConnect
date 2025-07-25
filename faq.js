document.addEventListener("DOMContentLoaded", () => {
  const acc = document.getElementsByClassName("accordion");

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }

  const backBtn = document.getElementById("back-btn");

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.history.back();
        });
    }
});
