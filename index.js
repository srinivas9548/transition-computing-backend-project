const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const axios = require("axios");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "database.db");

let db = null;

// Initialize Database and Server
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        app.listen(3000, () => {
            console.log("Server is running at http://localhost:3000/");
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
}

initializeDBAndServer();


const API_URL = "http://qa-gb.api.dynamatix.com:3100/api/applications";

const evaluateChecklist = (data) => {
    const { isValuationFeePaid, isUkResident, riskRating, ltv } = data;

    let status;

    // if all the conditions are satified, status is Passed otherwise status is Failed
    if (isValuationFeePaid === true && isUkResident === true && riskRating === "Medium" && parseInt(ltv) < 60) {
        status = "Passed";
    } else {
        status = "Failed";
    }

    return {
        status,
        details: {
            isValuationFeePaid,
            isUkResident,
            riskRating,
            ltv,
        }
    };
};

const fetchedDataAndEvaluate = async () => {
    try {

        const response = await axios.get(API_URL);

        const applications = response.data;

        if (Array.isArray(applications)) {
            // Iterate over each application and evaluate checklist
            const results = applications.map((application) => {
                const result = evaluateChecklist(application);
                return {
                    id: application.id,
                    status: result.status,
                    Details: result.details
                }
            });

            console.log(results);
        } else {
            console.log("API did not return an array of applications");
        }

    } catch (e) {
        console.log(`Fetching API Error: ${e.message}`);
    }
}

fetchedDataAndEvaluate();

module.exports = app;