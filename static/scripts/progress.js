// WIP: 
// if user is logged in get data from backend else use local storage

import { toIsoStringLocale } from "./utils/helpers.js";

const progress_table = document.getElementById("progress-table");
const day_rows = progress_table.querySelectorAll("tbody > tr");
const current_date = new Date; 
let year = current_date.getFullYear();

const sessions = JSON.parse(localStorage.getItem("elapsed_sessions")); 

let logged
await fetch("/api/user/loggedin")
.then(response => response.json())
.then(python_data => logged = python_data);

let data;
await fetch("/api/pomodoro/progress")
.then(response => response.json())
.then(python_data => data = python_data);



let total_days = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;

const days_object = {
    0 : document.getElementById("row-sunday"),
    1 : document.getElementById("row-monday"),
    2 : document.getElementById("row-tuesday"),
    3 : document.getElementById("row-wednesday"),
    4 : document.getElementById("row-thursday"),
    5 : document.getElementById("row-friday"),
    6 : document.getElementById("row-saturday")
};

const months_object = {
    0 : document.getElementById("header-jan"),
    1 : document.getElementById("header-feb"),
    2 : document.getElementById("header-mar"),
    3 : document.getElementById("header-apr"),
    4 : document.getElementById("header-may"),
    5 : document.getElementById("header-jun"),
    6 : document.getElementById("header-jul"),
    7 : document.getElementById("header-aug"),
    8 : document.getElementById("header-sep"),
    9 : document.getElementById("header-oct"),
    10 : document.getElementById("header-nov"),
    11 : document.getElementById("header-dec")
};


const days = {}
const today = toIsoStringLocale(new Date()).slice(0, 10);
let date = new Date(year, 0, 1);

let current_month = date.getMonth();
let next_month = date.getMonth() + 1;
let colspan_count = 0;


function date_object(sessions, element) {
    return {
        sessions, 
        element
    };
}

while (date.getFullYear() === year) {
    let current_day = date.getDay();
    
    // adds empty td elements to start of table/graph if the first day of the year starts on a day other than sunday
    if (date.getMonth() == 0 && date.getDate() == 1 && current_day > 0) {
        for (let i = 0; i < current_day; i++) {
            days_object[i].appendChild(document.createElement("td"));
        }
    }
    
    // check if it's first day of week and same month.
    if (current_month == next_month) {
        colspan_count = 0;
        next_month = date.getMonth() + 1;
    }
    if (date.getDay() == 0 || current_month == 0 && date.getDate() == 1) {
        // set colspan to amount of weeks in month that starts with a day from that month
        colspan_count++;
    }

    months_object[current_month].colSpan = colspan_count;

    const new_date = new Date(date);
    const new_date_str = toIsoStringLocale(date).slice(0, 10);
    date.setDate(date.getDate() + 1);
    current_month = date.getMonth();

    let day = document.createElement("td");
    day.classList.add("progress-tile");
    day.dataset.date = new_date_str;
    
    days[new_date_str] = date_object(0, day);
    days_object[current_day].appendChild(day);
    
    // check if user logged in and get data from db and insert into days object e.g. days[new_date_str] = database_data[new_date_str] 




    day.addEventListener("mouseenter", (e) => {
        const tool_tip = document.createElement("span");
        day.appendChild(tool_tip);
        tool_tip.classList.add("tool-tip");
        const date_str = new_date.toLocaleString(undefined, { month: "long", day: "numeric" });
        if (days[new_date_str].sessions > 0) tool_tip.textContent = `You have done ${days[new_date_str].sessions} work sessions on ${date_str}.`; 
        else tool_tip.textContent = `You have done no work sessions on ${date_str}.`; 

    });

    day.addEventListener("mouseleave", (e) => {
        day.textContent = "";
    });
    
}

if (logged == "1"){
    for (let session of data) {
        const session_date = session.date;
        days[session_date].sessions = session.count;

        if (days[session_date].sessions > 5) days[session_date].element.classList.add("progress-tile-4");
        else if (days[session_date].sessions > 4) days[session_date].element.classList.add("progress-tile-3");
        else if (days[session_date].sessions > 2) days[session_date].element.classList.add("progress-tile-2");
        else if (days[session_date].sessions > 0) days[session_date].element.classList.add("progress-tile-1");
    }        
}
else {
    for (let session in sessions) {
        days[session].sessions = sessions[session]
        
        if (days[session].sessions > 5) days[session].element.classList.add("progress-tile-4");
        else if (days[session].sessions > 4) days[session].element.classList.add("progress-tile-3");
        else if (days[session].sessions > 2) days[session].element.classList.add("progress-tile-2");
        else if (days[session].sessions > 0) days[session].element.classList.add("progress-tile-1");
    }        
}


