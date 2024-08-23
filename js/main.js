let form = document.querySelector('#form')
let taskInput = document.querySelector('#taskInput')
let tasksList = document.querySelector('#tasksList')
let emptyList = document.querySelector('#emptyList')

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask)

tasksList.addEventListener('click', deleteTask)

tasksList.addEventListener('click', doneTask)



function addTask(event) {
    event.preventDefault();
    
    // дістаємо завдання з поля введення
    let taskText = taskInput.value

    let newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // додаємо завдання в масив із завданнями
    tasks.push(newTask)
    saveToLocalStorage();

    renderTask(newTask);

    taskInput.value = ""
    taskInput.focus()
    checkEmptyList()
}

function deleteTask(event) {
    // перевіряємо якщо клік був не по кнопці видалити завдання
    if(event.target.dataset.action !== 'delete') return;

    // перевіряємо що клік був по кнопці видалити завдання
    let parenNode = event.target.closest('.list-group-item');

    // визначаємо ID завдання
    let id = Number(parenNode.id);

    let index = tasks.findIndex(function (task) {
        if (task.id === id) {
            return true
        }
    });

    tasks.splice(index, 1)
    saveToLocalStorage()

    // видаляємо завдання
    parenNode.remove();
    checkEmptyList()
}

function doneTask(event) {
    if(event.target.dataset.action !== 'done') return;

    let parentNode = event.target.closest('.list-group-item')

    let id = Number(parentNode.id);

    let task = tasks.find(function (task) {
        if (task.id === id) {
            return true
        }
    })

    task.done = !task.done
    saveToLocalStorage()

    let taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
    if(tasks.length === 0) {
        let emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="img/i85s608mof911.png" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список завдань порожній</div>
				</li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } 

    if (tasks.length > 0) {
        let emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    let cssClass = task.done ? 'task-title task-title--done' : 'task-title';
    let taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}