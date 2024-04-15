'use strict'

// Сохранение и загрузка данных
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
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
    }

    
body.classList.add(`theme-${theme}`);
localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
});

document.getElementById('light-theme-button').addEventListener('click', function() {
    setTheme('light');
});

document.getElementById('dark-theme-button').addEventListener('click', function() {
    setTheme('dark');
});