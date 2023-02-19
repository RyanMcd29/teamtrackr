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

// async function getManagers () {
async function getManagers() {
    const managerData = await db.promise().query(
        "SELECT CONCAT(first_name, ' ' , last_name) AS name, id FROM employee where manager_id is NULL;"
    );

    const managers = managerData[0].map(manager => {
        container = {
            name: manager.name,
            value: {
                id: manager.id
            }
        }
        return container;
    })

    return managers
}

    // const managers = await db.query('SELECT first_name, last_name, id FROM employee where manager_id is NULL;', function(err, results) {
    //     if (err) {
    //         throw err
    //     }
    //     console.log(managers)
    //     return managers
    
    // });

// }

async function getRoles(){
    const rollData = await db.promise().query(
        "SELECT title AS name, id FROM role"
    );

    const rolls = rollData[0].map(roll => {
        container = {
            name: roll.name,
            value: {
                id: roll.id
            }
        }
        return container;
    })

    return rolls
}

async function getDepartments() {
    const departmentData = await db.promise().query(
        "SELECT name, id FROM department"
    );

    const departments = departmentData[0].map(department => {
        container = {
            name: department.name,
            value: {
                id: department.id
            }
        }
        return container;
    })

    return departments
}

function viewAllEmployees() {
        db.execute('SELECT first_name, last_name, title, salary, name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;', function (err, results) {
            console.table(cTable.getTable(results))
        });
}


async function addEmployee () {
    const rolls = await getRoles()
    const managers = await getManagers()
    // const managers = managersData[0].map(manager)
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
                choices: rolls
            },
            {
                type: 'list',
                message: "Who is this employee's manager?",
                name: "manager",
                choices: managers
            },
        ])
        .then((inputs) => {
            console.log(inputs)
            
            const { firstName, lastName, role, manager } = inputs

            console.log(role.id)
            db.query(`
            INSERT INTO employee(first_name, last_name, role_id, manager_id)
            VALUES
            (${firstName},  ${lastName}, ${role.id}, ${manager.id})
            `, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                    console.log(`Added new employee`)
                }
                ;
            })

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

function updateDepartment() {
    getDepartments() 
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please choose the department you would like to edit',
                name: 'departmentChoice',
                choices: ['test']
            }
        ])
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
            // selectOption()

        })
}

selectOption()

