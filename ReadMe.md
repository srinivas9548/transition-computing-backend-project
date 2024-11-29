# Transition Computing Backend Assignment

### Task Description:
* You need to create a Checklist System in Node.js that evaluates certain conditions
based on the provided input data (fetched from an API) and displays a dashboard with
results showing which conditions have passed and failed.

### API Endpoint for Input Data:

* API: http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639


### Step 1: Project Setup

- **Initialize Your Node.js Project**: Start by creating a new directory for your project and initialize it with Node.js settings using `npm init`.
- **Install Dependencies**: You'll need Express for your server and a package to handle HTTP requests (like `node-fetch` or `axios`) to fetch data from the API.

### Step 2: Define the Server Structure

- **Create a Basic Server**: Set up a basic Express server that will handle incoming HTTP requests.
- **Routing**: Define a route to handle requests where the checklist will be processed and the results will be returned.

### Step 3: Data Retrieval

- **Fetching Data**: Write a function or module dedicated to fetching data from the specified API endpoint. This module will handle the API call and return the data to your server logic.

### Step 4: Checklist Logic

- **Checklist Rules**: Define the rules in a configurable format, possibly in a separate JSON or JavaScript file. This makes the rules easy to manage and modify.
- **Evaluation Function**: Develop a function to evaluate the fetched data against your checklist rules. This function should be adaptable to handle any changes or additions to the rules without requiring significant modifications to the core logic.