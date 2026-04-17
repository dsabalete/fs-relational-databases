DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

INSERT INTO users (username, name, password_hash, created_at, updated_at) VALUES
  ('david@sabalete.com', 'David Sabalete', 'secret', current_timestamp, current_timestamp),
  ('alex@sabalete.com', 'Alex Sabalete', 'secret', current_timestamp, current_timestamp),
  ('rosa@peregrina.com', 'Rosa Peregrina', 'secret', current_timestamp, current_timestamp); 
  
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id)
);

insert into blogs (author, url, title, likes, user_id) values ('Mecanoscrit del segon origen', 'https://mecanoscrit.com', 'Post-apocaliptic novel', 0, 1);
insert into blogs (author, url, title, likes, user_id) values ('Tirant lo Blanc', 'https://lallardelllibre.com', 'First Adventures Tale in Catalan History', 0, 2);
