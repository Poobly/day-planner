CREATE TABLE plan_details (
    id INTEGER,
    time TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE users (
    id INTEGER,
    username TEXT NOT NULL,
    hash TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE plans (
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(plan_id) REFERENCES plan_details(id)
);

CREATE TABLE pomodoros (
    user_id INTEGER NOT NULL,
    pomodoro_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(pomodoro_id) REFERENCES pomodoro_details(id)
);

CREATE TABLE pomodoro_details (
    id INTEGER,
    date TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE settings (
    id INTEGER,
    description TEXT,
    PRIMARY KEY(id)
)

CREATE TABLE user_settings (
    user_id INTEGER NOT NULL,
    settings_id INTEGER NOT NULL,
    value BOOLEAN NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(settings_id) REFERENCES settings(id)
)