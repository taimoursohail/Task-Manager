// TASK FORM LOGIC
const inputForm = document.querySelector("#task-input");
const taskPushButton = document.querySelector(".add-task");
const taskContainer = document.querySelector(".task-list-content");

// MODAL LOGIC
const quickEditModal = document.querySelector(".quick-edit-modal");
const closeIcon = quickEditModal?.querySelector(".bi-x-octagon");
const editForm = quickEditModal?.querySelector("#edit-task-form");
const editInput = quickEditModal?.querySelector("#edit-task-input");

let currentlyEditingId = null;

// Load saved tasks on page load
window.addEventListener("load", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  savedTasks.forEach((task) => createTaskElement(task.id, task.text));
});

// Add new task
taskPushButton.addEventListener("click", (e) => {
  e.preventDefault();
  const text = inputForm.value.trim();

  if (!text) {
    inputForm.classList.add("error");
    alert("Please enter a task");
    return;
  }

  inputForm.classList.remove("error");
  const id = Date.now().toString();
  createTaskElement(id, text);
  saveTaskToStorage(id, text);
  inputForm.value = "";
});

// Handle task container clicks (edit/delete)
taskContainer.addEventListener("click", (e) => {
  const parentTask = e.target.closest(".task");
  if (!parentTask) return;

  // Delete task
  if (e.target.closest(".delete-icon")) {
    const list = parentTask.querySelector(".list");
    if (list?.id) {
      deleteTaskFromStorage(list.id);
      parentTask.remove();
    }
    return;
  }

  // Edit task
  if (e.target.closest(".edit-icon")) {
    const list = parentTask.querySelector(".list");
    if (!list?.id) return;

    currentlyEditingId = list.id;
    if (editInput && quickEditModal) {
      editInput.value = list.querySelector(".task-text").textContent.trim();
      quickEditModal.style.display = "block";
    }
  }
});

// Close modal
closeIcon?.addEventListener("click", () => {
  if (quickEditModal) {
    quickEditModal.style.display = "none";
    currentlyEditingId = null;
  }
});

// Save edited task
editForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentlyEditingId || !editInput) return;

  const newText = editInput.value.trim();
  if (!newText) {
    alert("Task cannot be empty");
    return;
  }

  const list = document.getElementById(currentlyEditingId);
  if (list) {
    const taskText = list.querySelector(".task-text");
    if (taskText) {
      taskText.textContent = newText;
      updateTaskInStorage(currentlyEditingId, newText);
    }
  }

  if (quickEditModal) {
    quickEditModal.style.display = "none";
    currentlyEditingId = null;
  }
});

// Create task DOM element
function createTaskElement(id, text) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("task");
  wrapper.innerHTML = `
    <div class="list" id="${id}">
      <span class="task-text">${escapeHtml(text)}</span>
      <div class="actions">
        <i class="bi bi-pencil-square edit-icon"></i>
        <i class="bi bi-trash delete-icon"></i>
      </div>
    </div>
  `;
  taskContainer.appendChild(wrapper);
}

// Storage helpers
function saveTaskToStorage(id, text) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push({ id, text });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInStorage(id, newText) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, text: newText } : task
  );
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function deleteTaskFromStorage(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const filteredTasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(filteredTasks));
}

// Escape HTML to prevent injection
function escapeHtml(str) {
  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (match) => htmlEntities[match]);
}

// Toggle task list visibility
document.querySelector(".task-list-toggle").addEventListener("click", () => {
  document.querySelector(".task-list-container").classList.toggle("active");
});

// Background Particle Animation
const container = document.getElementById("particles-container");
let totalParticles = 75;

if (window.innerWidth <= 576) {
  totalParticles = 30;
}

// all particles
for (let i = 0; i < totalParticles; i++) {
  const p = makeParticle();
  container.appendChild(p);
  animate(p);
}

// Single particle element
function makeParticle() {
  const p = document.createElement("div");
  p.className = "particle";

  // Random size 3–8px
  const size = rand(3, 8);
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;

  // Random bright neon color
  const colors = ["#00C9FF", "#92FE9D", "#FF6A88", "#FFD93D", "#845EC2"];

  p.style.background = colors[Math.floor(rand(0, colors.length))];

  // Glow effect
  p.style.borderRadius = "50%";
  p.style.boxShadow = `0 0 10px ${p.style.background}, 0 0 20px ${p.style.background}`;

  setRandomPosition(p);
  return p;
}

// particle to a random position + hide
function setRandomPosition(p) {
  p.style.left = `${rand(0, 100)}%`;
  p.style.top = `${rand(0, 100)}%`;
  p.style.opacity = "0";
}

// Particle movement
function animate(p) {
  setRandomPosition(p);

  const duration = rand(6, 12); // faster moves
  const delay = rand(0, 3);

  setTimeout(() => {
    p.style.transition = `all ${duration}s ease-in-out`;
    p.style.opacity = rand(0.4, 1);

    // Wider movement range
    const moveX = parseFloat(p.style.left) + rand(-30, 30);
    const moveY = parseFloat(p.style.top) - rand(10, 40);

    p.style.left = `${moveX}%`;
    p.style.top = `${moveY}%`;

    // repeat after finished
    setTimeout(() => animate(p), duration * 1000);
  }, delay * 1000);
}

// random float between min and max
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
