/**
 * TODO: - Add backend support, localstorage if not logged in
 * - create class or object for each day to add plans and store/display the time ranges
 * maybe locations as well
 */ 

import { createElementWithClass, dragElement, toIsoStringLocale } from "./utils/helpers.js";

const main_con = document.querySelector("main");
const table = document.getElementById("calendar-table");

const current_date = new Date;
let year = current_date.getFullYear();
let month = current_date.getMonth();
let current_day = toIsoStringLocale(current_date).slice(0, 10);

const week_rows = Array.from(document.getElementsByClassName("table-week-row"));

const weeks_obj = {
    0 : week_rows[0],
    1 : week_rows[1],
    2 : week_rows[2],
    3 : week_rows[3],
    4 : week_rows[4],
    5 : week_rows[5]
}

const days_object = {};

function createDayObj(date, month, year, element, plans) {
    return {date, month, year, element, plans};
}

let date = new Date(year, month, 1);
let new_date = new Date(year, month, 1);

let weeks = 0;

const next_month_button = document.getElementById("calendar-asc-button");
const previous_month_button = document.getElementById("calendar-desc-button");

const table_title = document.getElementById("table-title");


function loadCalendar() {
    table_title.textContent = date.toLocaleString(undefined, { month: "long" });
    while (date.getFullYear() === year && date.getMonth() === month) {

        /**
         * checks if it's first day of a month and if it isn't the first day of the week,
         * then it loops over how many days into the week the first day of the current month is
         * to then add in the previous month's days.
         */
        if (date.getDate() === 1 && date.getDay() !== 0 ) {
            for (let i = date.getDay(); i > 0; i--) {
                new_date.setDate(date.getDate() - i);
                
                const str_date = toIsoStringLocale(new_date).slice(0, 10);
                
                const last_month_element_con = createTableCell(new_date, str_date);
                last_month_element_con.classList.add("unactive-date");

                days_object[str_date] = createDayObj(
                    new_date.getDate(), 
                    new_date.getMonth(), 
                    new_date.getFullYear(), 
                    last_month_element_con
                    );
    
                weeks_obj[weeks].appendChild(last_month_element_con);
    
                new_date.setDate(new_date.getDate() + i);
            }
        }
    
        const str_date = toIsoStringLocale(date).slice(0, 10);
        

        const day_element_con = createTableCell(date, str_date);
        
        weeks_obj[weeks].appendChild(day_element_con);
    
        days_object[str_date] = createDayObj(date.getDate(), date.getMonth(), date.getFullYear(), day_element_con);
    
        if (date.getDay() === 6) {
            weeks++;
        }
        date.setDate(date.getDate() + 1);

    }


    
    // checks if current month is not the same as starting month, and it will fill in the spaces in the calendar that belong to next month.
    if (date.getMonth() !== month) {
        new_date.setDate(date.getDate());
        new_date.setMonth(date.getMonth());

        if (new_date.getMonth() === 0) new_date.setFullYear(new_date.getFullYear() + 1);

        for (let i = weeks; i < 6 && new_date.getDay() <= 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (new_date.getDay() >= j) {
                    const str_date = toIsoStringLocale(new_date).slice(0, 10);
                    
                    const new_month_element_con = createTableCell(new_date, str_date);

                    days_object[str_date] = createDayObj(
                        new_date.getDate(), 
                        new_date.getMonth(), 
                        new_date.getFullYear(), 
                        new_month_element_con
                        );
                    
                    
                    weeks_obj[i].appendChild(new_month_element_con);



                    new_date.setDate(new_date.getDate() + 1); 
                }
    
            }
        }
    }
}

loadCalendar();

previous_month_button.addEventListener("click", (e) => {
    month--;
    weeks = 0;
    checkYear();
    week_rows.forEach(element => {
        element.textContent = "";
    });
    date = new Date(year, month, 1);
    new_date = new Date(year, month, 1);

    loadCalendar();
})

next_month_button.addEventListener("click", (e) => {
    month++;
    weeks = 0;
    checkYear();
    week_rows.forEach(element => {
        element.textContent = "";
    });
    date = new Date(year, month, 1);
    new_date = new Date(year, month, 1);

    loadCalendar();
})

function checkYear() {
    if (month > 11) {
        year++;
        month = 0;
    }
    else if (month < 0) {
        year--;
        month = 11;
    }
}

function createTableCell(date, str_date) {
    const td = createElementWithClass("td", ["day-con"]);
    const span = createElementWithClass("span", ["day-date"]);

    td.addEventListener("click", selectCalendarElement);
    
    td.dataset.current_date = str_date;
    span.textContent = date.getDate();

    if (date.getMonth() !== month) span.classList.add("unactive-date");
    if (str_date === current_day) td.classList.add("current-day");
    
    td.appendChild(span);
    return td;
}

let active_modal = false;

