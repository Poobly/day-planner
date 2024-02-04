// WIP: 
// if user is logged in get data from backend else use local storage

const progress_table = document.getElementById("progress-table");
const day_rows = progress_table.querySelectorAll("tbody > tr");
const current_date = new Date; 
let year = current_date.getFullYear();

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

let active_element = false;

const days = {}
const today = new Date().toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
let date = new Date(year, 0, 1);

let current_month = date.getMonth();
let next_month = date.getMonth() + 1;
let colspan_count = 0;


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

    let new_date = date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
    days[new_date] = 0;
    date.setDate(date.getDate() + 1);
    current_month = date.getMonth();

    let day = document.createElement("td");
    day.classList.add("progress-tile");
    day.dataset.date = new_date;
    
    days_object[current_day].appendChild(day);
    
    // check if user logged in and get data from db and insert into days object e.g. days[new_date] = database_data[new_date] 
    if (today == new_date) {
        days[new_date] = JSON.parse(localStorage.getItem("elapsed_sessions")); 
        
        if (days[new_date] > 5) day.classList.add("progress-tile-4");
        else if (days[new_date] > 4) day.classList.add("progress-tile-3");
        else if (days[new_date] > 2) day.classList.add("progress-tile-2");
        else if (days[new_date] > 0) day.classList.add("progress-tile-1");
    }


    day.addEventListener("mouseenter", (e) => {
        const tool_tip = document.createElement("tool-tip");
        day.appendChild(tool_tip);
        tool_tip.classList.add("tool-tip");

        if (days[new_date] > 0) tool_tip.textContent = `You have done ${days[new_date]} work sessions.`; 
        else tool_tip.textContent = `You have done no work sessions.`; 

        active_element = day;
    });

    day.addEventListener("mouseleave", (e) => {
        day.textContent = "";
    });
    
}



class Tooltip extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {

    }
}
customElements.define("tool-tip", Tooltip);
