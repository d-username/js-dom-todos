const todoList = document.querySelector("#todo-list");
const todoForm = document.querySelector("#todo-form");

// ---------------------------------------------

fetch("http://localhost:3000/todos")
  .then((res) => res.json())
  .then((todos) => {
    todos.forEach((todo) => {
      addTodoToList(todo);
    });
  });

// ---------------------------------------------
function addTodoToList(todo) {
  const newTodo = document.createElement("li");
  const statusButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  statusButton.addEventListener("click", () => {
    changeStatus(todo);
  });

  deleteButton.addEventListener("click", () => {
    deleteTodo(todo);
  });

  if (isCompleted(todo)) {
    newTodo.setAttribute("class", "completed");
    newTodo.innerText = todo.title;
    statusButton.innerText = "not done yet";
  } else {
    newTodo.innerText = todo.title;
    statusButton.innerText = "completed";
  }

  deleteButton.innerText = "delete";
  newTodo.append(statusButton);
  newTodo.append(deleteButton);
  todoList.append(newTodo);
}

// ---------------------------------------------
function isCompleted(todo) {
  if (todo.completed) {
    return true;
  }
  if (!todo.completed) {
    return false;
  }
}

// ---------------------------------------------
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const submittedTodo = event.target[0].value;
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: submittedTodo, completed: false }),
  };

  fetch("http://localhost:3000/todos", opts)
    .then((res) => res.json())
    .then((data) => {
      addTodoToList(data);
    });
});

// ---------------------------------------------
function changeStatus(todo) {
  let status = false;
  if (isCompleted(todo)) {
    status = false;
  } else if (!isCompleted(todo)) {
    status = true;
  }

  fetch("http://localhost:3000/todos/" + todo.id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: status }),
  });

  todoList.innerHTML = "";
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todos) => {
      todos.forEach((todo) => {
        addTodoToList(todo);
      });
    });
}

//------------------------------------------
function deleteTodo(todo) {
  fetch("http://localhost:3000/todos/" + todo.id, {
    method: "DELETE",
  });

  todoList.innerHTML = "";
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todos) => {
      todos.forEach((todo) => {
        addTodoToList(todo);
      });
    });
}
