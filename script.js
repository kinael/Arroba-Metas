let taskCounter = 0;

document.addEventListener("DOMContentLoaded", loadTasks);

// Referências ao modal
const modal = document.getElementById("noteModal");
const modalText = document.getElementById("noteText");
const closeModal = document.querySelector(".close");
const editNoteBtn = document.getElementById("editNoteBtn");
let currentTask = null; // Armazena a tarefa atual

// Fechar modal ao clicar no "X"
closeModal.onclick = function () {
    modal.style.display = "none";
};

// Fechar modal ao clicar fora dele
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function addTask() {
    let taskText = prompt("Digite a tarefa:");
    if (taskText) {
        let taskNote = prompt("Adicione uma nota (opcional):") || "";
        let task = createTaskElement(taskText, taskNote);
        document.getElementById("task-container").appendChild(task);
        saveTasks();
    }
}

function createTaskElement(text, note = "", id = null, parentId = null) {
    let task = document.createElement("div");
    task.className = "task";
    task.id = id || "task-" + taskCounter++;
    task.draggable = true;
    task.ondragstart = drag;
    task.dataset.note = note; // Armazena a nota na própria tarefa

    let taskText = document.createElement("span");
    taskText.textContent = text;
    task.appendChild(taskText);

    let noteBtn = document.createElement("button");
    noteBtn.className = "note-btn";
    noteBtn.textContent = "📝 Ver Nota";
    noteBtn.onclick = function () {
        modalText.value = task.dataset.note; // Exibir nota correta
        modal.style.display = "flex";
        currentTask = task; // Salvar referência da tarefa atual
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.onclick = function () {
        task.remove();
        saveTasks();
    };

    task.appendChild(noteBtn);
    task.appendChild(deleteBtn);

    if (parentId) {
        document.getElementById(parentId).appendChild(task);
    }

    return task;
}

// Salvar a edição da nota
editNoteBtn.onclick = function () {
    if (currentTask) {
        let newNote = modalText.value;
        currentTask.dataset.note = newNote;
        saveTasks();
        modal.style.display = "none";
    }
};

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
            let taskText = task.querySelector("span").textContent;
            let noteText = task.dataset.note || "";
            dayTasks.push({ id: task.id, text: taskText, note: noteText });
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
                let taskElement = createTaskElement(task.text, task.note, task.id, dayData.dayId);
                document.getElementById(dayData.dayId).appendChild(taskElement);
            });
        });
    }
}
