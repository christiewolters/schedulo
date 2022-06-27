drop database if exists shift_scheduler;
create database shift_scheduler;
use shift_scheduler;

create table `schedule`(
	schedule_id int primary key auto_increment,
    start_date date not null,
    end_date date not null
);

create table app_user (
    app_user_id int primary key auto_increment,
    username varchar(50) not null unique,
    password_hash varchar(2048) not null,
    disabled bit not null default(0)
);

create table app_role (
    app_role_id int primary key auto_increment,
    `name` varchar(50) not null unique
);

create table app_user_role (
    app_user_id int not null,
    app_role_id int not null,
    constraint pk_app_user_role
        primary key (app_user_id, app_role_id),
    constraint fk_app_user_role_user_id
        foreign key (app_user_id)
        references app_user(app_user_id),
    constraint fk_app_user_role_role_id
        foreign key (app_role_id)
        references app_role(app_role_id)
);

create table employee(
	employee_id int primary key auto_increment,
    first_name varchar(25) not null,
    last_name varchar(25) not null,
    app_user_id int not null,
    constraint fk_employee_app_user_id
        foreign key (app_user_id)
        references app_user_role(app_user_id)
);

create table shift(
	shift_id int primary key auto_increment,
    employee_id int not null,
    start_time datetime not null,
    end_time datetime not null,
    constraint fk_shift_employee_id
        foreign key (employee_id)
        references employee(employee_id)
);

create table availability(
	availability_id int primary key auto_increment,
    start_time datetime not null,
    end_time datetime not null,
    employee_id int not null,
    constraint fk_availability_employee_id
        foreign key (employee_id)
        references employee(employee_id)
);

insert into app_role (`name`) values 
	('EMPLOYEE'),
    ('MANAGER');




