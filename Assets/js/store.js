const inquirer = require('inquirer')

class Store {
    viewAll () {
        return 
    };
    addEmployee () {
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
                name: "role"
            },
            {
                type: 'input',
                message: "Who is this employee's manager?",
                name: "manager"
            },
        ])
        .then((inputs => {return inputs} ))
    };
    updateEmployee() {};
    viewAllRoles() {};
    addRole() {};
    viewDepartment() {};
    addDepartment() {};
}

module.exports = new Store()