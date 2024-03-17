function createElementWithClass(tag, classes) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    return element
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

class Calendar {
    constructor() {
        this.date = new Date;
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.current_day = toIsoStringLocale(this.date).slice(0, 10);
    }

    createCalendar() {
        let date = new Date(this.year, this.month, 1);
        let new_date = new Date(this.year, this.month, 1);

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

        let weeks = 0;
        const days_object = {};
        // make row object 
        const weeks_obj = {};

        const cal_tbody = this.element.getRootNode().getElementById("modal-cal-tbody");
        const cal_title = this.element.getRootNode().getElementById("modal-cal-title");

        for (let i = 0; i <= 5; i++) {
            weeks_obj[i] = createElementWithClass("tr", ["modal-cal-day"]);
            cal_tbody.appendChild(weeks_obj[i]);
        }


        const createDayObj = (date, month, year, element, plans) => {
            return {date, month, year, element, plans};
        }

        const createTableCell = (date, str_date) => {
            const td = createElementWithClass("td", ["day-con"]);
            const span = createElementWithClass("span", ["day-date"]);
        
            
            td.dataset.date = str_date;
            span.textContent = date.getDate();

            if (date.getMonth() !== this.month) span.classList.add("unactive-date");
            if (str_date === this.current_day) td.classList.add("current-day");
            
            td.appendChild(span);
            return td;
        }

        cal_title.textContent = date.toLocaleString(undefined, { month: "long" });
        while (date.getFullYear() === this.year && date.getMonth() === this.month) {
    
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
        if (date.getMonth() !== this.month) {
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

}

class CalendarModal extends Calendar {
    constructor() {
        super();
    }

    createModal(parent) {
        this.parent = parent;
        this.shadowRoot = this.parent.getRootNode();
        this.element = createElementWithClass("div", ["datetime-modal"]);
        this.active_element = this.parent.getRootNode().activeElement;
        
        
        const x = this.parent.offsetLeft;
        const y = this.parent.offsetTop + this.parent.offsetHeight;
        
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
        this.parent.appendChild(this.element);
        
        if (this.parent.classList.contains("date-con")) {
            this.current_date = new Date(parent.textContent).toISOString().slice(0, 10);
            this.createCalendar();
            this.shadowRoot.querySelector(`.modal-cal td[data-date="${this.current_date}"]`).classList.add("selected-date");
        }
        else if (this.parent.classList.contains("time-con")) {
            this.createTimeMenu();
        }

        // add class to current date in calendar popup 
        
        this.active_element.addEventListener("blur", this.removeModal);
        // document.addEventListener("mousedown", this.switchModals, true);
        this.parent.addEventListener("mousedown", this.removeBlur);

        this.parent.addEventListener("click", this.handleClick);


    }

    // switchModals = (e) => {
    //     if (e.composedPath().includes(this.parent)) return;
    //     this.removeModal();
    //     document.removeEventListener("mousedown", this.switchModals, true);
    // }

    removeBlur = (e) => {
        if (e.composedPath().includes(this.parent) && e.target !== this.active_element) e.preventDefault();
    }

    removeModal = (e) => {
        this.parent.removeChild(this.element);
        this.parent.removeEventListener("mousedown", this.removeBlur);
        this.parent.removeEventListener("click", this.handleClick);
    } 

    handleClick = (e) => {
        const td = e.target.closest('td');

        if (td) {
            if (td.classList.contains("day-con")) {
                this.current_date = td.dataset.date;
                const date = new Date(this.current_date + "T00:00");
                this.active_element.textContent = date.toLocaleString(undefined, {month: "short", day: "2-digit", year: "numeric"});
            }
            else {
                
            }

            this.active_element.blur();
        }
    }

    displayModal() {

    }


    createTimeMenu() {
        this.element.innerHTML = `
        <div id="modal-time-con" class="modal-time-con flex"></div>
        `;

        const time_con = this.element.getRootNode().getElementById("modal-time-con");
        const minute_con = createElementWithClass("div", ["minute_con", "overflow", "flex", "col", "center"]);
        const hour_con = createElementWithClass("div", ["hour_con", "overflow", "flex", "col", "center"]);
        const am_pm_con = createElementWithClass("div", ["am_pm_con", "overflow", "flex", "col", "center"]);

        appendChildren(time_con, [hour_con, minute_con, am_pm_con]);
        let time = new Date();
        time.setHours(0, 0, 0);

        // stop using tables use 3 container column elements with spans inside. 

        for (let i = 0; i < 60; i++) {

            if (i <= 12) {
                const hours_span = createElementWithClass("span", ["time-text"]);
                hours_span.textContent = i
                hour_con.appendChild(hours_span);
            }
            
            const minutes_span = createElementWithClass("span", ["time-text"]);
            minutes_span.textContent = i;
            minute_con.appendChild(minutes_span);

            if (i < 2) {
                const am_pm_span = createElementWithClass("span", ["time-text"]);
                am_pm_span.textContent = (i === 0) ? "AM" : "PM";
                am_pm_con.appendChild(am_pm_span);
            }
        }

        // this.element.textContent

    }

    test() {
        console.log(this);

    }
}


export { createElementWithClass, dragElement, toIsoStringLocale, padDigit, appendChildren, Calendar, CalendarModal}