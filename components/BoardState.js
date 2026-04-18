import { fetchData } from "../utils/fetchData.js";
const colorsArray = ["#49C4E5", "#8471F2", "#67E2AE"];

const board = document.querySelector(".board");

export function populateData(boardColumns) {
    board.innerHTML = "";
    const boardWrapper = document.createElement("div");
    boardWrapper.classList.add("board__board-wrapper");
    boardColumns.forEach((column, index) => {
        const boardColumn = document.createElement("div");
        boardColumn.classList.add("board__board-wrapper__board-column");
        const h2 = document.createElement("h2");
        const colorSpan = document.createElement("span");
        colorSpan.classList.add("span-color");
        colorSpan.style.backgroundColor = colorsArray[index];
        h2.innerText = column.name + " (" + column.tasks.length + ")";
        h2.prepend(colorSpan);
        boardColumn.append(h2);
        column.tasks.forEach((task) => {
            const columnTask = document.createElement("div");
            columnTask.classList.add("board-column__column-task");
            const taskTitle = document.createElement("h3");
            taskTitle.innerText = task.title;
            const amountOfSubtasksCompleted = document.createElement("p");
            const amount = task.subtasks.filter(
                (task) => task.isCompleted === true,
            ).length;
            amountOfSubtasksCompleted.innerText =
                amount + " of " + task.subtasks.length + " subtasks";
            columnTask.append(taskTitle, amountOfSubtasksCompleted);
            boardColumn.append(columnTask);
        });
        boardWrapper.append(boardColumn);
        board.append(boardWrapper);
    });
    const createNewColumnBtn = document.createElement("button");
    createNewColumnBtn.classList.add("new-column-button");
    createNewColumnBtn.innerText = "+ New Column";
    document.querySelector(".board__board-wrapper").append(createNewColumnBtn);
}

fetchData(document.querySelector("span").innerText);

document.addEventListener("taskAdded", (e) => {
    populateData(e.detail.columns);
});
