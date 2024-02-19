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




export { createElementWithClass, dragElement, toIsoStringLocale, padDigit, appendChildren}