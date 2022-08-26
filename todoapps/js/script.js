document.addEventListener('DOMContentLoaded', function(){
    const todos = [];
    const RENDER_EVENT = 'render-todo';

    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(e){
        e.preventDefault();

        addTodo();
    });

    // FUNGSI MENAMBAH TUGAS
    function addTodo(){
        const title = document.getElementById('title');
        const date = document.getElementById('date');

        let titleValue = title.value;
        let dateValue = date.value;

        const generateID = generateId();

        const todoObject = generateTodoObject(generateID, titleValue, dateValue, false);

        todos.push(todoObject);
        
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function makeTodo(todoObject){
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.title;

        const textDate = document.createElement('p');
        textDate.innerText = ' deadline : ' + todoObject.date;

        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.style.color = '#444';
        textContainer.append(textTitle, textDate);

        const container = document.createElement('div');
        container.classList.add('item');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);

        if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');
         
            undoButton.addEventListener('click', function () {
              undoTaskFromCompleted(todoObject.id);
            });
         
            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');

            trashButton.addEventListener('click', function () {
              removeTaskFromCompleted(todoObject.id);

              const popup = confirm('anda yakin ingin menghapus todo ini ?');

              if(popup == true){
                alert('Todo Berhasi Dihapus');
              } else {
                alert('Todo Gagal Dihapus');
              }
            });
         
            container.append(undoButton, trashButton);
          } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
            
            checkButton.addEventListener('click', function () {
              addTaskToCompleted(todoObject.id);
            });
            
            container.append(checkButton);
          }

        return container;
    }

    function addTaskToCompleted (todoId) {
        const todoTarget = findTodo(todoId);
       
        if (todoTarget == null) return;
       
        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function removeTaskFromCompleted(todoId) {
      const todoTarget = findTodoIndex(todoId);
     
      if (todoTarget === -1) return;
     
      todos.splice(todoTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
    
    function findTodoIndex(todoId) {
      for (const index in todos) {
        if (todos[index].id === todoId) {
          return index;
        }
      }
     
      return -1;
    }
     
    function undoTaskFromCompleted(todoId) {
      const todoTarget = findTodo(todoId);
     
      if (todoTarget == null) return;
     
      todoTarget.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function findTodo(todoId) {
        for (const todoItem of todos) {
          if (todoItem.id === todoId) {
            return todoItem;
          }
        }
        return null;
    }

    function generateId(){
        return +new Date();
    }

    function generateTodoObject(id, title, date, isCompleted){
        return {
            id,
            title,
            date,
            isCompleted
        }
    }

    document.addEventListener(RENDER_EVENT, function () {
      const uncompletedTODOList = document.getElementById('todos');
      uncompletedTODOList.innerHTML = '';
    
      const completedTODOList = document.getElementById('completed-todos');
      completedTODOList.innerHTML = '';
    
      for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted)
          uncompletedTODOList.append(todoElement);
        else
          completedTODOList.append(todoElement);
      }
    });

});