const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressCircle = document.querySelector(".progress-circle");
const progressPercent = document.getElementById("progressPercent");
const progressText = document.getElementById("progressText");

let tasks = [];

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // ✅ UPDATED: Progress circle now uses the new light aqua color
  progressCircle.style.background = `conic-gradient(
    #7AFDEC ${percent * 3.6}deg, /* Light Aqua neon fill */
    #E9ECEF ${percent * 3.6}deg  /* Light gray unfilled part */
  )`;

  progressPercent.textContent = `${percent}%`;
  progressText.textContent = total === 0 
    ? "No tasks yet 🚀" 
    : `${completed} of ${total} tasks done`;

  if (percent === 100 && total > 0) {
    launchConfetti();
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
        <button class="complete-btn">✔</button>
        <button class="edit-btn">✏</button>
        <button class="delete-btn">🗑</button>
      </div>
    `;

    li.querySelector(".complete-btn").addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText) {
        tasks[index].text = newText;
        renderTasks();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      renderTasks();
    });

    taskList.appendChild(li);
  });
  updateProgress();
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    renderTasks();
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

renderTasks();

function launchConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  // ✅ UPDATED: Confetti colors now match the pastel glow theme
  const colors = ["#7AFDEC", "#F5B8FF", "#B1FFD6", "#FFCBA0"];

  (function frame() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return;

    const particle = document.createElement("div");
    particle.classList.add("confetti");
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 4000);

    requestAnimationFrame(frame);
  })();
}