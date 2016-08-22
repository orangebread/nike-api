# HourlyAdmin

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
var firstName = req.body.first_name,
    lastName = req.body.last_name,
    email = req.body.email,
    phone = req.body.phone,
    dateOfBirth = req.body.dob, // YYYY-MM-DD
    ssn = req.body.ssn,
    streetAddress = req.body.street_address,
    locality = req.body.locality,
    region = req.body.region,
    postalCode = req.body.postal_code,

// Business (optional)
    legalName = req.body.legal_name,
    dbaName = req.body.dba_name, // "Doing Business As" Name
    taxId = req.body.tax_id,
    bStreetAddress = req.body.b_street_address,
    bLocality = req.body.b_locality,
    bRegion = req.body.b_region,
    bPostalCode = req.body.b_postal_code,

// Funding
    descriptor = req.body.descriptor,
    fEmail = req.body.f_email,
    fMobilePhone= req.body.f_mobile_phone, // OPTIONAL
    accountNumber = req.body.account_number,
    routingNumber = req.body.routing_number,

// Other
    tosAccepted = req.body.tos_accepted; (true or false)

### Find Submerchant

POST _http://**DEV API SERVER**/api/merchant/find_

params:
 * merchant_id: <merchant id>

### Generate client token

GET _http://**DEV API SERVER**/api/merchant/client_token_

params:
 * None

### Process Sale TEST

GET _http://**DEV API SERVER**/api/merchant/processtest_

params:
 * merchant_id: <merchant id>
 * amount: <dollar amount>
 * payment_method_nonce: IGNORE THIS FIELD, NONCE PROVIDED


### Process Sale

GET _http://**DEV API SERVER**/api/merchant/process_

params:
 * merchant_id: <merchant id>
 * amount: <dollar amount>
 * payment_method_nonce: <nonce token> (passed in from client)


## EMAIL NOTIFICATIONS

* Registration
* Job posting
