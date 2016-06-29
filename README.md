# HourlyAdmin

API Dev Server:

DEV API SERVER: ec2-107-23-28-238.compute-1.amazonaws.com:3000

DEV DB SERVER: hadev01.c5um0qomkwp2.us-east-1.rds.amazonaws.com:5432

---

## Login Endpoints

### Register

_http://**DEV API SERVER**/api/login/register_

params:
* email: asdf@asdf.com
* password: pass123
* displayName: AsdfUser (optional)

### Login

_http://**DEV API SERVER**/api/login_

params:
* email: asdf@asdf.com
* password: pass123

## Job Posting Endpoints

### New Job Post

_http://**DEV API SERVER**/api/job_

params:
* title: New Job
* description: It's a Job
* budget: 1000

