
const listTaskContainer =  document.getElementById('tasks');
let storageKey = 'todoList';
let currentTab = 'all';
let todoList = JSON.parse(localStorage.getItem(storageKey)) ? JSON.parse(localStorage.getItem(storageKey)) : [];
let hiddenItemIndex = [];
updateView();
function updateView() {
    listTaskContainer.innerHTML = '';
    updateTodoList();
}
//nhấn enter xuống dòng, chưa fix được lỗi nhận dấu cách là một chuỗi nên vẫn nhận giá trị
let listTasksElement = document.getElementById('inputValue');
listTasksElement.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addContentElement();      
    }
});

function updateTodoList(task) {
    let count = 0;
    let taskTotal = document.getElementById('all');
    let doneTask = document.getElementById('done');
    let notDoneTask = document.getElementById('notDone');
    //for..of.. là vòng lặp rút gọn ngoài ra còn có cả for..in..
    //for..of.. sử dụng để duyệt từng phần tử của đối tượng duyệt.
    //Số lượng lặp bằng với số phần tử của đối tượng.
    for (task of todoList) {
        if (task.status) {
            ++count;
        }
    }
    taskTotal.innerHTML = 'Tất cả: ' + todoList.length;
    doneTask.innerHTML = 'Đã hoàn thành: ' + count;
    notDoneTask.innerHTML = 'Chưa hoàn thành: ' + (todoList.length - count);
    taskTotal.removeAttribute('class');
    doneTask.removeAttribute('class');
    notDoneTask.removeAttribute('class');
    for (let i = 0; i < todoList.length; i++) {
        if (hiddenItemIndex.indexOf(i) !== -1) {
            continue;
        }
        if (currentTab === 'done' && todoList[i].status) {//
            doneTask.setAttribute('class', 'color-task');
            addOneTask(todoList[i]);
        } else if (currentTab === 'notDone' && !todoList[i].status) {
            notDoneTask.setAttribute('class', 'color-task');
            addOneTask(todoList[i]);
        } else if (currentTab === 'all') {
            taskTotal.setAttribute('class', 'color-task');
            addOneTask(todoList[i]);
        }
    }

}
//task=todolist[i]
function addOneTask(task) {
    // create div 
    let division = document.createElement('div');
    //createTextNode() được sử dụng để tạo nội dung văn bản, có thể được gán cho một node nào đó đã được tạo trước đó bởi createElement().
    //Sau khi đã gán nội dung cho node đã tạo, sử dụng phương thức element.appendChild() hoặc element.insertBefore() để gắn node đó vào trang.
    textNode = document.createTextNode(task.content);
    //append-nối nội dung hoặc html vào một phần tử, là phương thức của JQuery
    //appendChild nối một phần tử DOM thuần túy để thêm một phần tử con, là phương thức của JS
    division.appendChild(textNode);
    listTaskContainer.appendChild(division);
    localStorage.setItem(storageKey, JSON.stringify(todoList));
    createCheckbox(division, task);
    createDelete(division, task);
    createTop(division, task);
    createBottom(division, task);
    createUp(division, task);
    createDown(division, task);
}

function addContentElement() {
    let listTasksElement = document.getElementById('inputValue').value;
    //rỗng và thừa dấu cách thì loại
    if (!listTasksElement || !listTasksElement.trim()) {
        alert('Mời nhập lại!');
        return;
    }
    for (let i = 0; i < todoList.length; i++) {
        if (listTasksElement === todoList[i].content) {
            alert('Đã có công việc trong danh sách, mời nhập lại!');
            document.getElementById('inputValue').value = '';
            return;
        }
    }
    const newTask = {content: listTasksElement, status: false};
    todoList.push(newTask);
    document.getElementById('inputValue').value = '';
    updateView();
}
document.getElementById('selectAll').onclick = function(event) {
    const isCheckAll = event.target.checked;
    for (let i = 0; i < todoList.length; i ++) {
        todoList[i].status = isCheckAll ? true : false;
    }
    updateView();
}
function createCheckbox(division, task) {
    let checkbox = document.createElement('input');
    //cập nhật giá trị của thuộc tính hiện có
    checkbox.setAttribute('type', 'checkbox');
    division.prepend(checkbox)
;
    if (task.status) {
        checkbox.setAttribute('checked', true);
        division.style.color = 'red';
        division.style.textDecoration = 'line-through';
    } else {
        division.style.color = 'black';
    }

    checkbox.addEventListener('change', function(e) {
        task.status = e.target.checked;
        if (!task.status) {
            document.getElementById('selectAll').checked = false;
            
        }
        const taskIndex = todoList.indexOf(task);
        //bắt đầu từ taskIndex ta bắt đầu thay đổi mảng, có 1 vị trí bị gỡ, được tính từ vị trí taskIndex
        todoList.splice(taskIndex, 1);
        if (task.status) {
            todoList.push(task);
        } else {
            todoList.unshift(task);
        }
        updateView();
    });
}

