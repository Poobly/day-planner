
const progress_table = document.getElementById("progress-table");
const day_rows = progress_table.querySelectorAll("tbody > tr");
const current_date = new Date; 
let year = current_date.getUTCFullYear();
let total_days = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;

let date = new Date(Date.UTC(year, 0, 1));

const days_object = {
    0 : document.getElementById("row-sunday"),
    1 : document.getElementById("row-monday"),
    2 : document.getElementById("row-tuesday"),
    3 : document.getElementById("row-wednesday"),
    4 : document.getElementById("row-thursday"),
    5 : document.getElementById("row-friday"),
    6 : document.getElementById("row-saturday") 
};

const days = []
while (date.getUTCFullYear() === year) {
    let current_day = date.getUTCDay();
    if (date.getUTCMonth() == 0 && date.getUTCDate() == 1 && current_day > 0) {
        for (let i = 0; i < current_day; i++) {

            days_object[i].appendChild(document.createElement("td"));
        }
    }

    let new_date = new Intl.DateTimeFormat('en-CA', {timeZone: "UTC"}).format(date);
    days.push(new_date);
    date.setUTCDate(date.getUTCDate() + 1);
    let day = document.createElement("td");
    day.classList.add("progress-tile");
    day.dataset.date = new_date;

    days_object[current_day].appendChild(day);


}
