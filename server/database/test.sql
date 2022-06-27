drop database if exists shift_scheduler_test;
create database shift_scheduler_test;
use shift_scheduler_test;

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


delimiter //
create procedure set_known_good_state()
begin

	delete from `schedule`;
    alter table `schedule` auto_increment = 1;
    delete from shift;
    alter table shift auto_increment = 1;
    delete from employee;
    alter table employee auto_increment = 1;
    delete from availability;
    alter table availability auto_increment = 1;
    
    
    insert into app_role (`name`) values 
	('EMPLOYEE'),
    ('MANAGER');

-- passwords are set to "P@ssw0rd!"
insert into app_user (username, password_hash, disabled)
    values
    ('john@smith.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 0),
    ('sally@jones.com', '$2a$10$ntB7CsRKQzuLoKY3rfoAQen5nNyiC/U60wBsWnnYrtQQi8Z3IZzQa', 0);

insert into app_user_role
    values
    (1, 2),
    (2, 1);
    
    
end //
delimiter ;

call set_known_good_state();