function selectCalendarElement(e) {
    const td = e.currentTarget;
    const margin = 3;

    let x = td.offsetLeft + td.offsetParent.offsetLeft + td.offsetWidth + margin;
    let y = td.offsetTop + td.offsetParent.offsetTop + td.offsetHeight + margin;

    if (!active_modal) {
        td.classList.add("active-day");
    }

    createModal(td, x, y, margin);

}

function createModal(td, x, y, margin) {
    if (!active_modal) {
        const modal_con = createElementWithClass("div", ["modal-con"]);

        const element_date = new Date(td.dataset.current_date + "T00:00");
        const current_time = new Date();
        element_date.setMinutes(current_time.getMinutes());
        element_date.setHours(current_time.getHours());

        const iso_date = toIsoStringLocale(element_date);

        modal_con.innerHTML = `
        <div id="modal-header" class="modal-header">
            <button id="modal-header-close" class="modal-header-close-button">
                <svg class="close-svg" mlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>window-close</title>
                    <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"/>
                </svg>
            </button>
        </div>
        <form id="modal-form" class="modal-form">
            <input id="modal-title" name="modal-title" class="modal-title" placeholder="Add title">
            <div class="modal-time-con">
                <label for="start-date-time" class="modal-label">Starts</label>
                <date-time id="start-date-time" name="start-date-time" class="modal-date-time" value="${iso_date}"></date-time>
            </div>
            <div class="modal-time-con">
                <label for="end-date-time" class="modal-label">Ends</label>
                <date-time id="end-date-time" name="end-date-time" class="modal-date-time" min="2024-02-19T01:08" value="${iso_date}"></date-time>
            </div>
            <button type="submit" id="modal-save" class="modal-save">Save</button>
        </form>
        `;


        main_con.appendChild(modal_con);

        const modal_header = document.getElementById("modal-header");
        const close_button = document.getElementById("modal-header-close");
        const modal_form = document.getElementById("modal-form");
        const start_time_input = document.getElementById("start-date-time");
        const end_time_input = document.getElementById("end-date-time");
        
        start_time_input.addEventListener("input", (e) => {
            const start_time = new Date(start_time_input.value).getTime();
            const end_time = new Date(end_time_input.value).getTime();
            start_time_input.min = start_time_input.value;

            // if ()
            // console.log(start_time);
            // console.log(end_time);
            // if (e.target.value >)
        });

        dragElement(modal_con, modal_header, table);

        main_con.addEventListener("mousedown", modalCheck);

        close_button.addEventListener("click", (e) => {
            closeModal(e);
            active_modal = false;
        });

        modal_form.addEventListener("submit", (e) => {
            e.preventDefault();

            const form_data = Object.fromEntries(new FormData(e.target));
            console.log(form_data);

            // if (validateEvent(form_data)) {
            //     console.log("test");
            //     displayEvent(form_data)
            // }

            // saveDate(e);
            closeModal(e);
            active_modal = false;
        });

        function modalCheck(e) {
            if (!modal_con.contains(e.target)) {
                if (e.target.nodeName !== "TD" && 
                e.target.parentNode.nodeName !== "TD") {
                    active_modal = false;
                }
                else {
                    active_modal = true;
                }
        
                if (e.target !== td && e.target.parentNode !== td) {

                    closeModal(e);
                }
            }
        }

        function closeModal(e) {
            main_con.removeChild(modal_con);
            td.classList.remove("active-day");
            main_con.removeEventListener("click", closeModal);
            main_con.removeEventListener("mousedown", modalCheck);
        }

        const right_boundary = table.offsetLeft + table.offsetWidth;
        const max_left = right_boundary - modal_con.offsetWidth;
        console.log(max_left, table.offsetLeft)
        
        if (x + modal_con.offsetWidth > right_boundary) {
            x = max_left;
            
        }
        else {
            x = Math.min(Math.max(x, table.offsetLeft), max_left);
        }

        y = Math.min(
            Math.max(y, table.offsetTop), 
                table.offsetHeight + table.offsetTop - modal_con.offsetHeight
                );

        modal_con.style.left = x + "px";
        modal_con.style.top = y + "px";

    }
    else {
        active_modal = false;
    }
}


function displayEvent(data) {
    const title = data["modal-title"];

    const start_time = data["start-date-time"].slice(-5);
    const end_time = data["end-date-time"].slice(-5);
    
    const start_date = data["start-date-time"].slice(0, 10);
    const end_date = data["end-date-time"].slice(0, 10);
    
    // for (let i = )

    // console.log(title, start_date, start_time, end_date, end_time);

    // const date_element = querySelectorZZ 

}

function validateEvent(data) {
    const title = data["modal-title"];

    const start_time = data["start-date-time"].slice(-5);
    const end_time = data["end-date-time"].slice(-5);
    
    const start_date = data["start-date-time"].slice(0, 10);
    const end_date = data["end-date-time"].slice(0, 10);
    
    Object.values(data).forEach((value) => {
        if (value.length < 1) return false;
    });

    // console.log(title);

    
}
