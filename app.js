const mysql = require('mysql');
const inquirer = require('inquirer');
const roleChoices = [];

//CONNECTING TO THE DATABASE
const connection = mysql.createConnection({
  host:'localhost',
  port:3306,
  user:'root',
  password:'Dmso0929',
  database:'employeecms_db',
});
//CONFIRMS IF CONNECTION WAS SUCCESSFUL OR NOT
connection.connect((err) => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  init();
});

//INQUIRER PROMPT TO GENERATE QUESTIONS IN THE CLI
function init() {
  inquirer.prompt([{
    type:'list',
    name:'start',
    message: 'What would you like to do?',
    choices: [
      'View Employees',
      'View Roles',
      'View Departments',
      'Add Employee',
      'Add Role',
      'Add Department',
      'Update Employee Role',
      'Exit'
    ]
  }]).then((data) => {
    //THIS CALLS THE CORRESPONDING METHOD TO THE A SELECTED CHOICE
    switch (data.start) {
      case 'Add Employee':
        addEmployee();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'View Employees':
        viewEmployees();
        break;
      case 'View Roles':
        viewRoles();
        break;
      case 'View Departments':
        viewDepartments();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
    }
  })
}

// THIS DISPLAYS A TABLE OF ALL EMPLOYEES TO THE CONSOLE
function viewEmployees() {
  console.log('Showing All Employees...\n');
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}
// THIS DISPLAYS A TABLE OF ALL ROLES TO THE CONSOLE
function viewRoles() {
  console.log('Showing All Roles...\n');
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    console.table(res);

  });
}
// THIS DISPLAYS A TABLE OF ALL DEPARTMENTS TO THE CONSOLE
function viewDepartments() {
  console.log('Showing All Departments...\n');
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}


// THIS PROMPTS THE USER FOR INFORMATION TO ADD A NEW ROLE TO THE TABLE
function addRole() {
  console.log('You chose to add a new role!');
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type:'input',
        name:'role_title',
        message:'What is the name of this new role?'
      },
      {
        type:'input',
        name:'role_salary',
        message:'What is the average salary of this new role?'
      },
      {
        type:'rawlist',
        name:'role_department',
        choices:function(value) {
          let choiceArr = [];
          console.log(res);
          for (var i = 0; i < res.length; i++) {
            choiceArr.push({name:res[i].name,value:res[i].id});
          }
          return choiceArr;
        },
        message: 'What department does this role belong too?'
      }
    ]).then((res) => {
      connection.query("INSERT INTO roles SET ?", {
          title: res.role_title,
          salary: res.role_salary,
          department_id: res.role_department
      }, (err, res) => {
          if (err) throw err;
          console.log("New Role Added To Database!");
          init();
        });
    });
  })
}



