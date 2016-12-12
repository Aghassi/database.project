/**
 * Created by hunj on 12/11/2016
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');
var moment = require('moment');

var connection = mysql.createConnection(dbconfig.connection);

// Add Users:
//   Bebek (bebek/bebek, Professor of EECS)
//   Hun Jae (hunj/hunj, Student of EECS)
//   David (aghassi/aghassi, Student of EECS)
//   Ryan (ryan/ryan, Student of EECS)
//
// User Bebek manages EECS
// User Bebek manages hunj, aghassi, and ryan.
//
// User Bebek schedules Event "Final Exam" at 2016-9-20 12:45:00
//   Starts at 2016-12-20 08:00:00 and ends at 2016-12-20 11:00:00
//   then invites hunj, aghassi, and ryan.

connection.query('\
INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.users_table + '`\
          (`user_id`, `name`, `title`, `dept`, `username`, `password`) \
  VALUES  (1      , "Bebek", "Professor", "EECS", "bebek", PASSWORD("bebek"))\
');

connection.query('\
INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.users_table + '`\
          (`user_id`, `name`, `title`, `dept`, `username`, `password`)\
  VALUES  (2      , "Hun Jae", "Student", "EECS", "hunj", PASSWORD("hunj"))\
');

connection.query('\
INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.users_table + '`\
          (user_id, name, title, dept, username, password)\
  VALUES  (3      , "David", "Student", "EECS", "aghassi", PASSWORD("aghassi"))\
');

connection.query('\
INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.users_table + '`\
          (user_id, name, title, dept, username, password)\
  VALUES  (4      , "Ryan", "Student", "EECS", "ryan", "ryan")\
');

// add event Final exam
connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.events_table + '`\
          (event_id, event_creator, event_owner, start_time, end_time, title, description, created_date)\
  VALUES  (1, 1, 1, "2016-12-20 08:00:00", "2016-12-20 11:00:00", \
          "Final Exam", "Final Exam for EECS341", "2016-9-13 12:45:00")');

connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.manages_table + '`\
          (manager_id, user_id)\
  VALUES (1, 2)\
)');
connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.manages_table + '`\
          (manager_id, user_id)\
  VALUES (1, 3)\
)');
connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.manages_table + '`\
          (manager_id, user_id)\
  VALUES (1, 4)\
)');

connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.schedules_table + '`\
          (event_id, employee_id)\
  VALUES (1, 1)\
)');

connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.invites_table + '`\
          (event_id, employee, status)\
  VALUES (1, 2, 0)\
)');
connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.invites_table + '`\
          (event_id, employee, status)\
  VALUES (1, 3, 0)\
)');
connection.query('\
  INSERT INTO `' + dbconfig.database + '`.`' + dbconfig.invites_table + '`\
          (event_id, employee, status)\
  VALUES (1, 4, 0)\
)');



console.log('Success: Database Populated!')

connection.end();
