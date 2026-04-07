import { populateData } from "../components/BoardState.js";

export async function fetchData(item) {
    let data;
    const cached = localStorage.getItem("kanbanData");
    if (cached) {
        try {
            data = JSON.parse(cached);
        } catch {
            data = null;
        }
    }
    if (!data) {
        const response = await fetch("data.json");
        data = await response.json();
        localStorage.setItem("kanbanData", JSON.stringify(data));
    }
    const { boards } = data;
    const selectedBoard = boards.find((board) => board.name === item);
    if (!selectedBoard) return;
    populateData(selectedBoard.columns);
}
