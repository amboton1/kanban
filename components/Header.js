const addNewTaskBtn = document.querySelector(".header__actions .btn-primary");
const sidebarShowBtn = document.querySelector(".sidebar__show-btn");
const headerTitle = document.querySelector(".header__board-title");

if (window.innerWidth <= 768) {
    addNewTaskBtn.innerHTML = `<img src="../assets/icon-add-task-mobile.svg" />`;
    sidebarShowBtn.innerHTML = `<img src="../assets/icon-chevron-down.svg" />`;
    sidebarShowBtn.style.left =
        Math.floor(headerTitle.getBoundingClientRect().right) + "px";
} else {
    addNewTaskBtn.innerHTML = "+ Add New Task";
    sidebarShowBtn.innerHTML = `<img src="../assets/icon-show-sidebar.svg" />`;
    sidebarShowBtn.style.left = "initial";
}

window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
        addNewTaskBtn.innerHTML = `<img src="../assets/icon-add-task-mobile.svg" />`;
        sidebarShowBtn.innerHTML = `<img src="../assets/icon-chevron-down.svg" />`;
        sidebarShowBtn.style.left =
            Math.floor(headerTitle.getBoundingClientRect().right) + "px";
    } else {
        addNewTaskBtn.innerHTML = "+ Add New Task";
        sidebarShowBtn.innerHTML = `<img src="../assets/icon-show-sidebar.svg" />`;
        sidebarShowBtn.style.left = "initial";
    }
});
