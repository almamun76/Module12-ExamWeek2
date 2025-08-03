// find the HTML <div> element in the index.html page by the id='alertContainer'
const alertContainer = document.getElementById('alertContainer');

// find the HTML <input> element in the index.html page by the id='taskInput'
const taskInput = document.getElementById('taskInput');

// find the HTML <button> element in the index.html page by the id='addTaskBtn'
const addTaskBtn = document.getElementById('addTaskBtn');

// find the HTML <span> element in the index.html page by the id='taskCount'
const taskCount = document.getElementById('taskCount');

// find the HTML <ul> element in the index.html page by the id='taskList'
const taskList = document.getElementById('taskList');


// retrieve saved tasks (which saved as JSON string) from the browser's localStorage, converts back to JavaScript array and store them in an array named 'tasksArray'
// if no tasks saved, it returns an empty array
let tasksArray = JSON.parse(localStorage.getItem('tasks')) || [];
// console.log(tasksArray);


// attaches an event (click event) listener to that button 'addTaskBtn'
// when the button is clicked, it will call the function named addTask
addTaskBtn.addEventListener('click', addTask);


// attaches an event (Keydown event against the Enter key) listener on an input field 'taskInput'
// when the Enter key is pressed, it will call the function named addTask
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});


// validate user input, add new task to the task list, update UI and show alert to the user
function addTask() {
    // retrieves the value entered in the task input field (taskInput), removes any leading/trailing whitespace, and stores it in a variable named 'title'
    const title = taskInput.value.trim();
    // prevent storing empty input
    if (title === '') {
        showAlert('Task cannot be empty.', 'danger');
        return;
    }

    // add a new task object to the tasksArray array. each object has 2 properties. one is 'title' another is 'completed' which default value is set to false
    tasksArray.push({ title, completed: false });
    taskInput.value = '';
    // saves the updated tasks array to localStorage
    saveTasks();
    // renders the task list in the UI including the new task
    renderTasks();
    // shows a success message to the user indicating that the task was added
    showAlert('Task added successfully!');
}


// saveTasks() function saves the current list of tasks to the browser's local storage
// Syntax: localStorage.setItem(key, value)
function saveTasks() {
    // Stores data in the browser’s local storage under the name 'tasks' (key) and the tasksArray array is converted into JSON string
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}


// renderTasks() function dynamically updates and displays a list of tasks on the page by creating and inserting HTML elements into the DOM.
function renderTasks() {
    // clears all existing list items in the taskList element before rendering new ones.
    taskList.innerHTML = '';
    // loops through the tasks array. Each task is an object and index is its position in the array.
    tasksArray.forEach((task, index) => {
        // creates a new <li> element for this task.
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        // creates a <span> to display the task title.
        const span = document.createElement('span');
        span.textContent = task.title;

        if (task.completed) {
            span.classList.add('completed-class');
        }
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => toggleComplete(index));

        // creates a <button> to delete the targeted task
        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm btn-danger';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteTask(index));

        // appends the text (<span> element) inside the <li> element
        li.appendChild(span);
        // appends the delete button inside the <li> element
        li.appendChild(delBtn);
        // adds the complete <li> element inside the task list (<ul>).
        taskList.appendChild(li);
    });
    // calls the updateTaskCount() function that updates a visible counter of how many tasks are in the list
    updateTaskCount();
}


// display a temporary Bootstrap alert message on the webpage. Default alert type is set to 'success'
function showAlert(msgText, type = 'success') {
    // creates a new <div> element that will act as the alert box.
    const alert = document.createElement('div');
    // sets the alert's class using Bootstrap classes (dismissible alert box)
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    // displays the msgText and adds a close button (btn-close) that dismisses the alert when clicked
    alert.innerHTML = `${msgText} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    // adds the alert <div> to the DOM by inserting it into a container element with the variable name alertContainer
    alertContainer.appendChild(alert);
}


//updates the displayed number of tasksArray (array length)
function updateTaskCount() {
    taskCount.textContent = tasksArray.length;
}


// delete a task from a task list, update the saved tasksArray, re-render the task list on the UI, show a confirmation alert and update task count
function deleteTask(index) {
    // removes 1 task from the tasksArray array starting at the specified index
    tasksArray.splice(index, 1);
    saveTasks();
    renderTasks();
    showAlert('Task deleted!', 'warning');
}


// toggles the completion status of the task at the given index.
function toggleComplete(index) {
    tasksArray[index].completed = !tasksArray[index].completed;
    saveTasks();
    renderTasks();
}


// Initial render
renderTasks();