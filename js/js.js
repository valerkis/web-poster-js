document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const openModalBtn = document.getElementById("openBtn");
    const closePopup = document.getElementById("closePopup");

    openModalBtn.addEventListener("click", function () {
      popup.style.display = "block";
    });

    closePopup.addEventListener("click", function () {
      popup.style.display = "none";
    });

    window.addEventListener("click", function (event) {
      if (event.target !== popup && event.target !== openBtn && !popup.contains(event.target)) {
        popup.style.display = "none";
      }
    });
  });