import { fetchData } from "../../utils/fetchData.js";

const themeToggle = document.getElementById("theme-toggle");
const handleSidebarBtns = document.querySelectorAll(".handle-sidebar-btn");

themeToggle?.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-theme") ? "dark" : "light",
    );
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (themeToggle) {
        themeToggle.checked = true;
    }
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

Array.from(handleSidebarBtns).forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.className.includes("sidebar__hide-btn")) {
            toggleSidebarAction("hide-sidebar", "show-sidebar");
        } else if (btn.className.includes("sidebar__show-btn")) {
            toggleSidebarAction("show-sidebar", "hide-sidebar");
        }
    });
});

function toggleSidebarAction(classToAdd, classToRemove) {
    document.querySelector(".sidebar").classList.add(classToAdd);
    setTimeout(() => {
        document.querySelector(".sidebar").classList.remove(classToRemove);
        classToAdd === "hide-sidebar"
            ? document
                  .querySelector(".board__board-wrapper")
                  .classList.add("move-board-wrapper")
            : document
                  .querySelector(".board__board-wrapper")
                  .classList.remove("move-board-wrapper");
    }, 0);
}
