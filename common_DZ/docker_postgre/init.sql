CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS Tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  user_id INTEGER,
  priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  completed BOOLEAN DEFAULT FALSE,
  deadline TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

INSERT INTO Users (firstname, lastname, email) VALUES 
  ('Иван', 'Иванов', 'ivan@example.com'),
  ('Андрей', 'Андреев', 'andrey@example.com'),
  ('Петр', 'Петров', 'petr@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO Tasks (title, user_id, priority, completed, deadline) VALUES 
  ('Разработать блок автоматики', 1, 2, FALSE, '2025-04-12'),
  ('Разработать демо пример', 3, 1, TRUE, '2025-04-02'),
  ('Создать описание блока электроники', 2, 3, FALSE, '2025-04-30');