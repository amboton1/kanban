class AddTaskModal {
  constructor() {
    this.modal = document.getElementById("add-task-modal");
    this.backdrop = document.querySelector(".modal__backdrop");
    this.closeBtn = document.querySelector(".modal__close");
    this.form = document.getElementById("add-task-form");
    this.titleInput = document.getElementById("task-title");
    this.descriptionInput = document.getElementById("task-description");
    this.subtasksContainer = document.getElementById("subtasks-container");
    this.addSubtaskBtn = document.getElementById("add-subtask-btn");
    this.statusDropdown = document.getElementById("status-dropdown");
    this.statusSelect = document.getElementById("status-select");
    this.statusDisplay = document.getElementById("status-display");
    this.statusList = document.getElementById("status-list");
    this.submitBtn = document.querySelector(".modal__submit");

    this.currentBoardIndex = 0;
    this.columns = [];

    this.init();
  }

  init() {
    this.closeBtn?.addEventListener("click", () => this.close());
    this.backdrop?.addEventListener("click", () => this.close());
    this.addSubtaskBtn?.addEventListener("click", () => this.addSubtask());
    this.statusSelect?.addEventListener("click", () => this.toggleDropdown());
    this.form?.addEventListener("submit", (e) => this.handleSubmit(e));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.statusDropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });

    this.addSubtask();
  }

  async loadBoardData() {
    const cachedData = localStorage.getItem("kanbanData");
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error("Error parsing cached data:", error);
      }
    }

    try {
      const response = await fetch("./data.json");
      const data = await response.json();

      localStorage.setItem("kanbanData", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error loading board data:", error);
      return null;
    }
  }

  async populateStatusOptions() {
    const data = await this.loadBoardData();

    if (!data || !data.boards || data.boards.length === 0) return;

    const currentBoard = data.boards[this.currentBoardIndex];
    this.columns = currentBoard.columns;

    this.statusList.innerHTML = "";

    this.columns.forEach((column, index) => {
      const li = document.createElement("li");
      li.className = "dropdown-item";
      li.textContent = column.name;
      li.setAttribute("data-status", column.name);
      li.setAttribute("role", "option");
      li.setAttribute("tabindex", "0");
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectStatus(column.name, index);
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectStatus(column.name, index);
        }
      });
      this.statusList.appendChild(li);
    });

    if (this.columns.length > 0) {
      this.selectStatus(this.columns[0].name, 0);
    }
  }

  selectStatus(status, index) {
    this.statusDisplay.textContent = status;
    this.statusSelect.setAttribute("data-selected-index", index);
    this.closeDropdown();
  }

  async toggleDropdown() {
    if (!this.statusDropdown) return;

    this.statusDropdown.classList.toggle("open");
    const isOpen = this.statusDropdown.classList.contains("open");
    this.statusSelect.setAttribute("aria-expanded", isOpen);

    if (isOpen) {
      if (!this.statusList || this.statusList.children.length === 0) {
        await this.populateStatusOptions();
      }
    }
  }

  closeDropdown() {
    this.statusDropdown.classList.remove("open");
    this.statusSelect.setAttribute("aria-expanded", "false");
  }

  addSubtask(title = "") {
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "input";
    input.placeholder = "e.g. Make modal";
    input.value = title;
    input.name = "subtask";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-subtask";
    removeBtn.innerHTML = '<img src="assets/icon-cross.svg" alt="Remove" />';
    removeBtn.addEventListener("click", () => {
      subtaskItem.remove();
    });

    subtaskItem.appendChild(input);
    subtaskItem.appendChild(removeBtn);
    this.subtasksContainer.appendChild(subtaskItem);
  }

  removeSubtask(button) {
    const subtaskItem = button.closest(".subtask-item");
    if (subtaskItem) {
      subtaskItem.remove();
    }
  }

  open() {
    this.modal.classList.add("open");
    this.modal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      this.titleInput.focus();
    }, 100);

    this.populateStatusOptions();
  }

  close() {
    this.modal.classList.remove("open");
    this.modal.setAttribute("aria-hidden", "true");

    this.resetForm();
  }

  isOpen() {
    return this.modal.classList.contains("open");
  }

  resetForm() {
    this.form.reset();
    this.subtasksContainer.innerHTML = "";
    this.addSubtask();
    this.clearErrors();
  }

  clearErrors() {
    const errorElements = this.form.querySelectorAll(".input-error-text");
    errorElements.forEach((el) => {
      el.style.display = "none";
      el.textContent = "";
    });

    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.classList.remove("error");
    });
  }

  validateForm() {
    let isValid = true;
    this.clearErrors();

    if (!this.titleInput.value.trim()) {
      this.showError(this.titleInput, "Title is required");
      isValid = false;
    }

    const subtaskInputs = this.subtasksContainer.querySelectorAll(
      'input[name="subtask"]',
    );
    const subtasks = Array.from(subtaskInputs).map((input) =>
      input.value.trim(),
    );

    const hasNonEmptySubtasks = subtasks.some((subtask) => subtask.length > 0);

    if (hasNonEmptySubtasks) {
      subtaskInputs.forEach((input, index) => {
        const value = input.value.trim();
        if (value && value.length < 1) {
          this.showError(input, "Subtask cannot be empty");
          isValid = false;
        }
      });
    }

    return isValid;
  }

  showError(input, message) {
    const errorElement = input.parentElement.querySelector(".input-error-text");
    if (errorElement) {
      errorElement.style.display = "block";
      errorElement.textContent = message;
    }
    input.classList.add("error");
    input.focus();
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const title = this.titleInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const statusIndex = parseInt(
      this.statusSelect.getAttribute("data-selected-index") || "0",
    );
    const status = this.columns[statusIndex]?.name || this.columns[0]?.name;

    const subtaskInputs = this.subtasksContainer.querySelectorAll(
      'input[name="subtask"]',
    );
    const subtasks = Array.from(subtaskInputs)
      .map((input) => input.value.trim())
      .filter((value) => value.length > 0)
      .map((title) => ({
        title,
        isCompleted: false,
      }));

    const newTask = {
      title,
      description,
      status,
      subtasks,
    };

    try {
      const data = await this.loadBoardData();
      if (data && data.boards && data.boards[this.currentBoardIndex]) {
        const columnIndex = this.columns.findIndex(
          (col) => col.name === status,
        );
        if (columnIndex !== -1) {
          data.boards[this.currentBoardIndex].columns[columnIndex].tasks.push(
            newTask,
          );

          await this.saveData(data);

          const updatedColumns = data.boards[this.currentBoardIndex].columns;
          document.dispatchEvent(new CustomEvent("taskAdded", { detail: { columns: updatedColumns } }));

          this.close();
        }
      }
    } catch (error) {
      console.error("Error saving task:", error);
      this.showError(
        this.submitBtn,
        "Failed to create task. Please try again.",
      );
    }
  }

  async saveData(data) {
    try {
      localStorage.setItem("kanbanData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.addTaskModalInstance = new AddTaskModal();
});
