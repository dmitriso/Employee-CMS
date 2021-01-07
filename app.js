const mysql = require('mysql');
const inquirer = require('inquirer');

//CONNECTING TO THE DATABASE
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Dmso0929',
  database: 'playlist_db',
});
//CONFIRMS IF CONNECTION WAS SUCCESSFUL OR NOT
connection.connect((err) => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  connection.end();
});

init();
//INQUIRER PROMPT TO GENERATE QUESTIONS IN THE CLI
function init() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'start',
      message: 'What would you like to do?',
      choices: ['View Employees', 'View Roles', 'View Department', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role','Exit']
    }
  ]).then((data) => {
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
      viewroles();
        break;
      case 'View Department':
        viewDepartment();
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

