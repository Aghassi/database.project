-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema eecs341
-- -----------------------------------------------------
-- DB for EECS 341 project fall 2016

-- -----------------------------------------------------
-- Schema eecs341
--
-- DB for EECS 341 project fall 2016
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `eecs341` DEFAULT CHARACTER SET utf8 ;
USE `eecs341` ;

-- -----------------------------------------------------
-- Table `eecs341`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eecs341`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` NVARCHAR(20) NULL,
  `title` NVARCHAR(20) NULL,
  `dept` NVARCHAR(20) NULL,
  `username` NVARCHAR(45) NULL,
  `password` NVARCHAR(20) NULL COMMENT 'Contains the users for the login and calendar',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eecs341`.`managers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eecs341`.`managers` (
  `dept` NVARCHAR(20) NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `eecs341`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eecs341`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eecs341`.`events` (
  `event_id` INT NOT NULL AUTO_INCREMENT,
  `creator` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `description` NVARCHAR(100) NULL,
  `created_date` DATETIME NOT NULL,
  PRIMARY KEY (`event_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eecs341`.`manages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eecs341`.`manages` (
  `manager_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`manager_id`),
  CONSTRAINT `manager_id`
    FOREIGN KEY (`manager_id`)
    REFERENCES `eecs341`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eecs341`.`schedules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eecs341`.`schedules` (
  `event_id` INT NOT NULL,
  `employee_id` INT NULL,
  PRIMARY KEY (`event_id`),
  INDEX `user_id_idx` (`employee_id` ASC),
  CONSTRAINT `employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `eecs341`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eecs341`.`invites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eecs341`.`invites` (
  `event_id` INT NOT NULL COMMENT '	',
  `employee` INT NULL,
  `status` CHAR(1) NULL,
  PRIMARY KEY (`event_id`),
  INDEX `user_id_idx` (`employee` ASC),
  CONSTRAINT `employee`
    FOREIGN KEY (`employee`)
    REFERENCES `eecs341`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
