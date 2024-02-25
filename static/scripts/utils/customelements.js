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
    static get observedAttributes() {
        return ["required", "value"];
    }
   
    get disabled() {
        return this.hasAttribute('disabled');
      }
    
    set disabled(v) {
        if (v) {
          this.setAttribute('disabled', '');
        } else {
          this.removeAttribute('disabled');
        }
    }

    constructor() {
        super();
        this.internals_ = this.attachInternals();
    }
    
    connectedCallback() {
        this.attachShadow({ mode: "open", delegatesFocus: true });
        this.addEventListener("input", this.updateValue);
        this.value = this.getAttribute("value");

        const date_obj = new Date(this.value);
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
                display: block;
                border-radius: 5px;
                background-color: rgba(0, 0, 0, 0.1);

                padding: 5px 10px;
            }

            .input {
                display: block;
                text-align: center;
                overflow: auto;
                scrollbar-width: none;
                white-space: nowrap;
            }

            .input br {
                display: none;
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
        const form = this.internals_.form;
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }
    
    handleFormSubmit(event) {
        // Prevent default form submission behavior
        event.preventDefault();
    
        // Access the form data and perform any necessary actions
        // this.value = this.getAttribute("")
        this.internals_.setFormValue(this.value);

        // console.log('Form submitted with data:', formData);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.disabled) {

        }
        else {

        }

    }

    

    createInputs(date, time) {
        this.date_con = document.createElement("div");
        this.time_con = document.createElement("div");
        const date_wrapper = document.createElement("span");
        const time_wrapper = document.createElement("span");
        const date_span = document.createElement("span");
        const time_span = document.createElement("span");

        this.date_con.classList.add("input-con", "date-con");
        this.time_con.classList.add("input-con", "time-con");
        date_span.classList.add("input", "date");
        time_span.classList.add("input", "time");

        date_span.contentEditable = true;
        time_span.contentEditable = true;



        date_span.textContent = date;
        time_span.textContent = time;
        date_span.max = date.length;
        time_span.max = time.length;


        this.shadowRoot.appendChild(this.date_con);
        this.shadowRoot.appendChild(this.time_con);
        this.date_con.appendChild(date_span);
        this.time_con.appendChild(time_span);

        
        this.addInputListeners(date_span);
        this.addInputListeners(time_span);

    }

    updateValue() {
        this.value = `${this.date_con.innerText} ${this.time_con.innerText}`;
    }

    generateCalendar() {

    }

    displayCalendar() {

    }

    // pasteText(element, text) {
    //     const event = new ClipboardEvent('paste', {
    //         bubbles: true,
    //         cancelable: true,
    //         composed: true,
    //         data: text
    //     });
    //     element.dispatchEvent(event);
    // }

    // selects all text in an element
    selectText(element) {
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }


    addInputListeners(element) {

        const pasteHandler = (e) => {
            e.preventDefault();
            const element = e.target;
            const paste = (e.clipboardData || window.clipboardData).getData("text/plain");
            const selection = (this.shadowRoot && this.shadowRoot.getSelection) ? this.shadowRoot.getSelection() : window.getSelection();
            const text_node = document.createTextNode(paste);
            
            const range = selection.getRangeAt(0);
            
            if (range) {
                range.deleteContents();
            }
            
            range.insertNode(text_node);
            
            const elementRect = element.getBoundingClientRect();
            const caretRect = range.getBoundingClientRect();
            
            
            range.setStartAfter(text_node);
            
            selection.removeAllRanges();
            selection.addRange(range);
            
            element.scrollLeft += caretRect.right - elementRect.right;
        }

        element.addEventListener("paste", pasteHandler);

        element.addEventListener("focus", (e) => {
            if (this.disabled) {
                return;
            }
            else if (this.active) {
                
            }
            this.selectText(e.target);
        });
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

