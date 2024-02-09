// WIP
// Display events from backend or from local storage


const current_date = new Date;
const year = current_date.getFullYear();
const month = current_date.getMonth();  


const week_rows = document.getElementsByClassName("table-week-row");

const weeks_obj = {
    0 : week_rows[0],
    1 : week_rows[1],
    2 : week_rows[2],
    3 : week_rows[3],
    4 : week_rows[4],
    5 : week_rows[5],
}

let date = new Date(year, month, 1);
let new_date = new Date(year, month, 1);

let weeks = 0;


while (date.getFullYear() === year && date.getMonth() === month) {

    if (date.getDay() === 0) {
        weeks++;
    }
    if (date.getDate() === 0) {
        weeks = 0;
    }
    
    /**
     * checks if it's first day of a month and if it isn't the first day of the week,
     * then it loops over how many days into the week the first day of the current month is
     * to then add in the previous month's days.
     */
    if (date.getDate() === 1 && date.getDay() !== 0 ) {
        for (let i = date.getDay(); i > 0; i--) {
            const last_month_element = document.createElement("td");
            new_date.setDate(date.getDate() - i);
            last_month_element.textContent = new_date.getDate();
            weeks_obj[weeks].appendChild(last_month_element);
            new_date.setDate(new_date.getDate() + i);
        }
    }

    const day_element_con = document.createElement("td");
    day_element_con.textContent = date.getDate();
    weeks_obj[weeks].appendChild(day_element_con);
    date.setDate(date.getDate() + 1);
}

// checks if current month is not the same as starting month, and it will fill in the spaces in the calendar that belong to next month.
if (date.getMonth() !== month) {
    new_date.setDate(date.getDate());
    new_date.setMonth(date.getMonth());

    for (let i = weeks; i < 6; i++) {
        for (let j = new_date.getDay(); j < 7; j++) {

            const new_month_element  = document.createElement("td");
            new_month_element.textContent = new_date.getDate();
            weeks_obj[i].appendChild(new_month_element);

            new_date.setDate(new_date.getDate() + 1); 

        }
    }
}
