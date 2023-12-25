CREATE TABLE plans (
    id INTEGER NOT NULL,
    time TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE users (
    id INTEGER NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL
);

CREATE TABLE assignment_table (
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(plan_id) REFERENCES plans(id)
);