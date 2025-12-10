-- EXTENSIONS
-- gen_random_uuid
-- TODO: Replace with v7
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUMS
CREATE TYPE content_format AS ENUM (
    'plain',
    'markdown'
);

-- TRIGGERS
-- updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- default tracker_id to author_id
CREATE OR REPLACE FUNCTION set_default_tracker()
RETURNS trigger AS $$
BEGIN
    IF NEW.tracker_id IS NULL THEN
        NEW.tracker_id := NEW.author_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TABLES
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(60) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Attachments
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    file_hash BYTEA UNIQUE NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER attachments_set_updated_at
BEFORE UPDATE ON attachments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Tasks
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    title VARCHAR(80) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tracker_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- who tracks completion
    task_id INTEGER REFERENCES tags(id) ON DELETE SET NULL,
    title VARCHAR(80) NOT NULL,
    content TEXT,
    content_format content_format NOT NULL DEFAULT 'plain',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    is_cancelled BOOLEAN NOT NULL DEFAULT false,
    CHECK (title <> '')
);

CREATE TRIGGER tasks_set_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_set_default_tracker
BEFORE INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_default_tracker();

CREATE INDEX idx_tasks_author_id ON tasks(author_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_incomplete_recent ON tasks(created_at DESC)
    WHERE completed_at IS NULL AND is_cancelled = false;
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at);
CREATE INDEX idx_tasks_is_cancelled ON tasks(is_cancelled);

CREATE TABLE task_assignees (
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, user_id)
);

CREATE TABLE task_attachments (
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    attachment_id INTEGER NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, attachment_id)
);

CREATE TABLE task_history (
    id BIGSERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    editor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    field TEXT NOT NULL,    -- e.g., 'title', 'completed_at'
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_history_task_id ON task_history(task_id);
CREATE INDEX idx_task_history_changed_at ON task_history(changed_at DESC);

-- Messages
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    receiver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reply_to_id BIGINT REFERENCES messages(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    content_format content_format NOT NULL DEFAULT 'plain',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    CHECK (reply_to_id IS NULL OR reply_to_id <> id)
);

CREATE TRIGGER messages_set_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX ON messages (sender_id);
CREATE INDEX ON messages (receiver_id);
CREATE INDEX ON messages (reply_to_id);
CREATE INDEX ON messages (created_at DESC);

CREATE TABLE message_attachments (
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    attachment_id INTEGER NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
    PRIMARY KEY (message_id, attachment_id)
);

CREATE INDEX idx_message_attachments_attachment_id ON message_attachments (attachment_id);

CREATE TABLE messages_history (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    field TEXT NOT NULL,    -- e.g., 'content', 'content_format'
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_history_message_id ON messages_history(message_id);
CREATE INDEX idx_messages_history_changed_at ON messages_history(changed_at DESC);
