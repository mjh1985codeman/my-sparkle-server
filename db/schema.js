const queries = {
    createTables: [
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
    ],
    getParents: `SELECT * FROM Parent;`,
    getStudents: `SELECT * FROM Student;`,
    createParent: `INSERT INTO Parent (firstName, lastName, phone, email) VALUES (?, ?, ?, ?)`,
    createStudent: `INSERT INTO Student (firstName, lastName, age, parentId) VALUES (?, ?, ?, ?)`,
}

module.exports = queries; 