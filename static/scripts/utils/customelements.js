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
        this.value_ = 0;
    }

    get form() { return this.internals_.form; }
    get name() { return this.getAttribute('name'); }
    get type() { return this.localName; }
    get validity() { return this.internals_.validity; }
    get validationMessage() { return this.internals_.validationMessage; }
    get willValidate() { return this.internals_.willValidate; }
  
    checkValidity() { return this.internals_.checkValidity(); }
    reportValidity() { return this.internals_.reportValidity(); }
}

customElements.define("date-time", DateTime);

