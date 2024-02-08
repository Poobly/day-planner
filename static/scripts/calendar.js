// WIP
// Create calendar
// Display events from backend or from local storage
// 

const current_date = new Date;
const year = current_date.getFullYear(); 

const week_rows = document.getElementsByClassName("table-week-row");

const weeks_obj = {
    0 : week_rows[0],
    1 : week_rows[1],
    2 : week_rows[2],
    3 : week_rows[3],
    4 : week_rows[4],
    5 : week_rows[5],
}

let date = new Date(year, 0, 1);

while (date.getFullYear() === year) {


    console.log(date);
    date.setDate(date.getDate() + 1);
}
