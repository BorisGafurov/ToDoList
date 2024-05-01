'use strict'

// Сохранение и загрузка данных
let todos = []//JSON.parse(localStorage.getItem('task')) || [];

const storedTasks = localStorage.getItem('task');
console.log('Stored tasks:', storedTasks);
const storedCompletedTasks = localStorage.getItem('completedTask');
console.log('Stored completed tasks:', storedCompletedTasks);
let completedTodos = []
if (storedTasks !== null) {
  try {
      todos = JSON.parse(storedTasks);
  } catch (error) {
      console.error('Error parsing stored tasks:', error);
  } 
} else {
    console.error('No tasks found in localStorage');
  }

  if (storedCompletedTasks !== null) {
    try {
        completedTodos = JSON.parse(storedCompletedTasks);
    } catch (error) {
        console.error('Error parsing stored completed tasks:', error);
        completedTodos = [];
    } 
  } else {
      console.error('No completed tasks found in localStorage');
  }

function addTodo(task) {
  const newTodo = {
    id: Date.now(),
    task: task
  }

  todos.push(newTodo);
  updateLocalStorage(todos, completedTodos);
  return todos;
}

function updateLocalStorage(todos, completedTodos) {
  localStorage.setItem('task', JSON.stringify(todos));
  localStorage.setItem('completedTask', JSON.stringify(completedTodos));
}


// Переключение тем
function setTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    const themeClasses = ['theme-dark', 'theme-light'];

    themeClasses.forEach(className => body.classList.remove(className));

    if (theme === 'light') {
        root.style.setProperty('--background-color', '#7c7d80');
        root.style.setProperty('--text-color', '#0D0714');
        root.style.setProperty('--border-color', '#2c2a2a');
        root.style.setProperty('--button-hover-background', '#919056');
        root.style.setProperty('--task-background', '#2c2a2a');
        root.style.setProperty('--task-text-color', '#7c7d80');
        root.style.setProperty('--task-done-text-color', '#347e64');
        root.style.setProperty('--text-h1-color', '#2c2a2a');
        root.style.setProperty('--color-text-input', 'black');
        root.style.setProperty('--fill-color', '#7c7d80');
        root.style.setProperty('--task-span-color', '#2c2a2a');
        root.style.setProperty('--border-color-edit', '#7c7d80');
        root.style.setProperty('--color-text-input-edit', '#7c7d80');
    
    } else if (theme === 'dark') {
        root.style.setProperty('--background-color', '#0D0714');
        root.style.setProperty('--text-color', '#3E1671');
        root.style.setProperty('--border-color', '#3E1671');
        root.style.setProperty('--button-hover-background', '#9E78CF');
        root.style.setProperty('--task-background', '#15101C');
        root.style.setProperty('--task-text-color', '#9E78CF');
        root.style.setProperty('--task-done-text-color', '#78CFB0');
        root.style.setProperty('--text-h1-color', '#ffffff');
        root.style.setProperty('--color-text-input', 'white');
        root.style.setProperty('--fill-color', '#3E1671');
        root.style.setProperty('--task-span-color', 'white');
        root.style.setProperty('--border-color-edit', '#3E1671');
        root.style.setProperty('--color-text-input-edit', '#white');
    }

    
body.classList.add(`theme-${theme}`);
localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    const storedCompletedTasks = localStorage.getItem('completedTask');
    if (storedCompletedTasks) {
        completedTodos = JSON.parse(storedCompletedTasks);
        completedTodos.forEach(completedTask => {
        renderCompletedTasks(completedTask.task);
        });
    }

    if (todos.length > 0) {
      renderTasks(todos)
  }

  addDeleteButtonHandler();
  addDeleteButtonCompleted();
  addDoneButtonHandler();
  addEditButtonHandler();

  // Добавьте обработчик отправки формы после рендеринга задач
  const form = document.getElementById('tasks-form');
  form.addEventListener('submit', serializeForm);
});

document.getElementById('light-theme-button').addEventListener('click', function() {
    setTheme('light');
});

document.getElementById('dark-theme-button').addEventListener('click', function() {
    setTheme('dark');
});


