const applicationsBodyEl = document.getElementById("applicationsBody");


const renderApplicationData = (data) => {
    // Clear the table body before rendering new data
    applicationsBodyEl.innerHTML = "";

    data.map((application) => {
        // Create a new row for each application
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = application.id;

        const valuationCell = document.createElement("td");
        valuationCell.textContent = application.Details.isValuationFeePaid ? 'Passed' : 'Failed';
        valuationCell.classList.add(`${application.Details.isValuationFeePaid ? 'passed' : 'failed'}`);

        const ukCell = document.createElement("td");
        ukCell.textContent = application.Details.isUkResident ? 'Passed' : 'Failed';
        ukCell.classList.add(`${application.Details.isUkResident ? 'passed' : 'failed'}`);

        const riskCell = document.createElement("td");
        riskCell.textContent = application.Details.riskRating === 'Medium' ? 'Passed' : 'Failed';
        riskCell.classList.add(`${application.Details.riskRating === 'Medium' ? 'passed' : 'failed'}`);

        const ltvCell = document.createElement("td");
        const ltvValue = parseInt(application.Details.ltv);
        ltvCell.textContent = ltvValue < 60 ? 'Passed' : 'Failed';
        ltvCell.classList.add(`${ltvValue < 60 ? 'passed' : 'failed'}`);

        const statusCell = document.createElement("td");
        statusCell.textContent = application.status;
        statusCell.classList.add(`${application.status === 'Passed' ? 'passed': 'failed'}`)


        // Append cells to the row
        row.appendChild(idCell);
        row.appendChild(valuationCell);
        row.appendChild(ukCell);
        row.appendChild(riskCell);
        row.appendChild(ltvCell);
        row.appendChild(statusCell);

        // Add the row to the table body
        applicationsBodyEl.appendChild(row);
    });
};

const getApplicationData = async () => {
    const apiUrl = "https://srinu-transition-computing-backend-project.vercel.app/checklist";
    const options = {
        method: 'GET'
    }

    try {
        const response = await fetch(apiUrl, options);

        if (response.ok === true) {
            const data = await response.json();
            console.log(data.results);
            renderApplicationData(data.results);
        }

    } catch (e) {
        console.log(`Error Fetching data: ${e.message}`);
    }
}


getApplicationData();