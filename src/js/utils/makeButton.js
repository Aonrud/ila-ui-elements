/**
 * Make a button element with the specified attributes and contents.
 * @protected
 * @param {string} name - the button name
 * @param {string} [css = ""] - classes to apply to the button element
 * @param {string} [text = ""] - the text content
 * @param {string} [title = ""] - the title attribute
 * @param {string} [icon = ""] - Add a span inside the button element with the given classes, if non-empty
 * @param {function} [handler = null] - The object with eventHandler to attach to the click event.
 * @param {string} [element = "button"] - The element to create (e.g. allows using an <a> instead).
 * @return {HTMLButtonElement}
 */
function makeButton(name, css = "", text = "", title = "", icon = "", handler = null, element = "button") {
    let el = document.createElement(element);
    el.id = `btn-${name}`;
    el.className = css;
    el.textContent = text;
    el.setAttribute("title", title)
    if (icon) {
        let i = document.createElement("span");
        i.className = icon;
        el.append(i);
    }
    if (element === "button") el.setAttribute("type", "button");
    if (handler) el.addEventListener("click", handler);
    return el;    
}

export {makeButton}
