const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

//CONNECTING TO THE DATABASE
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Dmso0929',
  database: 'playlist_db',
});



