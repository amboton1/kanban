const toggle = document.getElementById("theme-toggle");

toggle?.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  toggle.checked = true;
}

document.querySelectorAll(".sidebar__board-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".sidebar__board-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});
