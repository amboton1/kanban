document.getElementById("theme-toggle").addEventListener("change", function () {
  document.body.classList.toggle("dark-theme");
});

document.querySelectorAll(".sidebar__board-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".sidebar__board-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});
