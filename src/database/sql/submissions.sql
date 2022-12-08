create table submissions
(
    id            serial
        primary key,
    user_id       integer not null
        references users
            on delete cascade,
    assignment_id integer not null
        references assignments
            on delete cascade,
    submitted_at  timestamp with time zone,
    unique (user_id, assignment_id)
);