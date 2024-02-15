/**
 * TODO: - Add backend support, localstorage if not logged in
 * - create class or object for each day to add plans and store/display the time ranges
 * maybe locations as well
 */ 
const main_con = document.querySelector("main");
const table = document.getElementById("calendar-table");

const current_date = new Date;
let year = current_date.getFullYear();
let month = current_date.getMonth();
let current_day = current_date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});

const week_rows = Array.from(document.getElementsByClassName("table-week-row"));

const weeks_obj = {
    0 : week_rows[0],
    1 : week_rows[1],
    2 : week_rows[2],
    3 : week_rows[3],
    4 : week_rows[4],
    5 : week_rows[5]
}

const days_object = {}

function createDayObj(date, month, year, element, plans) {
    return {date, month, year, element, plans};
}

let date = new Date(year, month, 1);
let new_date = new Date(year, month, 1);

let weeks = 0;

const next_month_button = document.getElementById("calendar-asc-button");
const previous_month_button = document.getElementById("calendar-desc-button");

const table_title = document.getElementById("table-title")



function loadCalendar() {
    table_title.textContent = date.toLocaleString(undefined, {month : "long", year: "numeric"});
    while (date.getFullYear() === year && date.getMonth() === month) {



        /**
         * checks if it's first day of a month and if it isn't the first day of the week,
         * then it loops over how many days into the week the first day of the current month is
         * to then add in the previous month's days.
         */
        if (date.getDate() === 1 && date.getDay() !== 0 ) {
            for (let i = date.getDay(); i > 0; i--) {
                new_date.setDate(date.getDate() - i);
                
                const str_date = new_date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
                
                const last_month_element_con = createTableCell(new_date, str_date);

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
    
        const str_date = date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
        

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
                    str_date = new_date.toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
                    
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
    const td = document.createElement("td");
    const span = document.createElement("span");

    td.addEventListener("click", selectElement);

    td.classList.add("day-con");
    span.classList.add("day-date")

    td.dataset.date = str_date;

    span.textContent = date.getDate();
    
    if (str_date === current_day) td.classList.add("current-day");
    
    td.appendChild(span);
    return td;
}

let active_modal = false;
let active_element = false;


function selectElement(e) {

    if (!active_modal) {
        e.currentTarget.classList.add("active-day");
    }

    createModal(e.currentTarget);

}



function createModal(td) {
    if (!active_modal) {

        let modal_con = document.createElement("div");
        let modal_form = document.createElement("form");
        
        modal_con.classList.add("modal-con");
        modal_form.classList.add("modal-form");
        
        dragElement(modal_con);

        main_con.addEventListener("mousedown", function modalCheck(e) {
            if (!modal_con.contains(e.target)) {

                if (e.target.nodeName !== "TD" && 
                e.target.parentNode.nodeName !== "TD") {

                    active_modal = false;
                    console.log("test");
                }
                else {
                    active_modal = true;
                }
                
                if (e.target !== td && e.target.parentNode !== td) {
                    
                    main_con.removeChild(modal_con);
                    td.classList.remove("active-day");
                    main_con.removeEventListener("mousedown", modalCheck);
                }
            }
        });

        main_con.appendChild(modal_con);
        modal_con.appendChild(modal_form);
    }
    else {
        active_modal = false;
    }
}


function dragElement(element) {
    let offsetX = 0, offsetY = 0;
    element.addEventListener("mousedown", (e) => {
        e.preventDefault();
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        
        document.addEventListener("mousemove", moveElement);
        document.addEventListener("mouseup", removeListeners);
    })
    


    function moveElement(e) {
        e.preventDefault();
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        x = Math.min(Math.max(x, 0), window.innerWidth - element.offsetWidth);
        y = Math.min(Math.max(y, 0), window.innerHeight - element.offsetHeight);

        element.style.left = x + "px";
        element.style.top = y + "px";
    }

    function removeListeners() {
        document.removeEventListener("mousemove", moveElement);
        document.removeEventListener("mouseup", removeListeners);
    }

}