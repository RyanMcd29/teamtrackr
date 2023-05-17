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

async function getEmployees() {
    const employeeData = await db.promise().query(
        "SELECT CONCAT(first_name, ' ' , last_name) AS name, id, manager_id, role_id FROM employee;"
    );

    const employees = employeeData[0].map(employee => {
        container = {
            name: employee.name,
            value: {
                id: employee.id,
                managerID: employee.manager_id,
                role: employee.role_id,
            }
        }
        return container;
    })

    return employees
}

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

async function getRoles(){
    const roleData = await db.promise().query(
        "SELECT title AS name, id FROM role"
    );

    const roles = roleData[0].map(role => {
        container = {
            name: role.name,
            value: {
                id: role.id
            }
        }
        return container;
    })

    return roles
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
    db.execute('SELECT first_name, last_name, manager_id, title, salary, name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;', function (err, results) {
        console.table(cTable.getTable(results))
        selectOption();
    })
}

async function employeeByManager () {
    const managers = await getManagers()
    
    inquirer   
            .prompt([
                {
                    type:  'list',
                    message: 'Which manager would you like to view?',
                    name: 'manager',
                    choices: managers
                },
            ])
                .then((inputs) => {
                    // uses var to pass update if no manager
                    const {  manager } = inputs 

                    db.execute(`SELECT * FROM employee WHERE manager_id = ${manager.id};`, 
                    function (err, results) { 

                        if (!results) {
                            console.log('No employees belong to this manager')
                        }
                        
                        console.table(cTable.getTable(results))
                        selectOption()
                    })
                    
                })
}


function getIdsForManagerPositions (roles) {
    const managerRoles = roles.filter(role => {
        if (role.name == 'Manager'){
            return role.value.id
        }
    })

    const managerIDs = managerRoles.map((manager)=>{
        return manager.value.id
    })

    return managerIDs
}

async function addEmployee () {
    const roles = await getRoles()
    const managers = await getManagers()
    const managerIDs = getIdsForManagerPositions(roles)

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
                choices: roles
            },
            {
                type: 'list',
                message: "Who is this employee's manager?",
                name: "manager",
                choices: managers,
                when: (answers) => !managerIDs.includes(answers.role.id)
            },
        ])
        .then((inputs) => {
            // uses var to pass update if no manager
            var { firstName, lastName, role, manager } = inputs 
            
            if (manager) {
                manager = manager.id
            } else {
                manager = null
            }

            db.query(`
            INSERT INTO employee(first_name, last_name, role_id, manager_id)
            VALUES
            ("${firstName}",  "${lastName}", ${role.id}, ${manager});`, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                    console.log(`Added new employee`)
                    selectOption();
                }
            })

        } )
}

async function updateEmployee() {
    const employees = await getEmployees()
    const roles = await getRoles()
    const managers = await getManagers()
    const managerIDs = getIdsForManagerPositions(roles)    
    
    inquirer   
        .prompt([
            {
                type:  'list',
                message: 'Which employee would you like to update?',
                name: 'employee',
                choices: employees
            },
            {
                type: 'list',
                message: "What is this employee's role?",
                name: "role",
                choices: roles
            },
            {
                type: 'list',
                message: "Who is this employee's manager?",
                name: "manager",
                choices: managers,
                when: (answers) => !managerIDs.includes(answers.role.id)
            },
        ])
            .then((inputs) => {
                // uses var to pass update if no manager
                var { employee, role, manager } = inputs 
                
                if (manager) {
                    manager = manager.id
                } else {
                    manager = null
                }



                db.query(`UPDATE employee SET role_id = ${role.id}, manager_id = ${manager} WHERE id = ${employee.id};`)
                console.log(`Updated employee`)
                selectOption();
            })
    }

function viewAllRoles() {
        db.execute('SELECT title, salary, name AS department FROM role JOIN department ON role.department_id = department.id;', function (err, results) { 
            console.table(cTable.getTable(results))
            selectOption() 
        })

    }

async function addRole() {
    const departments = await getDepartments()
    inquirer 
    .prompt([
        {
            type: 'input',
            message: "What is this role's title?",
            name: "title"
        },
        {
            type: 'input',
            message: "What is this role's salary?",
            name: "salary"
        },
        {
            type: 'list',
            message: "What department does this role belong to?",
            name: "department",
            choices: departments
        }
    ]).then((inputs) => {
        const { title, salary, department } = inputs;
        db.query(
            `INSERT INTO role (title, salary, department_id)
            VALUES
            ("${title}", "${salary}", ${department.id});`, (err, results) => {
            
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Added new role ${title}`)
                    selectOption()
                }
            }
        )
    }

    )
    }
   

function viewAllDepartments(){
    db.execute('SELECT * FROM department;', function (err, results) { 
        console.table(cTable.getTable(results))
        selectOption() 
    })
   
}
    
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
                ("${name}")`, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Added new department ${name}`)
                        selectOption()
                    }
            })    
        })
}

function updateDepartment() {
    const departments = getDepartments() 
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please choose the department you would like to edit',
                name: 'departmentChoice',
                choices: departments
            }
        ])
        .then (
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'What is the new name of this department?',
                        name: 'name'
                    }
                ])
                .then((input) => 
                {
                    const { name } = input;
                    db.query(`
                    UPDATE department SET name = ${name} WHERE id = ${department.id};`)    
                })
        )
}

async function ViewUtilisedBudgetOfDeparment () {
    const departments = await getDepartments();
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please select the department you would like to view the budget for',
                name: 'departmentChoice',
                choices: departments
            }
        ])
        .then((input) => 
        {
           const id = input.departmentChoice.id

            db.query(
                ` SELECT SUM(salary) AS utilised_budget FROM role WHERE department_id = ${id}`, 
                function (err, results) { 
                        if (err) {
                            console.log(err)
                        }
                        console.table(cTable.getTable(results)) 
                        selectOption()
                }
            )

            
        })
}

function selectOption() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do next?',
                name: 'menuOption',
                choices: [  'View All Employees',
                            'Show Employees by Manager',
                            'Add Employee', 
                            'Update Employee Role',
                            'View All Roles', 
                            'Add Role', 
                            'View All Departments', 
                            'Add Department',
                            'View Utilised Budget of Department',
                            'Quit'  ]
            }
        ])
        .then(async (answer) => {
            switch (answer.menuOption){
                case 'View All Employees':
                    await viewAllEmployees()
                break;
                case 'Add Employee':
                    addEmployee()
                break;
                case 'Update Employee Role':
                    updateEmployee()
                break;
                case 'Show Employees by Manager':
                    employeeByManager()
                break;
                case 'View All Roles':
                    viewAllRoles()
                break;
                case 'Add Role':
                    addRole()
                break;
                case 'View All Departments':
                    viewAllDepartments()
                break;
                case 'Add Department':
                    addDepartment()
                break;
                case 'Update Department':
                    updateDepartment()
                case 'View Utilised Budget of Department':
                    ViewUtilisedBudgetOfDeparment()
                break;
                case 'Quit':
                    process.exit()
            }
            

        })
}

selectOption()

