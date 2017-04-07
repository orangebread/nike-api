-- Up
CREATE TABLE contacts (id INTEGER PRIMARY KEY, email TEXT, password TEXT, firstName TEXT, lastName TEXT);
INSERT INTO contacts VALUES (NULL, 'user1@email.com', 'password' , 'user1', 'user1');
INSERT INTO contacts VALUES (NULL, 'user2@email.com', 'password' , 'user2', 'user2');
INSERT INTO contacts VALUES (NULL, 'user3@email.com', 'password' , 'user3', 'user3');
INSERT INTO contacts VALUES (NULL, 'user4@email.com', 'password' , 'user4', 'user4');

-- Down
DROP TABLE contacts