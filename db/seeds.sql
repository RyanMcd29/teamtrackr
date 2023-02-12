INSERT INTO department (name)
VALUES 
    ("Marketing"),
    ("Development");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Assistant", 40000, 1),
    ("Manager", 60000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Smith", 1,1),
    ("Jane", "Butcher", 2, 1);


