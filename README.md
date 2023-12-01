# Mesh Explorer JS

## Overview
Mesh Explorer JS is an application that demonstrates the capabilities of the Mesh Link and Mesh RESTful APIs. It's built using React, Next.js (for server-side rendering), and Tailwind CSS.

### Prerequisites
- Node.js version 16.x or higher

## Getting Started

### Clone the Repository
To get started with the Mesh Explorer JS, clone the repository to your local machine:


```bash
git clone https://github.com/FrontFin/mesh-explorer-js.git

cd mesh-explorer-js

npm install
```


#### Access credentials
Navigate to the Mesh Dashboard Settings page and pull the API credentials:

https://dashboard.meshconnect.com/company/keys

Optionally, staging or production credentials


#### Environment variables:

Set up the following environment variables. Add these to a .env file located at the root of the repository:

```bash

NEXT_PUBLIC_USER_ID=<random_user_identifier>
NEXT_PUBLIC_DESTINATION_ADDRESS=<destination_address_for_funds>
MESH_API_URL=<https://sandbox-integration-api.getfront.com or https://integration-api.getfront.com>
CLIENT_ID=<your_mesh_provided_client_id>
NEXT_PUBLIC_CLIENT_ID=<your_mesh_provided_client_id>
PROD_API_KEY=<your_mesh_provided_api_key>
NEXT_PUBLIC_ETH_DESTINATION_ADDRESS=<your_eth_destination_address>
NEXT_PUBLIC_SOL_DESTINATION_ADDRESS=<your_sol_destination_address>
# Add more token addresses as needed for /pay or /transfer functionalities


```

Replace the placeholders (e.g., <random_user_identifier>) with your actual data.

### Validating Environment Variables:

To validate the environment variables, source the .env file and echo a variable:


```bash
 source .env
 echo NEXT_PUBLIC_CLIENT_ID
```

#### Run the application

```bash
npm run dev
```

Navigate to localhost:{{yourPort}}. You should see the app running.

