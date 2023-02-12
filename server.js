const mysql = require ('mysql2')
const inquirer = require('inquirer')
const consoleTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Bootcamp',
        database: 'employee_db'
    },
    console.log('Connected to employee_db')
);

function selectOption() {
    inquirer
        .prompt[
            {
                type: 'list',
                message: 'What would you like to do next?',
                name: 'menuOption',
                choices: [  'View All Employees', 'Add Employee', 'Update Employee Role',
                            'View All Roles', 'Add Role', 'View Department', 'Add Department',
                            'Quit'  ]
            }
        ]
        .then((answer) => {
            switch (answer.menuOption){
                case 'View All Employees':
                
                break;
                case 'Add Employee':

                break;
                case 'Update Employee Role':

                break;
                case 'View All Roles':

                break;
                case 'Add Role':

                break;
                case 'View Department':

                break;
                case 'Add Department':

                break;
                case 'Quit':

                break;
            }
        }
        )
}

