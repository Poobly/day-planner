function createElementWithClass(tag, classes) {
    const element = document.createElement(tag);
    element.classList.add(classes);
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

        const cal_con = createElementWithClass("div", ["modal-cal-con"]);
        const cal_table = createElementWithClass("table", ["modal-cal"]);
        const cal_thead = createElementWithClass("thead", ["modal-cal-thead"]);
        const cal_header = createElementWithClass("div", ["modal-cal-container"]);
        const cal_title = createElementWithClass("h5", ["modal-cal-title"]);
        const cal_tbody = createElementWithClass("tbody", ["modal-cal-tbody"]);

        let weeks = 0;
        const days_object = {};
        // make row object 
        const weeks_obj = {};

        for (let i = 0; i <= 5; i++) {
            weeks_obj[i] = createElementWithClass("tr", ["modal-cal-day"]);
            cal_tbody.appendChild(weeks_obj[i]);
        }
        console.log(weeks_obj)

        this.element.appendChild(cal_con);
        cal_con.appendChild(cal_table);
        appendChildren(cal_table, [cal_thead, cal_tbody]);

        const createDayObj = (date, month, year, element, plans) => {
            return {date, month, year, element, plans};
        }

        const createTableCell = (date, str_date) => {
            const td = createElementWithClass("td", ["day-con"]);
            const span = createElementWithClass("span", ["day-date"]);
        
            // td.addEventListener("click", selectCalendarElement);
            
            td.dataset.current_date = str_date;
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
        this.element = createElementWithClass("div", ["calendar-modal"]);

        const x = this.parent.offsetLeft;
        const y = this.parent.offsetTop + this.parent.offsetHeight;

        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
        this.parent.appendChild(this.element);

        this.createCalendar();
        this.parent.firstChild.addEventListener("blur", this.switchModals);


        console.log(this.parent);

    }
    switchModals = (e) => {
        this.removeModal(e);

        this.parent.firstChild.removeEventListener("blur", this.switchModals)
    }


    displayModal() {

    }

    removeModal = (e) => {
        e.target.parentNode.removeChild(this.element);
        
    } 
    moveModal = (e) => {
        console.log("test");
        e.target.parentNode.removeChild(this.element);
        e.relatedTarget.focus();
        e.relatedTarget.click();
    }


    test() {
        console.log(this);

    }
}


export { createElementWithClass, dragElement, toIsoStringLocale, padDigit, appendChildren, Calendar, CalendarModal}