/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

/** Tables **/

// Users
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
  `user_id` INT NOT NULL AUTO_INCREMENT, \
  `name` NVARCHAR(20) NULL, \
  `title` NVARCHAR(20) NULL, \
  `dept` NVARCHAR(20) NULL, \
  `username` NVARCHAR(45) NULL, \
  `password` NVARCHAR(20) NULL, \
  PRIMARY KEY (`user_id`), \
  UNIQUE INDEX `username_UNIQUE` (`username` ASC)) \
)');

// Managers
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.managers_table + '` ( \
  `dept` NVARCHAR(20) NOT NULL, \
  `user_id` INT NOT NULL, \
  PRIMARY KEY (`user_id`), \
  CONSTRAINT `user_id` \
    FOREIGN KEY (`user_id`) \
    REFERENCES `eecs341`.`users` (`user_id`) \
    ON DELETE CASCADE \
    ON UPDATE CASCADE) \
)');

// Events
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.events_table + '` ( \
  `event_id` INT NOT NULL AUTO_INCREMENT, \
  `creator` INT NOT NULL, \
  `start_time` DATETIME NOT NULL, \
  `end_time` DATETIME NOT NULL, \
  `description` NVARCHAR(100) NULL, \
  `created_date` DATETIME NOT NULL, \
  PRIMARY KEY (`event_id`)) \
)');

// Manages
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.manages_table + '` ( \
  `manager_id` INT NOT NULL, \
  `user_id` INT NOT NULL, \
  PRIMARY KEY (`manager_id`), \
  CONSTRAINT `manager_id` \
    FOREIGN KEY (`manager_id`) \
    REFERENCES `eecs341`.`users` (`user_id`) \
    ON DELETE CASCADE \
    ON UPDATE CASCADE) \
)');

console.log('Success: Database Created!')

connection.end();
