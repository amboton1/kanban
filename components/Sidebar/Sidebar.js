import { fetchData } from "../../utils/fetchData.js";

const themeToggle = document.getElementById("theme-toggle");
const handleSidebarBtns = document.querySelectorAll(".handle-sidebar-btn");
const sidebarShowBtn = document.querySelector(".sidebar__show-btn");
const headerTitle = document.querySelector(".header__board-title");
let isOpen = false;

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

document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 768) {
        document.querySelector(".sidebar").dataset.open = false;
    } else {
        document.querySelector(".sidebar").dataset.open = true;
    }

    const addTaskBtn = document.querySelector(".header__actions .btn-primary");
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            const modal = document.getElementById("add-task-modal");
            if (modal && window.addTaskModalInstance) {
                window.addTaskModalInstance.open();
            } else if (modal) {
                modal.classList.add("open");
                modal.setAttribute("aria-hidden", "false");
            }
        });
    }
});

document.querySelector(".sidebar").addEventListener("click", () => {
    isOpen = false;
    document.querySelector(".sidebar").dataset.open = isOpen;
    if (window.innerWidth <= 768) {
        sidebarShowBtn.style.left =
            Math.floor(headerTitle.getBoundingClientRect().right) + "px";
        sidebarShowBtn.style.transition =
            "transform 0.45s ease-in-out, left 0.45s ease-in-out";
    }
});

Array.from(handleSidebarBtns).forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.className.includes("sidebar__hide-btn")) {
            toggleSidebarAction("hide-sidebar", "show-sidebar");
        } else if (btn.className.includes("sidebar__show-btn")) {
            toggleSidebarAction("show-sidebar", "hide-sidebar");
        }
        isOpen = !isOpen;
        document.querySelector(".sidebar").dataset.open = isOpen;
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
