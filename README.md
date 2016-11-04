# HourlyAdmin

ATTENTION: 4433 is the secure port for testing HTTPS endpoints

https://www.braintreegateway.com/merchants/49y9824s4ym6dw4w/home

email: masantilliventures@gmail.com

MogaDigitalHourly09

API Dev Server:

DEV API SERVER: ec2-107-20-13-172.compute-1.amazonaws.com:3000

DEV DB SERVER: hadev01.c5um0qomkwp2.us-east-1.rds.amazonaws.com:5432

---

## Login Endpoints

### Register

POST _http://**DEV API SERVER**/api/login/register_

params:
* email: asdf@asdf.com
* password: pass123
* display_name: AsdfUser (optional)

### Login

POST _http://**DEV API SERVER**/api/login_

params:
* email: asdf@asdf.com
* password: pass123

### Facebook Login

POST _http://**DEV API SERVER**/api/login/facebook_

params:
* fb_id: firstResponse.authResponse.userID,
* fb_token: firstResponse.authResponse.accessToken,
* email: secondResponse.email

## User Endpoints

### Get User by ID

POST _http://**DEV API SERVER**/api/user/:id

params:
* id: <user id>

### Get User by self ID

POST _http://**DEV API SERVER**/api/user

params:
* No params, uses token

## Job Posting Endpoints

### New Job Post

POST _http://**DEV API SERVER**/api/job_

params:
* title: New Job
* description: It's a Job
* budget: 1000
* expires_at: 2017-01-01 14:15:16
  - if no values passed, a default of 2 weeks will be added
  - add logic to prevent adding dates older than current time

###  Get Job Collection

GET _http://**DEV API SERVER**/api/search/job_

params:
* No params

### Get Job by ID

GET _http://**DEV API SERVER**/api/search/job/:id_

params:
* id: <integer id>

### Get Job by User

GET _http://**DEV API SERVER**/api/job/me_

params:
* No params

### Job Workflow

POST _http://**DEV API SERVER**/api/job/workflow_

params:
* job_id: 1
* workflow_id: 1

1	Open
2	In Progress
3	Ready for Review
4	In Review
5	Payment Released
6	Completed

## Application Endpoints

### Apply to Job

POST _http://**DEV API SERVER**/api/application_

params:
* job_id: 1,
* bid_amount: 1000
* description: blah blah blah
* employer_id: <employer user id>

### Get Applications for user

GET _http://**DEV API SERVER**/api/application_

params:
* No params

### Accept/Reject Applications

PUT _http://**DEV API SERVER**/api/application/accept_

params:
* job_id: 1,
* application_id: 1

PUT _http://**DEV API SERVER**/api/application/reject_

params:
* job_id: 1,
* application_id: 1

### Get Applications by job

POST _http://**DEV API SERVER**/api/job/:id/application_

params:
* id: 1

## Messaging Endpoints

### Send NEW Message

POST _http://**DEV API SERVER**/api/message/new_

params:
 * message: blahblahblah
 * employer_id: <user id>

### Send reply Message

POST _http://**DEV API SERVER**/api/message_

params:
 * message: blahblahblah
 * thread_id: <thread id>

### Retrieve User Messages Collection

GET _http://**DEV API SERVER**/api/message_

params:
 * No params

### Retrieve User Messages Collection

GET _http://**DEV API SERVER**/api/message/thread/:id_

params:
 * id: <thread id>

### Retrieve User Thread Collection ONLY - no messages

GET _http://**DEV API SERVER**/api/message/thread_

params:
 * No params

## MERCHANT/MARKETPLACE Endpoints

### Onboard Submerchant TEST

POST _http://**DEV API SERVER**/api/merchant/addtest_

params:
 * None - already filled out server side

### Onboard Submerchant

 POST _http://**DEV API SERVER**/api/merchant/add_

 params:
// Individual params
    first_name,
    last_name,
    email,
    phone,
    dob, // YYYY-MM-DD
    ssn,
    street_address,
    locality,
    region,
    postal_code,

// Business (optional)
    legal_name,
    dba_name, // "Doing Business As" Name
    tax_id,
    b_street_address,
    b_locality,
    b_region,
    b_postal_code,

// Funding
    descriptor,
    f_email,
    f_mobile_phone, // OPTIONAL
    account_number,
    routing_number,

// Other
    tos_accepted (true or false)

### Find Submerchant

GET _http://**DEV API SERVER**/api/merchant_

params:
 * No params

### Generate client token

GET _http://**DEV API SERVER**/api/merchant/client_token_

params:
 * None

### Process Sale TEST

GET _http://**DEV API SERVER**/api/merchant/processtest_

params:
 * merchant_id: <merchant user id>
 * employee_id: <employee user id>
 * job_id: <job id>
 * amount: <dollar amount>
 * payment_method_nonce: IGNORE THIS FIELD, NONCE PROVIDED


### Process Sale

GET _http://**DEV API SERVER**/api/merchant/process_

params:
 * merchant_id: <merchant user id>
 * employee_id: <employee user id>
 * job_id: <job id>
 * amount: <dollar amount>
 * payment_method_nonce: <nonce token> (passed in from client)
 
### Release Escrow Funds

POST _http://**DEV API SERVER**/api/merchant/release_

params:
 * job_id: <job id>

### Transaction by ID

GET _http://**DEV API SERVER**/api/merchant/transaction/:id_

params:
* id: <transaction id>

### Transaction collection by user

GET _http://**DEV API SERVER**/api/merchant/transaction_

params:
* NO params


## EMAIL NOTIFICATIONS

* Registration
* Job posting
