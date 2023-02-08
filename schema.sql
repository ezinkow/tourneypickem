DROP DATABASE IF EXISTS amiranddana;
CREATE DATABASE amiranddana;

USE amiranddana;

CREATE TABLE comments (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name TEXT NOT NULL,
    comment TEXT NOT NULL,
);