CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
  ('David', 'https://jander-blog.com/david-blog', 'David''s Blog', 5),
  ('Alex', 'https://jander-blog.com/alex-blog', 'Alex''s Blog', 3),
  ('Rosa', 'https://jander-blog.com/rosa-blog', 'Rosa''s Blog', 8);

