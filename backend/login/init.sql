CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL
);

INSERT INTO subscribers (username, password_hash)
VALUES ('user', 'passkey')
ON CONFLICT DO NOTHING;
