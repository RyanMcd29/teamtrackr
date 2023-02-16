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

function getManagers () {
    const managers = db.query('SELECT first_name, last_name, id FROM employee where manager_id is NULL;', function(err, results) {
        if (err) {
            throw err
        }
        console.log(results)
        const { firstName, lastName, id} = results;
    
    });
    
    return
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


async function addEmployee () {
    // const managers = await getManagers()
    // console.log(managers)
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
        .then((inputs) => {
            const { firstName, lastName, role, manager } = inputs
            db.query(`
            INSERT INTO employee(first_name, last_name, role_id, manager_id
            VALUES
            (${firstName},  ${lastName}, ${role}, ${manager})
            `)
        } );
    
}

function updateEmployee() {
    let employeeNames = db.execute('SELECT id, first_name, last_name FROM employee', function (err, results) {results});
    console.log(employeeNames)
    inquirer   
        .prompt([

        ]).then
    }

function viewAllRoles() {
    db.execute('SELECT title, salary, name AS department_name FROM role JOIN department ON role.department_id = department.id;', function (err, results) { 
        console.table(cTable.getTable(results)) 
    })
}

function addRole() {
    inquirer 
    .prompt([
        {
            type: 'input',
            message: "What is this employee's first name?",
            name: "title"
        },
        {
            type: 'input',
            message: "What is this employee's last name?",
            name: "salary"
        },
        {
            type: 'input',
            message: "What department does this role belong to?",
            name: "department"
        }
    ]).then((inputs) => {
        const { title, salary, department } = inputs;
        db.query(
            `INSERT INTO role (title, salary, department_id)
            VALUES
            (${title}, ${salary}, ${department})`
        )
    }

    )
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
                break;
            }
        })
}

selectOption()

