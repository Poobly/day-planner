function createElementWithClass(tag, classes) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    return element
}

async function loggedIn() {
    let logged;
    await fetch("/api/user/loggedin")
    .then(response => response.json())
    .then(python_data => logged = python_data);
    if (logged == "1") return true;
    else return false;
}

function dragElement(element, element_header, border_element) {
    let offsetX = 0, offsetY = 0;
    element_header.addEventListener("mousedown", (e) => {
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

        x = Math.min(Math.max(x, border_element.offsetLeft), (border_element.offsetWidth + border_element.offsetLeft) - element.offsetWidth);
        y = Math.min(Math.max(y, border_element.offsetTop), (border_element.offsetHeight + border_element.offsetTop) - element.offsetHeight);

        element.style.left = x + "px";
        element.style.top = y + "px";
    }

    function removeListeners() {
        document.removeEventListener("mousemove", moveElement);
        document.removeEventListener("mouseup", removeListeners);
    }

}

function toIsoStringLocale(date) {
    return date.getFullYear() + 
    "-" + padDigit(date.getMonth() + 1) + 
    "-" + padDigit(date.getDate()) + 
    "T" + padDigit(date.getHours()) + 
    ":" + padDigit(date.getMinutes());
}

function padDigit(number) {
    return String(number).padStart(2, "0");
}

function appendChildren(parent, children) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < children.length; i++) frag.appendChild(children[i]);
    parent.appendChild(frag);
}


function checkHalfOfDay(hours, time_of_day) {
    let temp = "";
    hours = Number(hours);
    for (let i = 0; i < time_of_day.length; i++) {
        if (time_of_day[i] === "a" || time_of_day[i] === "A") temp = "A";
        else if (time_of_day[i] === "p" || time_of_day[i] === "P") temp = "P";
    }
    switch (temp) {
        case "A":
            break;
        case "P":
            hours = Number(hours) + 12;
            break;
    }
    return hours;
}

class Calendar {
    constructor() {
        const date = new Date;
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.current_day = toIsoStringLocale(date).slice(0, 10);
        this.focus = true;
    }

    createCalendar() {
        this.date = new Date(this.year, this.month, 1);
        this.new_date = new Date(this.year, this.month, 1);

        this.element.innerHTML = `
        <div class="modal-cal-con">
            <div class="modal-cal-header">
                <button id="prev-button" class="modal-cal-button">
                    <svg class="cal-controls-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>chevron-left</title>
                        <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                    </svg>
                </button>
                <h4 id="modal-cal-title" class="modal-cal-title"><h5>
                <button id="next-button" class="modal-cal-button">
                    <svg class="cal-controls-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>chevron-right</title>
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                    </svg>
                </button>
            </div>
            <table class="modal-cal">
                <thead id="modal-cal-thead" class="modal-cal-thead">
                    <tr>
                        <th class="modal-cal-header-days">Sun</th>
                        <th class="modal-cal-header-days">Mon</th>
                        <th class="modal-cal-header-days">Tue</th>
                        <th class="modal-cal-header-days">Wed</th>
                        <th class="modal-cal-header-days">Thu</th>
                        <th class="modal-cal-header-days">Fri</th>
                        <th class="modal-cal-header-days">Sat</th>
                    </tr>
                </thead>
                <tbody id="modal-cal-tbody" class="modal-cal-tbody"><tbody>
            </table>
        </div>
        `;
        const root = this.element.getRootNode(); 
        if (!this.focus) {
            root.getElementById("prev-button").tabIndex = -1;
            root.getElementById("next-button").tabIndex = -1;
        } 

        this.weeks = 0;
        this.days_object = {};

        this.cal_title = root.getElementById("modal-cal-title");
        const cal_tbody = root.getElementById("modal-cal-tbody");

        this.weeks_obj = {}
        for (let i = 0; i <= 5; i++) {
            this.weeks_obj[i] = createElementWithClass("tr", ["modal-cal-week"]);
            cal_tbody.appendChild(this.weeks_obj[i]);
        }

        this.loadCalendar();
    } 
    

    createDayObj = (date, month, year, element, plans) => {
        return {date, month, year, element, plans};
    }

    createTableCell = (date, str_date) => {
        const td = createElementWithClass("td", ["day-con"]);
        const span = createElementWithClass("span", ["day-date"]);
    
        
        td.dataset.date = str_date;
        span.textContent = date.getDate();

        if (date.getMonth() !== this.month) span.classList.add("unactive-date");
        if (str_date === this.current_day) td.classList.add("current-day");
        
        td.appendChild(span);
        return td;
    }

