DROP DATABASE IF EXISTS employeecms_db;

CREATE DATABASE employeecms_db;

CREATE TABLE employees (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
id INT AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL,
department_id INT,
PRIMARY KEY (id)
);

CREATE TABLE departments (
id INT AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;