
const taskInput = document.querySelector("#task-input");
const addButton = document.querySelector("#add-button");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const taskPriority = document.querySelector("#task-priority");
const taskDate = document.querySelector("#task-date");
const taskSearch = document.querySelector("#task-search");
const editModal = document.querySelector("#edit-modal");
const editTaskName = document.querySelector("#edit-task-name");
const editTaskPriority = document.querySelector("#edit-task-priority");
const editTaskDate = document.querySelector("#edit-task-date");
const saveEditButton = document.querySelector("#save-edit-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");

let editingTaskItem = null;


// Phase 5 filter elements will be connected here.
const filterButtons = document.querySelectorAll(".filter-button");
let currentFilter = "all";

// Update the task count.
function updateTaskCount() {
  taskCount.textContent =
    "Tasks added: " + taskList.children.length;
}

// Save tasks in the browser.
function saveTasks() {
  const tasks = [];

  taskList.querySelectorAll("li").forEach(function(taskItem) {
    const taskLabel = taskItem.querySelector("span");

    const taskDetails = taskItem.querySelector(".task-details");
const detailsText = taskDetails.textContent;

const priorityMatch = detailsText.match(/Priority: (low|medium|high)/i);
const dateMatch = detailsText.match(/Due: (\d{4}-\d{2}-\d{2})/);

tasks.push({
  text: taskLabel.textContent,
  completed: taskItem.classList.contains("completed"),
  priority: priorityMatch ? priorityMatch[1].toLowerCase() : "medium",
  dueDate: dateMatch ? dateMatch[1] : ""

    });
  });

  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Show tasks based on the selected filter.
// This function will be used in Phase 5.

function applyFilter() {
  const searchText = taskSearch.value.toLowerCase().trim();

  taskList.querySelectorAll("li").forEach(function(taskItem) {
    const taskLabel = taskItem.querySelector("span");
    const taskText = taskLabel.textContent.toLowerCase();

    const isCompleted =
      taskItem.classList.contains("completed");

    const matchesSearch = taskText.includes(searchText);

    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !isCompleted) ||
      (currentFilter === "completed" && isCompleted);

    if (matchesSearch && matchesFilter) {
      taskItem.style.display = "flex";
    } else {
      taskItem.style.display = "none";
    }
  });
}

// Create one task.
function createTask(
  taskText,
  isCompleted = false,
  priority = "medium",
  dueDate = ""
) {
  const taskItem = document.createElement("li");
  const taskLabel = document.createElement("span");

  taskLabel.textContent = taskText;
const taskDetails = document.createElement("small");

taskDetails.textContent =
  "Priority: " + priority +
  (dueDate ? " | Due: " + dueDate : "");

taskDetails.className = "task-details";

  const completeButton = document.createElement("button");
  completeButton.textContent = isCompleted ? "Undo" : "Complete";
  completeButton.className = "complete-button";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-button";

const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.className = "edit-button";
  // Complete a task or undo completion.
  completeButton.addEventListener("click", function() {
    taskItem.classList.toggle("completed");

    const completed =
      taskItem.classList.contains("completed");

    completeButton.textContent = completed ? "Undo" : "Complete";

    updateTaskCount();
    saveTasks();
    applyFilter();
  });

  // Delete a task.
  deleteButton.addEventListener("click", function() {
    taskItem.remove();

    updateTaskCount();
    saveTasks();
    applyFilter();
  });




editButton.addEventListener("click", function() {
  editingTaskItem = taskItem;

  editTaskName.value = taskLabel.textContent;

  const detailsText =
    taskItem.querySelector(".task-details").textContent;

  const priorityMatch =
    detailsText.match(/Priority: (low|medium|high)/i);

  const dateMatch =
    detailsText.match(/Due: (\d{4}-\d{2}-\d{2})/);

  editTaskPriority.value = priorityMatch
    ? priorityMatch[1].toLowerCase()
    : "medium";

  editTaskDate.value = dateMatch ? dateMatch[1] : "";

  editModal.hidden = false;
  editTaskName.focus();
});
  taskItem.appendChild(taskLabel);
taskItem.appendChild(taskDetails);
taskItem.appendChild(completeButton);
taskItem.appendChild(editButton);
taskItem.appendChild(deleteButton);

  taskList.appendChild(taskItem);

  if (isCompleted) {
    taskItem.classList.add("completed");
  }

  updateTaskCount();
  applyFilter();
}

// Add a new task.
addButton.addEventListener("click", function() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    taskInput.focus();
    return;
  }

  createTask(
  taskText,
  false,
  taskPriority.value,
  taskDate.value
);

  taskInput.value = "";
taskPriority.value = "medium";
taskDate.value = "";
taskInput.focus();

  saveTasks();
});

// Restore saved tasks when the page opens.
const savedTasks =
  JSON.parse(localStorage.getItem("todoTasks")) || [];

savedTasks.forEach(function(task) {
  createTask(
    task.text,
    task.completed,
    task.priority || "medium",
    task.dueDate || ""
  );
});

updateTaskCount();
applyFilter();

// Phase 5: make the filter buttons work.
filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function(filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    applyFilter();
  });
});

taskSearch.addEventListener("input", function() {
  applyFilter();
});


saveEditButton.addEventListener("click", function() {
  if (editingTaskItem === null) {
    return;
  }

  const newText = editTaskName.value.trim();

  if (newText === "") {
    alert("Task name cannot be empty!");
    editTaskName.focus();
    return;
  }

  const taskLabel = editingTaskItem.querySelector("span");
  const taskDetails = editingTaskItem.querySelector(".task-details");

  const priority = editTaskPriority.value;
  const dueDate = editTaskDate.value;

  taskLabel.textContent = newText;

  taskDetails.textContent =
    "Priority: " + priority +
    (dueDate ? " | Due: " + dueDate : "");

  editModal.hidden = true;
  editingTaskItem = null;

  saveTasks();
  applyFilter();
});

cancelEditButton.addEventListener("click", function() {
  editModal.hidden = true;
  editingTaskItem = null;
});