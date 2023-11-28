### Mesh Explorer JS

This application provides sample code that showcases the Mesh Link and Mesh RESTful APIs. 

The application was built using React, NEXT JS (for Server side), and TailWind CSS.

Requires Node.js 16.x+

Clone the repo
git clone https://github.com/FrontFin/mesh-explorer-js.git
Getting started
Init via npm:

cd mesh-explorer-js
npm install


#### Access credentials
Navigate to the Mesh Dashboard Settings page and pull the API credentials:

https://dashboard.meshconnect.com/company/keys

Optionally, staging or production credentials


#### Set environment variables:

NEXT_PUBLIC_USER_ID={{randon user identifier}} 
NEXT_PUBLIC_DESTINATION_ADDRESS={{where the funds get sent to for pay and transfer pages.}}

MESH_API_URL={{https://sandbox-integration-api.getfront.com or https://integration-api.getfront.com}}
CLIENT_ID={{ your Mesh provided Client Id}}
NEXT_PUBLIC_CLIENT_ID={{ your Mesh provided Client Id}}
PROD_API_KEY={{ your Mesh provided API Key }}

Add the following environment variables to a .env file in base of the repository:


Validate the values contained in the .env file:

 source .env
 echo NEXT_PUBLIC_CLIENT_ID
Optional

#### Run the application
npm run dev
Navigate to localhost:{{yourPort}}. You should see the app running.

Generate a build
npm run build