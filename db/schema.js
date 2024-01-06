const queries = {
    createTables: [
        `DROP TABLE IF EXISTS StudentEnrollments;`,
        `DROP TABLE IF EXISTS StudentSubscriptions;`,
        `DROP TABLE IF EXISTS Services;`,
        `DROP TABLE IF EXISTS Student;`,
        `DROP TABLE IF EXISTS Parent;`,
        `CREATE TABLE Parent (
            parentId INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(firstName) >= 1 AND CHAR_LENGTH(firstName) <= 50),
            lastName VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(lastName) >= 1 AND CHAR_LENGTH(lastName) <= 50),
            phone VARCHAR(15),
            email VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(email) >= 1 AND CHAR_LENGTH(email) <= 50)
        );`,
        `CREATE TABLE Student (
            studentId INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(firstName) >= 1 AND CHAR_LENGTH(firstName) <= 50),
            lastName VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(lastName) >= 1 AND CHAR_LENGTH(lastName) <= 50),
            age INT,
            parentId INT,
            FOREIGN KEY (parentId) REFERENCES Parent(parentId)
        );`,
        `CREATE TABLE Services (
            serviceId INT AUTO_INCREMENT PRIMARY KEY,
            serviceName VARCHAR(255) NOT NULL,
            description VARCHAR(1000) NOT NULL,
            perSessionPrice DECIMAL(10,2) NOT NULL,
            remote BOOLEAN NOT NULL,
            locationName VARCHAR(100) NOT NULL,
            stAddress VARCHAR(100) NOT NULL,
            city VARCHAR(50) NOT NULL,
            state VARCHAR(25) NOT NULL,
            zip VARCHAR(25) NOT NULL
        );`,
        `CREATE TABLE StudentEnrollments (
            subscriptionId INT AUTO_INCREMENT PRIMARY KEY,
            student INT,
            service INT,
            FOREIGN KEY (student) REFERENCES Student(studentId),
            FOREIGN KEY (service) REFERENCES Services(serviceId),
            UNIQUE KEY unique_subscription (student, service)
        );`
    ],
    getParents: `SELECT * FROM Parent;`,
    getStudents: `SELECT * FROM Student;`,
    createParent: `INSERT INTO Parent (firstName, lastName, phone, email) VALUES (?, ?, ?, ?)`,
    createStudent: `INSERT INTO Student (firstName, lastName, age, parentId) VALUES (?, ?, ?, ?)`,
    getStudentById: `SELECT * FROM Student WHERE studentId = ?`,
    getParentById: `SELECT * FROM Parent WHERE parentId = ?`,
    enrollStudent: `INSERT INTO StudentEnrollments (student, service) VALUES (?, ?)`
}

module.exports = queries; 