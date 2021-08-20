-- DROP DATABASE IF EXISTS askthisdad;
-- CREATE DATABASE askthisdad;

USE askthisdad;

CREATE TABLE queries (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    question VARCHAR(1000) NOT NULL,
);

CREATE TABLE testimonials (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    testimonial VARCHAR(3000) NOT NULL
)

CREATE TABLE answered (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    question VARCHAR(1000) NOT NULL,
    answer VARCHAR(60000),
    time_wasted VARCHAR(65000),

)