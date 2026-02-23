import { fetchData } from "../BoardState.js";

const toggle = document.getElementById("theme-toggle");
const hideSidebarBtn = document.querySelector(".sidebar__hide-btn");
const showSidebarBtn = document.querySelector(".sidebar__show-btn");

toggle?.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-theme") ? "dark" : "light",
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
        const itemName = item.querySelector("span").innerText;
        document.querySelector(".header__board-title").innerText = itemName;
        if (!item.classList.contains("create")) {
            fetchData(itemName);
        }
    });
});

hideSidebarBtn.addEventListener("click", () => {
    document.querySelector(".sidebar").classList.add("hide-sidebar");
    setTimeout(() => {
        document.querySelector(".sidebar").classList.remove("show-sidebar");
        document
            .querySelector(".board__board-wrapper")
            .classList.add("move-board-wrapper");
    }, 100);
});

showSidebarBtn.addEventListener("click", () => {
    document.querySelector(".sidebar").classList.add("show-sidebar");
    setTimeout(() => {
        document.querySelector(".sidebar").classList.remove("hide-sidebar");
        document
            .querySelector(".board__board-wrapper")
            .classList.remove("move-board-wrapper");
    });
});
