const progress_table = document.getElementById("progress-table");
const day_rows = progress_table.querySelectorAll("tbody > tr");
const current_date = new Date; 
// let year = current_date.getUTCFullYear();
let year = 2023;
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


const days = []
let date = new Date(Date.UTC(year, 0, 1));

let current_month = date.getUTCMonth();
let next_month = date.getUTCMonth() + 1;
let colspan_count = 0;
while (date.getUTCFullYear() === year) {
    let current_day = date.getUTCDay();
    if (date.getUTCMonth() == 0 && date.getUTCDate() == 1 && current_day > 0) {
        for (let i = 0; i < current_day; i++) {
            days_object[i].appendChild(document.createElement("td"));
        }
    }

    console.log(`Date:${date.getUTCDate()}    Day of Week:${date.getUTCDay()}   Current Month:${current_month}  Next Month:${next_month}    ${(date.getUTCDay() == 0 || current_month == 0 && date.getUTCDate() == 1)}`)
    
    // check if it's first day of week and same month.
    if (current_month == next_month) {
        colspan_count = 0;
        next_month = date.getUTCMonth() + 1;
    }
    if (date.getUTCDay() == 0 || current_month == 0 && date.getUTCDate() == 1) {
        // set colspan to amount of weeks in month
        colspan_count++;
    }

    months_object[current_month].colSpan = colspan_count;

    
    let new_date = new Intl.DateTimeFormat('en-CA', {timeZone: "UTC"}).format(date);
    days.push(new_date);
    date.setUTCDate(date.getUTCDate() + 1);
    current_month = date.getUTCMonth();
   

    let day = document.createElement("td");
    day.classList.add("progress-tile");
    day.dataset.date = new_date;
    
    days_object[current_day].appendChild(day);
    
}
