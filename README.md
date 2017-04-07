# Nike API

## Getting started

Install dependencies

`npm install`

Start server

`npm start`

Authentication credentials

user: `admin`

password: `admin`

<br />

---

## Contact Endpoints

### Create Contact

POST _http://localhost:3000/api/contact_

request body params:
* email: asdf@asdf.com
* password: pass123
* firstName: username (optional)
* lastName: username (optional)

### Update Contact (requires auth)

PUT _http://localhost:3000/api/contact_

request body params:
* email: asdf@asdf.com
* password: pass123
* firstName: username
* lastName: username

### Get Contact by ID

GET _http://localhost:3000/api/contact/{id}_

params:
* id: contact ID

### Get Collection of Contacts w/ filter

GET _http://localhost:3000/api/contact_

query string params: 
* email: filter by email

### Delete Contact by ID (requires auth)

DELETE _http://localhost:3000/api/contact/{id}_

params:
* id: contact ID

