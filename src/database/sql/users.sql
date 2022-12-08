create type user_type as enum ('student', 'tutor');
create table users
(
    id        serial
        primary key,
    username  varchar(30) not null
        unique,
    password  varchar(10) not null,
    user_type user_type
);