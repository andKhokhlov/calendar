CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    type VARCHAR(16) NOT NULL, -- 'replacement' или 'session'
    date DATE NOT NULL,
    data BYTEA NOT NULL,
    mimetype VARCHAR(64) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
