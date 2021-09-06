DROP DATABASE IF EXISTS rh5782;
CREATE DATABASE rh5782;

USE rh5782;

CREATE TABLE wishes (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    wish VARCHAR(100) NOT NULL,
);

-- CREATE TABLE testimonials (
--     id INTEGER NOT NULL AUTO_INCREMENT,
--     name VARCHAR(50) NOT NULL,
--     testimonial TEXT NOT NULL
-- )

-- CREATE TABLE answered (
--     id INTEGER NOT NULL AUTO_INCREMENT,
--     name VARCHAR(50) NOT NULL,
--     category VARCHAR(100) NOT NULL,
--     question TEXT NOT NULL,
--     answer TEXT,
--     time_wasted TEXT,

-- )