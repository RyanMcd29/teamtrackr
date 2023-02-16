const mysql = require ('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Bootcamp',
        database: 'employee_db'
    },
    console.log('Connected to employee_db')
);

const getManagers = async () => {
    let managers = await db.query('SELECT first_name, last_name, id FROM employee where manager_id is NULL;')
    console.log(managers)
}

function getRoles(){
    db.execute('SELECT title, id FROM role', function (err, results) {

    })
}

function getDepartments() {
    db.execute('SELECT name, id FROM department', function (err,results){

    })
}

function viewAllEmployees() {
        db.execute('SELECT first_name, last_name, title, salary, name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;', function (err, results) {
            console.table(cTable.getTable(results))
        });
}


function addEmployee () {
    // getManagers()
    
    inquirer 
        .prompt([
            {
                type: 'input',
                message: "What is this employee's first name?",
                name: "firstName"
            },
            {
                type: 'input',
                message: "What is this employee's last name?",
                name: "lastName"
            },
            {
                type: 'list',
                message: "What is this employee's role?",
                name: "role",
                choices: ['test']
            },
            {
                type: 'list',
                message: "Who is this employee's manager?",
                name: "manager",
                choices: []
            },
        ])
        .then((inputs) => {
            const { firstName, lastName, role, manager } = inputs
            db.query(`
            INSERT INTO employee(first_name, last_name, role_id, manager_id
            VALUES
            ${firstName},  ${lastName}, ${role}, ${manager})
            `)
        } );
    
}

function updateEmployee() {
    let employeeNames = db.execute('SELECT id, first_name, last_name FROM employee', function (err, results) {results});
    console.log(employeeNames)
    inquirer   
        .prompt([

        ])
}

function viewAllRoles() {
    db.execute('SELECT title, salary, name AS department_name FROM role JOIN department ON role.department_id = department.id;', function (err, results) { 
        console.table(cTable.getTable(results)) 
    })
}

function addRole() {

}

function viewAllDepartments(){}
    db.execute('SELECT name FROM department', function (err, results) { console.table(cTable.getTable(results)) })

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'name'
            }
        ])
        .then((input) => 
        {
            const { name } = input;
            db.query(`
            INSERT INTO department(name)
                VALUES
                    (${name})
            `)    
        })
}

function selectOption() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do next?',
                name: 'menuOption',
                choices: [  'View All Employees', 'Add Employee', 'Update Employee Role',
                            'View All Roles', 'Add Role', 'View All Departments', 'Add Department',
                            'Quit'  ]
            }
        ])
        .then((answer) => {
            switch (answer.menuOption){
                case 'View All Employees':
                    viewAllEmployees()
                break;
                case 'Add Employee':
                    addEmployee()
                break;
                case 'Update Employee Role':
                    updateEmployee()
                break;
                case 'View All Roles':
                    viewAllRoles()
                break;
                case 'Add Role':
                    addRole()
                break;
                case 'View Department':
                    viewAllDepartments()
                break;
                case 'Add Department':
                    addDepartment()
                break;
                case 'Quit':
                    process.exit()
            }
        })
}

selectOption()

