// Image slider functionality
const sliders = document.querySelectorAll(".slider");
sliders.forEach((slider) => {
  const images = slider.querySelectorAll("img");
  if (images.length > 0) {
    let currentIndex = 0;
    images[currentIndex].classList.add("active");

    slider.addEventListener("click", function () {
      images[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add("active");
    });
  }
});

// Mode toggle functionality
const modeToggleButtons = document.querySelectorAll(
  "#mode-toggle, #mode-toggle2"
);

if (modeToggleButtons.length > 0) {
  modeToggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      document.body.classList.toggle("dark-mode");

      // Update text content for both toggle buttons
      // modeToggleButtons.forEach((btn) => {
      //   if (document.body.classList.contains("dark-mode")) {
      //     btn.textContent = "#MMRRTT";
      //   } else {
      //     btn.textContent = "#000000";
      //   }
      // });
    });
  });
}

//CURSOR
const customCursor = document.querySelector(".custom-cursor");

// Increase size on hover
const links = document.querySelectorAll("a, button, .slider, .imgGrid");

links.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(2)";
  });

  link.addEventListener("mouseleave", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(1)";
  });
});

// Update cursor position
document.addEventListener("mousemove", (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
});
