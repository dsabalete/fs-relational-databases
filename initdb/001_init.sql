-- This script runs only on first initialization of the PostgreSQL data directory.
-- Add your schema/bootstrap SQL here.

CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO health_check DEFAULT VALUES;

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  important BOOLEAN,
  date time
);

insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