    loadCalendar() {
        this.cal_title.textContent = this.date.toLocaleString(undefined, { month: "long" });
        while (this.date.getFullYear() === this.year && this.date.getMonth() === this.month) {
    
            /**
             * checks if it's first day of a month and if it isn't the first day of the week,
             * then it loops over how many days into the week the first day of the current month is
             * to then add in the previous month's days.
             */
            if (this.date.getDate() === 1 && this.date.getDay() !== 0 ) {
                for (let i = this.date.getDay(); i > 0; i--) {
                    this.new_date.setDate(this.date.getDate() - i);
                    
                    const str_date = toIsoStringLocale(this.new_date).slice(0, 10);
                    
                    const last_month_element_con = this.createTableCell(this.new_date, str_date);
    
                    this.days_object[str_date] = this.createDayObj(
                        this.new_date.getDate(), 
                        this.new_date.getMonth(), 
                        this.new_date.getFullYear(), 
                        last_month_element_con
                        );
                    this.weeks_obj[this.weeks].appendChild(last_month_element_con);
        
                    this.new_date.setDate(this.new_date.getDate() + i);
                }
            }
        
            const str_date = toIsoStringLocale(this.date).slice(0, 10);
            
    
            const day_element_con = this.createTableCell(this.date, str_date);
            
            this.weeks_obj[this.weeks].appendChild(day_element_con);
        
            this.days_object[str_date] = this.createDayObj(this.date.getDate(), this.date.getMonth(), this.date.getFullYear(), day_element_con);
        
            if (this.date.getDay() === 6) {
                this.weeks++;
            }
            this.date.setDate(this.date.getDate() + 1);
    
        }
    
    
        
        // checks if current month is not the same as starting month, and it will fill in the spaces in the calendar that belong to next month.
        if (this.date.getMonth() !== this.month) {
            this.new_date.setDate(this.date.getDate());
            this.new_date.setMonth(this.date.getMonth());
    
            if (this.new_date.getMonth() === 0) this.new_date.setFullYear(this.new_date.getFullYear() + 1);
    
            for (let i = this.weeks; i < 6 && this.new_date.getDay() <= 6; i++) {
                for (let j = 0; j < 7; j++) {
                    if (this.new_date.getDay() >= j) {
                        const str_date = toIsoStringLocale(this.new_date).slice(0, 10);
                        
                        const new_month_element_con = this.createTableCell(this.new_date, str_date);
    
                        this.days_object[str_date] = this.createDayObj(
                            this.new_date.getDate(), 
                            this.new_date.getMonth(), 
                            this.new_date.getFullYear(), 
                            new_month_element_con
                            );
                        
                        
                        this.weeks_obj[i].appendChild(new_month_element_con);
    
    
    
                        this.new_date.setDate(this.new_date.getDate() + 1); 
                    }
        
                }
            }
        }
    }

}

class CalendarModal extends Calendar {
    constructor() {
        super();
    }

    createModal(parent) {
        this.focus = false;
        
        this.parent = parent;
        this.shadowRoot = this.parent.getRootNode();
        this.element = createElementWithClass("div", ["datetime-modal"]);
        this.active_element = this.parent.getRootNode().activeElement;
        
        this.element.tabIndex = -1;
        
        const x = this.parent.offsetLeft;
        const y = this.parent.offsetTop + this.parent.offsetHeight;
        
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
        this.parent.appendChild(this.element);
        
        if (this.parent.classList.contains("date-con")) {
            this.current_date = new Date(parent.textContent);
            
            // if (this.current_date == "Invalid Date") {
            //     this.current_date = new Date;
            //     this.active_element.textContent = this.current_date.toLocaleString(undefined, {month: "short", day: "2-digit", year: "numeric"});
            // }
            this.month = this.current_date.getMonth();
            this.year = this.current_date.getFullYear();

            this.createCalendar();
            this.activeDate();
        }
        else if (this.parent.classList.contains("time-con")) {
            this.current_time = parent.textContent.slice(0, 5);
            this.createTimeMenu();
        }

        // add class to current date in calendar popup 
        this.active_element.addEventListener("blur", (e) => {

            if (this.current_date && e.currentTarget.classList.contains("date")) {
                this.active_element.textContent = this.current_date.toLocaleString(undefined, {month: "short", day: "2-digit", year: "numeric"});
                this.month = this.current_date.getMonth();
                this.year = this.current_date.getFullYear(); 
            }
            this.removeModal(e);
        }, { once: true });
        
        this.parent.addEventListener("mousedown", this.removeBlur);

        this.parent.addEventListener("click", this.handleClick);

        this.active_element.addEventListener("input", this.checkInput);
    }

