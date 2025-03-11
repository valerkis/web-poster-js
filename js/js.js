document.addEventListener("DOMContentLoaded", function () {
    let button = document.getElementById("openBtn");
    let popup = document.getElementById("popup");
  
    if (button && popup) {
      button.addEventListener("click", function (event) {
        popup.style.display = "block";
        event.stopPropagation();
      });
  
      document.addEventListener("click", function (event) {
        if (!popup.contains(event.target) && event.target !== button) {
          popup.style.display = "none";
        }
      });
    } 

  });