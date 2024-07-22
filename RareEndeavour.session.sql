--@block
CREATE TABLE users (
    uid VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    profile_picture VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--@block
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_users FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
);

--@block
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255),
    post_id INT NOT NULL,
    parent_comment_id INT DEFAULT NULL,
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_users FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE SET NULL,
    CONSTRAINT fk_comments_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_comments FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

--@block
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

--@block
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_post_tags_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_tags_tags FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

--@block
CREATE TABLE post_votes (
    post_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    vote_type ENUM('upvote', 'downvote') NOT NULL,
    PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_post_votes_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_votes_users FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
);

--@block
CREATE TABLE comment_votes (
    comment_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    vote_type ENUM('upvote', 'downvote') NOT NULL,
    PRIMARY KEY (comment_id, user_id),
    CONSTRAINT fk_comment_votes_comments FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_votes_users FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
);

--@block
DESCRIBE users;