    checkInput = (e) => {
        const input_date = new Date(this.active_element.textContent);

        if (input_date == "Invalid Date") return;
        
        this.current_date = input_date;
        this.month = this.current_date.getMonth();
        this.year = this.current_date.getFullYear(); 
        this.createCalendar();
        this.activeDate();
    }

    removeBlur = (e) => {
        if (e.composedPath().includes(this.parent) && e.target !== this.active_element) e.preventDefault();
    }

    activeDate = () => {
        const elements = this.shadowRoot.querySelectorAll(".modal-cal td");
        for (let element of elements) {
            if (element.classList.contains("selected-date")) element.classList.remove("selected-date");
            if (element.dataset.date === this.current_day) element.classList.add("current-date");
            if (element.dataset.date === this.current_date.toISOString().slice(0, 10)) element.classList.add("selected-date");
        }
    }

    removeModal = (e) => {
        this.parent.removeChild(this.element);
        this.parent.removeEventListener("mousedown", this.removeBlur);
        this.parent.removeEventListener("click", this.handleClick);
        this.active_element.removeEventListener("input", this.checkInput);
    } 

    handleClick = (e) => {
        const td = e.target.closest("td");
        const span = e.target.closest("span");
        const button = e.target.closest("button");

        if (button) {
            if (button.id === "prev-button") {
                this.month--;
                this.weeks = 0;
                this.checkYear();

                Object.values(this.weeks_obj).forEach(element => {
                    element.textContent = "";
                });
                this.date = new Date(this.year, this.month, 1);
                this.new_date = new Date(this.year, this.month, 1);      
                this.loadCalendar();      
            }
            else if (button.id === "next-button") {
                this.month++;
                this.weeks = 0;
                this.checkYear();

                Object.values(this.weeks_obj).forEach(element => {
                    element.textContent = "";
                });
                this.date = new Date(this.year, this.month, 1);
                this.new_date = new Date(this.year, this.month, 1);  
                this.loadCalendar();
            }
            this.activeDate();
        }

        if (td) {
            if (td.classList.contains("day-con")) {
                this.current_date = new Date(td.dataset.date + "T00:00");
                this.active_element.blur();
            }
        }
        if (span) {
            if (span.classList.contains("time-text")) {



                this.setTimeText(span);

                // this.active_element.textContent = time.toLocaleString(undefined, {hour: "2-digit", minute: "2-digit"});
                this.active_element.blur();
            }
        }

    }

    setTimeText(ele) {
        const text = this.active_element.textContent;
        const time = new Date();
        const hours = checkHalfOfDay(text.slice(0, 2), text.slice(6));

        time.setHours(hours, text.slice(3, 5), 0);


        if (ele.parentNode.id == "hour_con") {
            time.setHours(ele.textContent);
        }
        else if (ele.parentNode.id == "minute_con") {
            time.setMinutes(ele.textContent);
        }
        else if (ele.parentNode.id == "time_period_con") {
            console.log("test");
            time.setHours(checkHalfOfDay(text.slice(0, 2), ele.textContent));
        }
        this.active_element.textContent = time.toLocaleString(undefined, {hour: "2-digit", minute: "2-digit"});
    }

