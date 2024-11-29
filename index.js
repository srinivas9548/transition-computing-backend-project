const express = require("express");
const path = require("path");
const cors = require("cors");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

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

            return results;
        } else {
            console.log("API did not return an array of applications");
            return [];
        }

    } catch (e) {
        console.log(`Unable to Fetching API: ${e.message}`);
    }
}

app.get("/checklist", async (request, response) => {
    try {
        const results = await fetchedDataAndEvaluate();

        if (results.length > 0) {
            response.status(200).json({ results });
        } else {
            response.status(400).json({ message: "No applications found or unable to fetch data." })
        }
    } catch (e) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/htmlPage', (request, response) => {
    response.sendFile(path.join(__dirname, 'public', 'app.html'));
});


app.get("/", (request, response) => {
    try {
        response.send("Welcome! This is a Transition Company Assignment backend domain.Please access data by using '/checklist' endpoint and access frontend page by using '/htmlPage' endpoint.");
    } catch (e) {
        console.log(e.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;