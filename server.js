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

function viewAllEmployees(){
    
    db.execute('SELECT * FROM employee', function (err, results) { console.table(cTable.getTable(results)) })
}

function addEmployee (){
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
                choices: ['test']
            },
        ])
        .then((inputs) => 
        {   const { firstName, lastName, role, manager } = inputs
            db.query(`
            INSERT INTO employee(first_name, last_name, role_id, manager_id
            VALUES
                (${firstName}, ${lastName}, ${role}, ${manager})`
            )
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
    db.execute('SELECT * FROM role', function (err, results) { console.table(cTable.getTable(results)) })
}

function addRole() {}

function viewAllDepartments(){}
    db.execute('SELECT * FROM department', function (err, results) { console.table(cTable.getTable(results)) })
function addDepartment() {}

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
                    
                break;
                case 'View Department':
                    viewAllDepartments()
                break;
                case 'Add Department':

                break;
                case 'Quit':

                break;
            }
        })
}

selectOption()

