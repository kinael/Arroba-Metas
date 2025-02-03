let taskCounter = 0; 

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskText = prompt("Digite a tarefa:");
    if (taskText) {
        let task = createTaskElement(taskText);
        document.getElementById("task-container").appendChild(task);
        saveTasks();
    }
}

function createTaskElement(text, id = null, parentId = null) {
    let task = document.createElement("div");
    task.className = "task";
    task.textContent = text;
    task.id = id || "task-" + taskCounter++;
    task.draggable = true;
    task.ondragstart = drag;

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.onclick = function () {
        task.remove();
        saveTasks();
    };

    task.appendChild(deleteBtn); 

    if (parentId) {
        document.getElementById(parentId).appendChild(task);
    }

    return task;
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let draggedTask = document.getElementById(taskId);

    if (draggedTask && event.target.classList.contains("day")) {
        event.target.appendChild(draggedTask);
        saveTasks();
    }
}

function saveTasks() {
    let tasksData = [];
    document.querySelectorAll(".day").forEach(day => {
        let dayTasks = [];
        day.querySelectorAll(".task").forEach(task => {
            dayTasks.push({ id: task.id, text: task.textContent.replace("×", "").trim() });
        });
        tasksData.push({ dayId: day.id, tasks: dayTasks });
    });

    localStorage.setItem("tasksData", JSON.stringify(tasksData));
}

function loadTasks() {
    let savedTasks = localStorage.getItem("tasksData");
    if (savedTasks) {
        let tasksData = JSON.parse(savedTasks);
        tasksData.forEach(dayData => {
            dayData.tasks.forEach(task => {
                createTaskElement(task.text, task.id, dayData.dayId);
            });
        });
    }
}
