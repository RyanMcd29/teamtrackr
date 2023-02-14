const connection = require("./connection")

class Store {
    constructor(connection) {
        this.connection = connection;
    }

    // find all employees
    viewAllEmployees() {
        return this.connection.promise().query(' some sql ')
    }

    addDepartment(department) {
        return this.connection.promise().query('INSERT INTO department SET ?', department)
    }
}

module.exports = new Store(connection)

// addEmployee () {
//     inquirer
//     .prompt([
//         {
//             type: 'input',
//             message: "What is this employee's first name?",
//             name: "firstName"
//         },
//         {
//             type: 'input',
//             message: "What is this employee's last name?",
//             name: "lastName"
//         },
//         {
//             type: 'list',
//             message: "What is this employee's role?",
//             name: "role"
//         },
//         {
//             type: 'input',
//             message: "Who is this employee's manager?",
//             name: "manager"
//         },
//     ])
//     .then((inputs => {return inputs} ))
// };
// updateEmployee() {};
// viewAllRoles() {};
// addRole() {};
// viewDepartment() {};
// addDepartment() {};