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

    }

    createModal(parent) {
        this.parent = parent;
        this.element = createElementWithClass("div", ["calendar-modal"]);

        const x = this.parent.offsetLeft;
        const y = this.parent.offsetTop + this.parent.offsetHeight;

        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
        this.element.style.width = this.parent.offsetWidth + "px";
        this.parent.appendChild(this.element);


        document.addEventListener("mousedown", this.removeModal);
    }
    


    displayModal() {
        console.log(this.parent);
    }

    removeModal = (e) => {
        if (e.composedPath().includes(this.parent)) return;

        this.parent.removeChild(this.element);
        document.removeEventListener("mousedown", this.removeModal)
    } 

    test() {
        console.log(this);

    }
}


export { createElementWithClass, dragElement, toIsoStringLocale, padDigit, appendChildren, Calendar}