// Отмена действии по умолчанию
function tasksForm(event) {
    event.preventDefault();
    const formData = serializeForm(event);
    updateLocalStorage(formData);
    
}
// Функции удаления активной задачи
function deleteTask(event) {
  const taskId = parseInt(event.target.closest('.task').dataset.id);
    todos = todos.filter(todo => todo.id !== taskId);
    updateLocalStorage(todos);
    event.target.closest('.task').remove();
    updateTaskNumber();
}


function addDeleteButtonHandler() {
  const deleteButtons = document.querySelectorAll('.img__delete');
  deleteButtons.forEach(button => {
      button.addEventListener('click', deleteTask);  
  });
}

// Функция кнопки завершения задачи
function addDoneButtonHandler() {
  const doneButtons = document.querySelectorAll('.img__done');
  doneButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          const buttonParent = event.target.parentNode; // Получаем родительский элемент <button>
          tasksDone(buttonParent); // Передаем родительский элемент кнопки вместо event.target
      });  
  });
}

// Функция кнопки редактирования задачи
function editButton(event) {
  const task = event.target.closest('.task');
  const taskSpan = task.querySelector('.task__span');
  const taskText = taskSpan.textContent.trim();
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add('task__input_edit');
  input.value = taskText;
  taskSpan.parentNode.replaceChild(input, taskSpan);

  input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        saveEditedTask(task, input);
    }
  });
}

// Функция для сохранения отредактированной задачи
function saveEditedTask(task, input) {
  const newTaskText = input.value.trim();
  const taskId = parseInt(task.dataset.id);

  const taskToUpdate = todos.find(todo => todo.id === taskId);
  if (taskToUpdate) {
  const taskSpan = document.createElement('span');
  taskSpan.classList.add('task__span');
  taskSpan.textContent = newTaskText;
  input.parentNode.replaceChild(taskSpan, input);
  updateTaskNumber();
  }
    
}

