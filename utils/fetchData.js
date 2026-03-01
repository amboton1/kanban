import { populateData } from "../components/BoardState.js";

export async function fetchData(item) {
    const response = await fetch("data.json");
    const data = await response.json();
    const { boards } = data;
    const selectedBoard = boards.find((board) => board.name === item);
    if (!selectedBoard) return;
    populateData(selectedBoard.columns);
}
