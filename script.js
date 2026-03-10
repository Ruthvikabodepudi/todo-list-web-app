const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');

let tasks = JSON.parse(localStorage.getItem('proTasks')) || [];

function saveAndRender() {
    localStorage.setItem('proTasks', JSON.stringify(tasks));
    render();
}

function render() {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        
        const timeLabel = task.date ? new Date(task.date).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : 'No set time';

        li.innerHTML = `
            <div class="task-text" onclick="toggleTask(${index})">
                <strong>${task.text}</strong>
                <small>📅 ${timeLabel} | Priority: ${task.priority}</small>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;
        todoList.appendChild(li);
    });
    
    taskCount.innerText = `${tasks.filter(t => !t.completed).length} tasks remaining`;
}

addBtn.onclick = () => {
    if (!input.value.trim()) return;
    tasks.push({
        text: input.value,
        date: dateInput.value,
        priority: priorityInput.value,
        completed: false,
        notified: false
    });
    input.value = '';
    dateInput.value = '';
    saveAndRender();
};

// Reminder Check Loop (Every 10 seconds)
setInterval(() => {
    const now = new Date().getTime();
    tasks.forEach(task => {
        if (task.date && !task.completed && !task.notified) {
            if (now >= new Date(task.date).getTime()) {
                if (Notification.permission === "granted") {
                    new Notification("Task Reminder", { body: task.text });
                } else {
                    alert("⏰ Reminder: " + task.text);
                }
                task.notified = true;
                saveAndRender();
            }
        }
    });
}, 10000);

window.toggleTask = (i) => { tasks[i].completed = !tasks[i].completed; saveAndRender(); };
window.deleteTask = (i) => { tasks.splice(i, 1); saveAndRender(); };
document.getElementById('clear-btn').onclick = () => { tasks = []; saveAndRender(); };

// Set Date in Header
const options = { weekday: 'long', month: 'long', day: 'numeric' };
document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);

// Request Permission on Load
if ("Notification" in window) Notification.requestPermission();

render();