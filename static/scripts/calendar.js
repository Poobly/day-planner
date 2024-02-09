// WIP
// Display events from backend or from local storage


const current_date = new Date;
const year = current_date.getFullYear();
let month = current_date.getMonth();  


const week_rows = document.getElementsByClassName("table-week-row");

const weeks_obj = {
    0 : week_rows[0],
    1 : week_rows[1],
    2 : week_rows[2],
    3 : week_rows[3],
    4 : week_rows[4],
    5 : week_rows[5]
}

const days_object = {}

function day (day, month, year, element, plans) {
    return {day, month, year, element, plans};
}

let date = new Date(year, month, 1);
let new_date = new Date(year, month, 1);

let weeks = 0;

const next_month_button = document.getElementById("calendar-asc-button");
const previous_month_button = document.getElementById("calendar-desc-button");

previous_month_button.addEventListener("click", (e) => {
    month--;
    loadCalendar();
})

next_month_button.addEventListener("click", (e) => {
    month++;
    loadCalendar();
})




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
            new_date.setDate(date.getDate() - i);
            
            const last_month_element_con = document.createElement("td");
            const str_date = new_date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
            last_month_element_con.textContent = new_date.getDate();
            last_month_element_con.classList.add("day-con");
            last_month_element_con.dataset.date = str_date;
            days_object[str_date] = day(new_date.getDate(), new_date.getMonth(), new_date.getFullYear(), last_month_element_con);

            weeks_obj[weeks].appendChild(last_month_element_con);

            new_date.setDate(new_date.getDate() + i);
        }
    }

    const day_element_con = document.createElement("td");
    const str_date = date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
    day_element_con.textContent = date.getDate();
    day_element_con.classList.add("day-con");
    day_element_con.dataset.date = str_date;

    weeks_obj[weeks].appendChild(day_element_con);

    days_object[str_date] = day(date.getDate(), date.getMonth(), date.getFullYear(), day_element_con);

    date.setDate(date.getDate() + 1);
}

// checks if current month is not the same as starting month, and it will fill in the spaces in the calendar that belong to next month.
if (date.getMonth() !== month) {
    new_date.setDate(date.getDate());
    new_date.setMonth(date.getMonth());

    for (let i = weeks; i < 6; i++) {
        for (let j = new_date.getDay(); j < 7; j++) {

            const new_month_element_con  = document.createElement("td");
            str_date = new_date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
            new_month_element_con.textContent = new_date.getDate();
            new_month_element_con.classList.add("day-con");
            new_month_element_con.dataset.date = str_date;
            days_object[str_date] = day(new_date.getDate(), new_date.getMonth(), new_date.getFullYear(), new_month_element_con);
            
            
            weeks_obj[i].appendChild(new_month_element_con);

            new_date.setDate(new_date.getDate() + 1); 

        }
    }
}


console.log(days_object);