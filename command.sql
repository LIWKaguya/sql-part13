CREATE TABLE blogs(
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

insert into blogs (title, author, url, likes) values ('First One', 'Mumei', 'www.mumei.com', 10);

insert into blogs (title, author, url, likes) values ('Second One', 'Kronii', 'www.kronii.com', 15);

SELECT * from blogs