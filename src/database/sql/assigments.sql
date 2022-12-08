create table assignments
(
    id           serial
        primary key,
    description  text                     not null,
    user_id      integer                  not null
        references users
            on delete cascade,
    published_at timestamp with time zone not null,
    deadline_at  timestamp with time zone not null,
    created_at   timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at   timestamp with time zone default CURRENT_TIMESTAMP
);