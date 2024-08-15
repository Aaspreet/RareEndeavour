--@block
CREATE TABLE `users` (
    `uid` varchar(255) NOT NULL,
    `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `quote` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`uid`),
    UNIQUE KEY `username` (`username`),
    CONSTRAINT `username_format` CHECK (
        regexp_like(`username`, _utf8mb4 '^[A-Za-z0-9_]+$')
    )
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci --@block
CREATE TABLE `posts` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` varchar(255) NOT NULL,
    `title` varchar(255) NOT NULL,
    `body` text NOT NULL,
    `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_posts_users` (`user_id`),
    CONSTRAINT `fk_posts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 16 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci --@block
CREATE TABLE `comments` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` varchar(255) DEFAULT NULL,
    `post_id` int NOT NULL,
    `parent_comment_id` int DEFAULT NULL,
    `content` text,
    `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_comments_users` (`user_id`),
    KEY `fk_comments_posts` (`post_id`),
    KEY `fk_comments_comments` (`parent_comment_id`),
    CONSTRAINT `fk_comments_comments` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comments_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comments_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE
    SET NULL
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci --@block
CREATE TABLE `tags` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci --@block
CREATE TABLE `post_tags` (
    `post_id` int NOT NULL,
    `tag_id` int NOT NULL,
    PRIMARY KEY (`post_id`, `tag_id`),
    KEY `fk_post_tags_tags` (`tag_id`),
    CONSTRAINT `fk_post_tags_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_post_tags_tags` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci --@block
CREATE TABLE `post_votes` (
    `post_id` int NOT NULL,
    `user_id` varchar(255) NOT NULL,
    `vote_type` enum('upvote', 'downvote') NOT NULL,
    PRIMARY KEY (`post_id`, `user_id`),
    KEY `fk_post_votes_users` (`user_id`),
    CONSTRAINT `fk_post_votes_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_post_votes_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci --@block
CREATE TABLE `comment_votes` (
    `comment_id` int NOT NULL,
    `user_id` varchar(255) NOT NULL,
    `vote_type` enum('upvote', 'downvote') NOT NULL,
    PRIMARY KEY (`comment_id`, `user_id`),
    KEY `fk_comment_votes_users` (`user_id`),
    CONSTRAINT `fk_comment_votes_comments` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comment_votes_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci --@block
SELECT *
FROM users,
    posts,
    comments,
    post_tags;