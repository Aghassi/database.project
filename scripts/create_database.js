var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE SCHEMA IF NOT EXISTS ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
  `user_id` INT NOT NULL AUTO_INCREMENT, \
  `name` NVARCHAR(20) NULL, \
  `title` NVARCHAR(20) NULL, \
  `dept` NVARCHAR(20) NULL, \
  `username` NVARCHAR(45) NULL, \
  `password` NVARCHAR(20) NULL, \
  PRIMARY KEY (`user_id`), \
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.managers_table + '` ( \
  `dept` NVARCHAR(20) NOT NULL, \
  `user_id` INT NOT NULL, \
  PRIMARY KEY (`user_id`), \
  CONSTRAINT `user_id` \
    FOREIGN KEY (`user_id`) \
    REFERENCES `eecs341`.`users` (`user_id`) \
    ON DELETE CASCADE \
    ON UPDATE CASCADE \
)');

console.log('Success: Database Created!')

connection.end();
