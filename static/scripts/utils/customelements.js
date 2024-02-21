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
        this.addEventListener("mousedown", (e) => {
            if (this.disabled) {
                return;
            }
            else if (this.active)
            this.focusElement();
        });
        const shadow = this.attachShadow({ mode: "open" });
        const text = document.createElement("span");        
        text.textContent = this.value;
        // this.innerText = this.getAttribute("value");
        
        this.style.width = 100 + "%";
        this.style.backgroundColor = "white";
        this.style.border = "1px solid black";
        const style = document.createElement("style");
        
        style.textContent = `
        
        `
        // const input = document.createElement("input");
        
        shadow.appendChild(text);
    }


    get value() {
        return this.getAttribute("value");
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

    focusElement() {
        this.style.outline = "1px solid black";
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

