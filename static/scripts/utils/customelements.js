class Tooltip extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {

    }
}
customElements.define("tool-tip", Tooltip);


class DateTime extends HTMLElement {
    static formAssociated = true;
    constructor() {
        super();
        this.internals_ = this.attachInternals();

        
    }
    
    connectedCallback() {
        this.attachShadow({ mode: "open" });

        const value = this.getAttribute("value");
        const date_obj = new Date(value);
        const date = date_obj.toLocaleString(undefined, {month: "short", day: "2-digit", year: "numeric"});
        const time = date_obj.toLocaleString(undefined, {hour: "2-digit", minute: "2-digit"});

        this.createInputs(date, time);
        
        this.style.width = 100 + "%";

        const style = document.createElement("style");

        style.textContent = `
            * {
                box-sizing: border-box;
            }

            .input-con {
                display: inline-block;
                border-radius: 5px;
                background-color: rgba(0, 0, 0, 0.1);
                text-align: center;
                padding: 5px 10px;

            }

            .input {
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .date {
                max-width: ${date.length}ch;
                min-width: ${date.length}ch;
            }

            .time {
                max-width: ${time.length}ch;
                min-width: ${time.length}ch;
            }

        `


        this.shadowRoot.appendChild(style);
    }

    attributeChangedCallback() {
        console.log(value);
    }

    selectText(element) {
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(val) {
        if (val) {
          this.setAttribute('disabled', '');
        } else {
          this.removeAttribute('disabled');
        }
    }

    // focusElement() {

    //     this.style.outline = "1px solid black";
    // }

    // unFocusElement() {
    //     this.style.outline = "";
    // }
    

    createInputs(date, time) {
        const date_con = document.createElement("div");
        const time_con = document.createElement("div");
        const date_span = document.createElement("span");
        const time_span = document.createElement("span");

        date_con.classList.add("input-con", "date-con");
        time_con.classList.add("input-con", "time-con");
        date_span.classList.add("input", "date");
        time_span.classList.add("input", "time");

        date_con.contentEditable = true;
        time_con.contentEditable = true;



        date_span.textContent = date;
        time_span.textContent = time;
        date_span.max = date.length;
        time_span.max = time.length;

        date_con.addEventListener("focusin", (e) => {
            if (this.disabled) {
                return;
            }
            else if (this.active) {
                
            }
            console.log(e.target);
            this.selectText(e.target);
        });
        time_con.addEventListener("focusin", (e) => {
            if (this.disabled) {
                return;
            }
            else if (this.active) {
                
            }
            console.log(e.target);
            this.selectText(e.target);
        });
    
        this.shadowRoot.appendChild(date_con);
        this.shadowRoot.appendChild(time_con);
        date_con.appendChild(date_span);
        time_con.appendChild(time_span);

    }

    generateCalendar() {

    }

    displayCalendar() {

    }


    // get form() { return this.internals_.form; }
    // get name() { return this.getAttribute('name'); }
    // get type() { return this.localName; }
    // get validity() { return this.internals_.validity; }
    // get validationMessage() { return this.internals_.validationMessage; }
    // get willValidate() { return this.internals_.willValidate; }
  
    // checkValidity() { return this.internals_.checkValidity(); }
    // reportValidity() { return this.internals_.reportValidity(); }
}

customElements.define("date-time", DateTime);

