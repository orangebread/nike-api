# HourlyAdmin

API Dev Server:

DEV API SERVER: ec2-107-23-28-238.compute-1.amazonaws.com:3000

DEV DB SERVER: hadev01.c5um0qomkwp2.us-east-1.rds.amazonaws.com:5432

---

## Login Endpoints

### Register

POST

_http://**DEV API SERVER**/api/login/register_

params:
* email: asdf@asdf.com
* password: pass123
* displayName: AsdfUser (optional)

### Login

POST

_http://**DEV API SERVER**/api/login_

params:
* email: asdf@asdf.com
* password: pass123

## Job Posting Endpoints

### New Job Post

POST

_http://**DEV API SERVER**/api/job_

params:
* title: New Job
* description: It's a Job
* budget: 1000
* expires_at: 2017-01-01 14:15:16
  - if no values passed, a default of 2 weeks will be added
  - add logic to prevent adding dates older than current time

###  Get Job Collection

GET

_http://**DEV API SERVER**/api/job_

params:
* No params

### Get Job by ID

GET

_http://**DEV API SERVER**/api/job_

params:
* id: <integer id>
