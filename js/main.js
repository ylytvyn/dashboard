'use strict';

class Preloader {
    constructor() {
        this.content = document.querySelector('.content');
    }

    show() {
        this.content.classList.add('loading');
    }

    hide() {
        this.content.classList.remove('loading');
    }
}

class Employee {
    constructor(
        firstName,
        lastName,
        role,
        phone
        ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.phone = phone;
        this.id = `${lastName.toLowerCase()}-${(Math.random()*100000).toFixed()}`;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

class Window {
    constructor(employee) {
        this.employee = employee;
        this.window = document.querySelector('.window-overlay');

        this.roles = ['Admin', 'Writer', 'Musician', 'Actor', 'Engineer', 'Doctor'];

        this.addRoles();
    }

    addRoles() {
        roleDropdown.innerHTML = '';
        
        this.roles.forEach(role => {
            roleDropdown.innerHTML += `<option value="${role}">${role}</option>`;
        });
    }

    show() {
        if (this.employee) {
            firstName.value = this.employee.firstName;
            lastName.value = this.employee.lastName;
            phone.value = this.employee.phone;
            roleDropdown.value = this.employee.role;
            this.window.dataset.id = this.employee.id;
        }
        
        this.window.classList.add('show');
    }

    hide() {
        firstName.value = '';
        lastName.value = '';
        phone.value = '';
        roleDropdown.value = roleDropdown[0].value;
        this.window.dataset.id = '';

        this.window.classList.remove('show');
    }

    save() {
        if (firstName.value === '' ||
            lastName.value === '' ||
            phone.value === '') {
                showWarning('Please, fill all fields');
                return;
        }

        let item = localStorage.getItem('employeeList'),
            list = item ? JSON.parse(item) : [],
            employee = new Employee(firstName.value, lastName.value, roleDropdown.value, phone.value);

        employee.id = this.window.dataset.id || employee.id;

        let i = list.findIndex(elem => elem.id === employee.id);

        if (i !== -1) {
            list[i] = employee;
        } else {
            list.push(employee);
        }

        localStorage.setItem('employeeList', JSON.stringify(list));

        this.hide();
        showEmployees();
    }
}

class Draw {
    constructor() {}

    render(employee, counter) {
        let item = document.createElement('li'),
            number = document.createElement('div'),
            name = document.createElement('div'),
            role = document.createElement('div'),
            phone = document.createElement('div'),
            actions = document.querySelector('.list__actions').cloneNode(true);

        // Add Classes
        item.className = 'list__item';
        number.className = 'list__number';
        name.className = 'list__name';
        role.className = 'list__role';
        phone.className = 'list__phone';

        // Add Text
        number.innerText = counter;
        name.innerText = `${employee.firstName} ${employee.lastName}`;
        role.innerText = employee.role;
        phone.innerText = employee.phone;

        // Event
        actions.querySelector('.edit').addEventListener('click', () => {
            this.edit(employee);
        });

        actions.querySelector('.delete').addEventListener('click', () => {
            this.delete(employee);
        });

        // Append all items
        item.append(number, name, role, phone, actions);

        return item;
    }

    edit(employee) {
        let windowEdit = new Window(employee);
        windowEdit.show();
    }

    delete(employee) {
        let confirmation = window.confirm(`Are you sure that you want to delete ${employee.firstName} ${employee.lastName}`);

        if (confirmation) {
            let list = JSON.parse(localStorage.getItem('employeeList'));

            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].id === employee.id) {
                    list.splice(i, 1);
                    break;
                }
            }
    
            localStorage.setItem('employeeList', JSON.stringify(list));
            showEmployees();
        }
    }
}

let employeeWindow = new Window();
addEmployee.addEventListener('click', () => {
    employeeWindow.show();
});

let closeBtn = document.querySelector('.close-btn');
closeBtn.addEventListener('click', () => {
    employeeWindow.hide();
});

let saveBtn = document.querySelector('.save');
saveBtn.addEventListener('click', () => {
    employeeWindow.save();
});

let showEmployeesBtn = document.getElementById('showEmployee');
showEmployeesBtn.addEventListener('click', showEmployees);

// Show Employees List
function showEmployees() {
    let employeeList = JSON.parse(localStorage.getItem('employeeList')),
        list = document.querySelector('.list'),
        listItems = document.querySelectorAll('.list__item');

    if (employeeList === null) {
        showWarning('Add Employee first!');
        return;
    }

    listItems.forEach(item => {
        item.remove();
    });

    let preloader = new Preloader();
    preloader.show();

    employeeList.forEach((item, i) => {
        list.append(new Draw().render(item, i + 1));
    });

    setTimeout(() => {
        preloader.hide();
    }, 500);
    
}

// Warning
function showWarning(msg) {
    let dialog = document.createElement('div'),
        dialogOverlay = document.createElement('div');

    dialogOverlay.className = 'dialog-overlay';
    dialog.className = 'dialog';

    dialog.innerHTML = `<p>${msg}</p>`;

    document.body.append(dialogOverlay, dialog);

    setTimeout(() => {
        dialogOverlay.remove();
        dialog.remove();
    }, 3000);
}