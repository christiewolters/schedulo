drop database if exists shift_scheduler_test;
create database shift_scheduler_test;
use shift_scheduler_test;

create table `schedule` (
	schedule_id int primary key auto_increment,
    start_date date not null,
    end_date date not null,
    finalized bit not null default 0
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
        references app_user(app_user_id)
);

create table shift(
	shift_id int primary key auto_increment,
    schedule_id int not null,
    employee_id int null,
    start_time datetime not null,
    end_time datetime not null,
    constraint fk_shift_employee_id
        foreign key (employee_id)
        references employee(employee_id),
	constraint fk_shift_schedule_id
		foreign key (schedule_id)
        references `schedule`(schedule_id)
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
    

delimiter //
create procedure set_known_good_state()
begin
    /* The error is not schedule, it's something to do with sql_safe_updates / set_known_good_state */
    delete from availability;
    alter table availability auto_increment = 1;
	delete from shift;
    alter table shift auto_increment = 1;
	delete from employee;
    alter table employee auto_increment = 1;
	delete from `schedule`;
    alter table `schedule` auto_increment = 1;

    delete from app_user_role;
    alter table app_user_role auto_increment = 1;
    delete from app_user;
    alter table app_user auto_increment = 1;


-- passwords are set to "P@ssw0rd!"
insert into app_user (app_user_id, username, password_hash, disabled)
    values
    (1, 'john@smith.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 0),
    (2, 'sally@jones.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 0),
    (3, 'jason@wells.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 0),
    (4, 'christina@mckenzy.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 0);
    

insert into employee(employee_id, first_name, last_name, app_user_id) values
	(1, 'John', 'Smith', 1),
	(2, 'Sally', 'Jones', 2),
    (3, 'Jason', 'Wells', 3),
    (4, 'Christina', 'McKenzy', 4);

insert into app_user_role(app_user_id, app_role_id) values
    (1, 2),
    (2, 1),
	(3, 1),
    (4, 2);
    
insert into `schedule`(schedule_id, start_date, end_date, finalized) values
(1, '2022-06-05 00:00', '2022-06-11 23:59', 1),
(2, '2022-06-12 00:00', '2022-06-18 23:59', 0);
    
insert into shift(shift_id, schedule_id, employee_id, start_time, end_time) values
(1, 1, 1, '2022-06-05 08:00', '2022-06-05 12:00'),
(2, 1, 2, '2022-06-05 12:00', '2022-06-05 04:00'),
(3, 1, 4, '2022-06-05 10:00', '2022-06-05 04:00'),
(4, 2, 3, '2022-06-05 04:00', '2022-06-05 08:00'),
(5, 2, null, '2022-06-05 04:00', '2022-06-05 10:00'),
(6, 2, null, '2022-06-13 12:00', '2022-06-13 08:00'),
(7, 1, 1, '2022-06-06 09:00', '2022-06-06 12:00'),
(8, 1, 1, '2022-06-07 10:00', '2022-06-07 12:30'),
(9, 2, 1, '2022-06-14 8:30', '2022-06-14 12:00');

insert into availability(availability_id, start_time, end_time, employee_id) values
(1, '2022-06-05 00:00', '2022-06-11 23:59', 1),
(2, '2022-06-05 010:00', '2022-06-05 2:00', 2),
(3, '2022-06-06 03:00', '2022-06-06 10:00', 2),
(4, '2022-06-07 00:00', '2022-06-11 23:59', 2),
(5, '2022-06-05 00:00', '2022-06-11 23:59', 3),
(6, '2022-06-05 00:00', '2022-06-11 23:59', 4),
(7, '2022-06-12 00:00', '2022-06-18 23:59', 1),
(8, '2022-06-12 00:00', '2022-06-18 23:59', 2),
(9, '2022-06-12 00:00', '2022-06-18 23:59', 3),
(10, '2022-06-05 00:00', '2022-06-11 23:59', 4);

end //

delimiter ;

set sql_safe_updates = 0;
call set_known_good_state();
set sql_safe_updates = 1;

select * from app_user;