function addEditButtonHandler() {
  const editButtons = document.querySelectorAll('.img__edit');
  editButtons.forEach(button => {
      button.addEventListener('click', editButton);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  addEditButtonHandler();
});


// Функция для рендера завершенной задачи
function renderCompletedTasks(taskText) {
  
  const completedTaskElement = document.createElement('li');
  completedTaskElement.classList.add('task__done');
  
  const span = document.createElement('span');
  span.classList.add('task__span_done');
  span.textContent = taskText;
  console.log(span.textContent)
  const buttonDelete = document.createElement('button');
  buttonDelete.classList.add('button__task');
  buttonDelete.setAttribute('id', 'delete');
  buttonDelete.innerHTML = `<svg class="img__delete_done" width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.6112 3.125H1.48621C1.30387 3.125 1.129 3.19743 1.00007 3.32636C0.871139 3.4553 0.798706 3.63016 
  0.798706 3.8125C0.798706 3.99484 0.871139 4.1697 1.00007 4.29864C1.129 4.42757 1.30387 4.5 1.48621 4.5H2.17371V16.875C2.17371 
  17.2397 2.31857 17.5894 2.57643 17.8473C2.8343 18.1051 3.18403 18.25 3.54871 18.25H14.5487C14.9134 18.25 15.2631 18.1051 15.521 
  17.8473C15.7788 17.5894 15.9237 17.2397 15.9237 16.875V4.5H16.6112C16.7935 4.5 16.9684 4.42757 17.0973 4.29864C17.2263 4.1697 
  17.2987 3.99484 17.2987 3.8125C17.2987 3.63016 17.2263 3.4553 17.0973 3.32636C16.9684 3.19743 16.7935 3.125 16.6112 3.125ZM14.5487 
  16.875H3.54871V4.5H14.5487V16.875ZM4.92371 1.0625C4.92371 0.880164 4.99614 0.705295 5.12507 0.576364C5.254 0.447433 5.42887 0.375 
  5.61121 0.375H12.4862C12.6685 0.375 12.8434 0.447433 12.9723 0.576364C13.1013 0.705295 13.1737 0.880164 13.1737 1.0625C13.1737 
  1.24484 13.1013 1.4197 12.9723 1.54864C12.8434 1.67757 12.6685 1.75 12.4862 1.75H5.61121C5.42887 1.75 5.254 1.67757 5.12507 
  1.54864C4.99614 1.4197 4.92371 1.24484 4.92371 1.0625Z"/></svg>`;
  
  completedTaskElement.appendChild(span);
  completedTaskElement.appendChild(buttonDelete);

  const completedTasksContainer = document.getElementById('task__container_done');
  completedTasksContainer.appendChild(completedTaskElement);
}


// Функция добавления активной задачи в "Завершенные"
function tasksDone(doneTask) {
  const task = doneTask.closest('.task');
  const taskId = parseInt(task.dataset.id);

  // Находим завершенную задачу в массиве todos
  const completedTaskIndex = todos.findIndex(todo => todo.id === taskId);
  if (completedTaskIndex !== -1) {
      // Удаляем завершенную задачу из массива todos
      const completedTask = todos.splice(completedTaskIndex, 1)[0];

      // Добавляем завершенную задачу в массив completedTodos
      completedTodos.push(completedTask);

      // Обновляем локальное хранилище
      updateLocalStorage(todos, completedTodos);

      // Рендерим завершенные задачи
      renderCompletedTasks(completedTask.task);

      // Удаляем активную задачу из списка активных задач на странице
      task.remove();

      // Обновляем количество задач
      updateTaskNumber();
      updateTaskDoneNumber();
  }
}

function addDeleteButtonCompleted() {
  const deleteButtons = document.querySelectorAll('.img__delete_done');
  deleteButtons.forEach(button => {
      button.addEventListener('click', deleteTaskCompledet);  
  });
}

function deleteTaskCompledet(event) {
  const taskId = parseInt(event.target.closest('.task__done').dataset.id);
    todos = todos.filter(todo => todo.id !== taskId);
    updateLocalStorage(todos);
    event.target.closest('.task__done').remove();
    updateTaskDoneNumber();
}

// Обновление количества задач
function updateTaskNumber() {
  const tasksContainer = document.getElementById('tasks-container');
  const taskCount = tasksContainer.querySelectorAll('.task').length;
  const taskNumberSpan = document.getElementById('task-number');
  taskNumberSpan.textContent = taskCount;
}

function updateTaskDoneNumber() {
  const tasksContainer = document.getElementById('task__container_done');
  const taskCount = tasksContainer.querySelectorAll('.task__done').length;
  const taskNumberSpan = document.getElementById('task-done-number');
  taskNumberSpan.textContent = taskCount;
}


// Рендер задачи
function renderTasks(tasks) {
  const tasksContainer = document.getElementById('tasks-container');
  tasksContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом

  tasks.forEach(task => {
      const newTask = document.createElement('li');
      newTask.classList.add('task');
      newTask.dataset.id = task.id; // Добавляем идентификатор задачи как атрибут data-id

      newTask.innerHTML = `
          <span class="task__span">${task.task}</span>
          <button class="button__task" id="edit">
              <svg class="img__edit" width="18" height="19" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                  <path d="M23.906 3.969A4.095 4.095 0 0 0 21 5.188L5.406 20.78 5.188 21l-.063.313-1.094 5.5-.312 
                  1.468 1.469-.312 5.5-1.094.312-.063.219-.218L26.813 11a4.072 4.072 0 0 0 0-5.813 4.095 
                  4.095 0 0 0-2.907-1.218zm0 1.906c.503 0 1.013.232 1.5.719.974.973.974 2.026 0 
                  3l-.718.687-2.97-2.969.688-.718c.487-.487.997-.719 1.5-.719zm-3.593 2.844 2.968 2.969L11.188 
                  23.78a6.8 6.8 0 0 0-2.97-2.968L20.314 8.719zM6.938 22.438a4.744 4.744 0 0 1 2.625 
                  .625l-3.282.656.657-3.282z"/>
              </svg>
          </button>
          <button class="button__task" id="done">
              <svg class="img__done" width="18" height="13" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.7364 1.67391L6.73639 12.6739C6.67254 12.7378 6.59672 12.7885 6.51326 12.8231C6.4298 12.8577 
                  6.34033 12.8755 6.24999 12.8755C6.15964 12.8755 6.07018 12.8577 5.98671 12.8231C5.90325 12.7885 5.82743 12.7378 
                  5.76358 12.6739L0.951079 7.86141C0.822076 7.7324 0.749603 7.55744 0.749603 7.375C0.749603 7.19256 0.822076 7.0176 
                  0.951079 6.88859C1.08008 6.75959 1.25505 6.68712 1.43749 6.68712C1.61992 6.68712 1.79489 6.75959 1.92389 
                  6.88859L6.24999 11.2155L16.7636 0.701094C16.8926 0.572091 17.0676 0.499619 17.25 0.499619C17.4324 0.499619 
                  17.6074 0.572091 17.7364 0.701094C17.8654 0.830097 17.9379 1.00506 17.9379 1.1875C17.9379 1.36994 17.8654 
                  1.5449 17.7364 1.67391Z"/>
              </svg>
          </button>
          <button class="button__task" id="delete">
              <svg class="img__delete" width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6112 3.125H1.48621C1.30387 3.125 1.129 3.19743 1.00007 3.32636C0.871139 3.4553 0.798706 3.63016 
                  0.798706 3.8125C0.798706 3.99484 0.871139 4.1697 1.00007 4.29864C1.129 4.42757 1.30387 4.5 1.48621 4.5H2.17371V16.875C2.17371 
                  17.2397 2.31857 17.5894 2.57643 17.8473C2.8343 18.1051 3.18403 18.25 3.54871 18.25H14.5487C14.9134 18.25 15.2631 18.1051 15.521 
                  17.8473C15.7788 17.5894 15.9237 17.2397 15.9237 16.875V4.5H16.6112C16.7935 4.5 16.9684 4.42757 17.0973 4.29864C17.2263 4.1697 
                  17.2987 3.99484 17.2987 3.8125C17.2987 3.63016 17.2263 3.4553 17.0973 3.32636C16.9684 3.19743 16.7935 3.125 16.6112 3.125ZM14.5487 
                  16.875H3.54871V4.5H14.5487V16.875ZM4.92371 1.0625C4.92371 0.880164 4.99614 0.705295 5.12507 0.576364C5.254 0.447433 5.42887 0.375 
                  5.61121 0.375H12.4862C12.6685 0.375 12.8434 0.447433 12.9723 0.576364C13.1013 0.705295 13.1737 0.880164 13.1737 1.0625C13.1737 
                  1.24484 13.1013 1.4197 12.9723 1.54864C12.8434 1.67757 12.6685 1.75 12.4862 1.75H5.61121C5.42887 1.75 5.254 1.67757 5.12507 
                  1.54864C4.99614 1.4197 4.92371 1.24484 4.92371 1.0625Z"/>
              </svg>
          </button>
      `;

      tasksContainer.appendChild(newTask);
  });

  updateTaskNumber(); // Обновляем количество задач на странице
  addDeleteButtonHandler(); // Добавляем обработчики кнопок удаления
  addDoneButtonHandler(); // Добавляем обработчики кнопок завершения
  addEditButtonHandler(); // Добавляем обработчики кнопок редактирования
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('tasks-form');
  form.addEventListener('submit', serializeForm);

  addDeleteButtonHandler();
  addDeleteButtonCompleted();
});

// Работа с формой
function serializeForm(event) {
  event.preventDefault();
  
  const taskInput = document.getElementById('name');
  
  
  const taskText = taskInput.value.trim();
  
  if (taskText === '') {
      taskInput.classList.add('error')
      return;
  } else {
    taskInput.classList.remove('error')
  }
  
  const newTodo = addTodo(taskText);
  renderTasks(newTodo);
  
  taskInput.value = '';
}

  
const form = document.getElementById('tasks-form');
form.addEventListener('submit', serializeForm);

addDeleteButtonHandler();
addDeleteButtonHandler();
addDeleteButtonCompleted();
