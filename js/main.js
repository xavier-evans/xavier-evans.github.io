// Function to convert date objects to strings or reverse
let formatTime = d3.timeFormat("%m-%d-%Y");
let parseTime = d3.timeParse("%B %d, %Y");

let practiceData;
let lineChart;


// Initialize data
loadData();

function loadData() {
    d3.csv("data/practice.csv", row => {
        row.date = parseTime(row.date);
        row.hours = +row.hours;
        return row
    }).then(data => {
        // Store csv data in global variable
        practiceData = data;
        console.log("practiceData", practiceData);

        lineChart = new LineChart("line-chart", practiceData);
    });
}
