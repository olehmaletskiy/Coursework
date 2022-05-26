// This is just file with 'helper' functions 

/**
 * selects element from DOM
 */
export const select = (el, all = false) => {
    el = el.trim();
    if (all) {
        return [...document.querySelectorAll(el)];
    } else {
        return document.querySelector(el);
    }
};

/**
 * Easy event listener function
 */
export const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
        if (all) {
            selectEl.forEach((e) => e.addEventListener(type, listener));
        } else {
            selectEl.addEventListener(type, listener);
        }
    }
};

export const createEl = (type) => document.createElement(type);

export const getQueryParams = () =>
    new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

export const showAlert = (text, type) => {
    const html = `
    <div class="alert alert-${type}" role="alert">
        ${text}
    </div>`;
    const container = select(".error-container");
    container.style.display = "block";
    select(".error-container").innerHTML = html;
    container.onclick = () => (container.style.display = "none");

    setTimeout(() => {
        container.style.display = "none";
    }, 7000);
};
