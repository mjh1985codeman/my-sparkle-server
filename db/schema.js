const queries = [
    `DROP TABLE IF EXISTS Student;`,
    `DROP TABLE IF EXISTS Parent;`,
    `CREATE TABLE Parent (
        parentId INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        email VARCHAR(255) UNIQUE NOT NULL
    );`,
    `CREATE TABLE Student (
        studentId INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        age INT,
        parentId INT,
        FOREIGN KEY (parentId) REFERENCES Parent(parentId)
    );`
];

module.exports = queries; 