function createDelete(division, task) {
    let taskDelete = document.createElement('button');
    taskDelete.title = 'Xóa tác vụ';
    division.append(taskDelete);
    taskDelete.innerHTML = 'X';
    taskDelete.addEventListener('click', function(e) {
        const confirmation = confirm('Bạn có chắc chắn muốn xóa không?');
        if (!confirmation) return;
        const taskIndex = todoList.indexOf(task);
        todoList.splice(taskIndex, 1);     
        updateView();
    });
}

function createTop(division, task) {
    let taskTop = document.createElement('button');
    taskTop.title = 'Di chuyển tác vụ lên vị trí đầu';
    division.append(taskTop);
    taskTop.innerHTML = '︽';
    if (todoList.indexOf(task) === 0) {
        //vô hiệu hóa nút bấm
        taskTop.disabled = true;
    }
    taskTop.addEventListener('click', function(e) {
        const taskIndex = todoList.indexOf(task);
        todoList.splice(taskIndex, 1);
        todoList.unshift(task);
        updateView();
    });
}

function createBottom(division, task) {
    let taskBottom = document.createElement('button');
    taskBottom.title = 'Di chuyển tác vụ xuống vị trí cuối';
    division.append(taskBottom);
    taskBottom. innerHTML = '︾';
    if (todoList.indexOf(task) === todoList.length - 1) {
        taskBottom.disabled = true;
    }
    taskBottom.addEventListener('click', function(e) {
        const taskIndex = todoList.indexOf(task);
        todoList.splice(taskIndex, 1);
        todoList.push(task);
        updateView();
    });
}

function createUp(division, task) {
    let taskUp = document.createElement('button');
    taskUp.title = 'Di chuyển tác vụ lên trên một vị trí';
    division.append(taskUp);
    taskUp.innerHTML = '︿';
    if (todoList.indexOf(task) === 0) {
        taskUp.disabled = true;
    }
    taskUp.addEventListener('click', function(e) {
        const taskIndex = todoList.indexOf(task);
        //tạo biến trung gian để so sánh 2 phần tử - intermediateVariable
        let intermediateVariable = todoList[taskIndex];
        todoList[taskIndex] = todoList[taskIndex - 1];
        todoList[taskIndex - 1] = intermediateVariable;
        updateView();
    });
}

function createDown(division, task) {
    let taskDown = document.createElement('button');
    taskDown.title = 'Di chuyển tác vụ xuống dưới một vị trí';
    division.append(taskDown);
    taskDown.innerHTML = '﹀';
    if (todoList.indexOf(task) === todoList.length - 1) {
        taskDown.disabled = true;
    }
    taskDown.addEventListener('click', function(e) {
        const taskIndex = todoList.indexOf(task);
        let intermediateVariable = todoList[taskIndex];
        todoList[taskIndex] = todoList[taskIndex + 1];
        todoList[taskIndex + 1] = intermediateVariable;
        updateView();
    });
}

function totalTask() {
    currentTab = 'all';
    updateView();
}

function doneTask() {
    currentTab = 'done';
    updateView();
}

function notDoneTask() {
    currentTab = 'notDone';
    updateView();
}

function clearAll() {
    let confirmation = confirm('Bạn có muốn xóa tất cả không?');
    if (!confirmation) return;
    todoList.splice(0, todoList.length);
    updateView();
}
function searchElement() {
    hiddenItemIndex = [];
    let searchTask = document.getElementById('searchTask').value;
    if (searchTask === '') {
        hiddenItemIndex = [];
        updateView();
        return;
    }
    for (let i = 0; i < todoList.length; i++) {
        if (!todoList[i].content.toUpperCase().includes(searchTask.toUpperCase())) {
            hiddenItemIndex.push(i);
        }
    }
    updateView();
}