    checkYear() {
        if (this.month > 11) {
            this.year++;
            this.month = 0;
        }
        else if (this.month < 0) {
            this.year--;
            this.month = 11;
        }
    }



    
    createTimeMenu() {
        this.element.innerHTML = `
        <div id="modal-time-con" class="modal-time-con flex">
            <div id="hour_outer_con" class="time_input_outer_con"></div>
            <div id="minute_outer_con" class="time_input_outer_con"></div>
            <div id="time_period_outer_con" class="time_input_outer_con"></div>
        </div>
        `;

        const time_con = this.shadowRoot.getElementById("modal-time-con");
        const hour_outer_con = this.shadowRoot.getElementById("hour_outer_con");
        const minute_outer_con = this.shadowRoot.getElementById("minute_outer_con");
        const time_period_outer_con = this.shadowRoot.getElementById("time_period_outer_con");


        const hour_con = createElementWithClass("div", ["time_input_con", "flex", "col", "center"]);
        hour_con.id = "hour_con";
        const minute_con = createElementWithClass("div", ["time_input_con", "flex", "col", "center"]);
        minute_con.id = "minute_con";
        const time_period_con = createElementWithClass("div", ["time_input_con", "flex", "col", "center"]);
        time_period_con.id = "time_period_con";
        const select_bar = createElementWithClass("div", ["select-bar"]);

        appendChildren(time_con, [select_bar, hour_outer_con, minute_outer_con, time_period_outer_con]);
        hour_outer_con.appendChild(hour_con);
        minute_outer_con.appendChild(minute_con);
        time_period_outer_con.appendChild(time_period_con);


        let hour = this.active_element.textContent.slice(0, 2);
        let minute = this.active_element.textContent.slice(3, 5);
        
        const time = new Date()
        time.setHours(hour, minute)


        for (let i = 0; i < 60; i++) {

            if (i < 13) {
                const hours_span = createElementWithClass("span", ["time-text"]);
                hours_span.textContent = i
                hours_span.dataset.hour = i;
                hour_con.appendChild(hours_span);
                
            }
            
            const minutes_span = createElementWithClass("span", ["time-text"]);
            minutes_span.textContent = i;
            minutes_span.dataset.minute = i;
            minute_con.appendChild(minutes_span);

            if (i < 2) {
                const time_period_span = createElementWithClass("span", ["time-text"]);
                time_period_span.textContent = (i === 0) ? "AM" : "PM";
                time_period_span.dataset.timePeriod = time_period_span.textContent;
                time_period_con.appendChild(time_period_span);
            }
            
        }

        let current_time_period_span;

        if (checkHalfOfDay(time.getHours(), this.active_element.textContent.slice(6)) < 12) {
            current_time_period_span = this.shadowRoot.querySelector(`[data-time-period="AM"]`);
        }
        else {
            current_time_period_span = this.shadowRoot.querySelector(`[data-time-period="PM"]`);
        }

        const current_hour_span = this.shadowRoot.querySelector(`[data-hour="${time.getHours()}"]`);
        const current_minute_span = this.shadowRoot.querySelector(`[data-minute="${time.getMinutes()}"]`);



        hour_con.style.top = (hour_outer_con.offsetHeight / 2) - current_hour_span.offsetTop - (current_hour_span.offsetHeight / 2) + "px";
        minute_con.style.top = (minute_outer_con.offsetHeight / 2) - current_minute_span.offsetTop - (current_minute_span.offsetHeight / 2) + "px";
        time_period_con.style.top = (time_period_outer_con.offsetHeight / 2) - current_time_period_span.offsetTop - (current_time_period_span.offsetHeight / 2) + "px";
        
        
        select_bar.style.height = current_hour_span.offsetHeight + "px";

        time_con.addEventListener("wheel", (e) => {
            e.preventDefault(); 
            
            if (e.target.querySelector(".time-text") || e.target.classList.contains("time-text")) {
                const container = e.target.closest(".time_input_con") || e.target.firstChild;

                if (e.deltaY < 0) {

                    // choose smaller  number between container top + height of text element within + 5 for the gap and select bar center
                    const y = Math.min(select_bar.offsetTop - (select_bar.offsetHeight / 2), container.offsetTop + (container.firstChild.offsetHeight + 5))
                    container.style.top = y + "px"; 
                }
                else if (e.deltaY > 0) {

                    //  choose bigger number between the position of last element and the position of next element relative to the top of the container.
                    const y = Math.max((select_bar.offsetTop - container.offsetHeight) + (select_bar.offsetHeight / 2), container.offsetTop - (container.firstChild.offsetHeight + 5));
                    container.style.top = y + "px"; 
                }
                const selected_element = this.shadowRoot.elementFromPoint(
                    container.getBoundingClientRect().left + (container.offsetWidth / 2), 
                    select_bar.getBoundingClientRect().top + (select_bar.offsetHeight / 2)
                    );

                this.setTimeText(selected_element);
                // console.log(container);
                if (container.id == "hour_con") {

                    time.setHours(checkHalfOfDay(selected_element.textContent, this.active_element.textContent.slice(6)));
                    if (checkHalfOfDay(time.getHours(), this.active_element.textContent.slice(6)) < 12) {
                        current_time_period_span = this.shadowRoot.querySelector(`[data-time-period="AM"]`);
                    }
                    else {
                        current_time_period_span = this.shadowRoot.querySelector(`[data-time-period="PM"]`);
                    }
                    console.log(current_time_period_span);
                    time_period_con.style.top = (time_period_outer_con.offsetHeight / 2) - current_time_period_span.offsetTop - (current_time_period_span.offsetHeight / 2) + "px";
                }
            }
        })
    }

    test() {


    }
}


export { 
    createElementWithClass, 
    dragElement, 
    toIsoStringLocale, 
    padDigit, 
    appendChildren, 
    Calendar, 
    CalendarModal, 
    loggedIn
}