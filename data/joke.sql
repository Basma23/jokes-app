DROP TABLE IF EXISTS joke;

CREATE TABLE joke(
    id SERIAL PRIMARY KEY,
    type VARCHAR(250),
    setup VARCHAR(250),
    punchline VARCHAR(250)
);
