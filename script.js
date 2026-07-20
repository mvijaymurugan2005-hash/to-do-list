let tasks = [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statsEl = document.getElementById('stats');
const filterBtns = document.querySelectorAll('.filter-btn');

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ id: Date.now(), text: text, completed: false });
  taskInput.value = '';
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function render() {
  taskList.innerHTML = '';

  let filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

  if (filtered.length === 0) {
    taskList.innerHTML = '<div class="empty-msg">No tasks here 🎉</div>';
  } else {
    filtered.forEach(task => {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');

      li.innerHTML = `
        <div class="checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}">${task.completed ? '✓' : ''}</div>
        <span class="task-text" data-id="${task.id}">${escapeHtml(task.text)}</span>
        <button class="delete-btn" data-id="${task.id}">✕</button>
      `;
      taskList.appendChild(li);
    });
  }

  const activeCount = tasks.filter(t => !t.completed).length;
  statsEl.textContent = tasks.length === 0
    ? 'No tasks yet'
    : `${activeCount} active / ${tasks.length} total`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

taskList.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains('checkbox') || e.target.classList.contains('task-text')) {
    toggleTask(id);
  } else if (e.target.classList.contains('delete-btn')) {
    deleteTask(id);
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
