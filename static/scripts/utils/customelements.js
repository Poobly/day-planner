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
        this.value = this.getAttribute("value");

        const date_obj = new Date(this.value);
        this.date = date_obj.toLocaleString(undefined, {month: "short", day: "2-digit", year: "numeric"});
        this.time = date_obj.toLocaleString(undefined, {hour: "2-digit", minute: "2-digit"})

        const shadow = this.attachShadow({ mode: "open" });
        const text_con = document.createElement("div");

        const date_span = document.createElement("span");
        const time_span = document.createElement("span");
        date_span.classList.add("input");
        time_span.classList.add("input");

        date_span.contentEditable = true;
        time_span.contentEditable = true;

        // text.select();

        // text.maxWidth = ""


        // this.addEventListener("focusin", (e) => {
        //     if (this.disabled) {
        //         return;
        //     }
        //     else if (this.active) {
                
        //     }
        //     this.focusElement();
        // });

        // this.addEventListener("focusout", (e) => {
        //     this.unFocusElement();

        // });


        // this.addEventListener("keydown", (e) => {

        // });
    
        date_span.textContent = this.date;
        time_span.textContent = this.time;
        
        this.style.width = 100 + "%";

        const style = document.createElement("style");

        style.textContent = `
            :host {
                text-align: right;
            }

            .input:first-child {
                margin-right: 5px;
            }

            .input {
                border-radius: 5px;
                display: inline-block;
                background-color: rgba(0, 0, 0, 0.1);
                padding: 5px 10px;
            }
        `
        
        shadow.appendChild(date_span);
        shadow.appendChild(time_span);
        shadow.appendChild(style);
    }

    // get date() {
    //     return this.value.slice(0, 10);
    // }
    // set date(val) {
    //     return val;
    // }


    // get value() {
    //     return this.getAttribute("value");
    // }

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
    
    select() {
        const selection = Window.getSelection()
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

