import { on, select } from "./utils.js";
import { fetchRooms } from "./api.js";

(function () {
    "use strict";
    /**
     * Easy on scroll event listener
     */
    const onscroll = (el, listener) => {
        el.addEventListener("scroll", listener);
    };

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select("#navbar .scrollto", true);
    const navbarlinksActive = () => {
        let position = window.scrollY + 200;
        navbarlinks.forEach((navbarlink) => {
            if (!navbarlink.hash) return;
            let section = select(navbarlink.hash);
            if (!section) return;
            if (
                position >= section.offsetTop &&
                position <= section.offsetTop + section.offsetHeight
            ) {
                navbarlink.classList.add("active");
            } else {
                navbarlink.classList.remove("active");
            }
        });
    };
    window.addEventListener("load", navbarlinksActive);
    onscroll(document, navbarlinksActive);

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let header = select("#header");
        let offset = header.offsetHeight;

        let elementPos = select(el).offsetTop;
        window.scrollTo({
            top: elementPos - offset,
            behavior: "smooth",
        });
    };

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select("#header");
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add("header-scrolled");
            } else {
                selectHeader.classList.remove("header-scrolled");
            }
        };
        window.addEventListener("load", headerScrolled);
        onscroll(document, headerScrolled);
    }

    /**
     * Back to top button
     */
    let backtotop = select(".back-to-top");
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add("active");
            } else {
                backtotop.classList.remove("active");
            }
        };
        window.addEventListener("load", toggleBacktotop);
        onscroll(document, toggleBacktotop);
    }

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on(
        "click",
        ".scrollto",
        function (e) {
            if (select(this.hash)) {
                e.preventDefault();

                let navbar = select("#navbar");
                if (navbar.classList.contains("navbar-mobile")) {
                    navbar.classList.remove("navbar-mobile");
                    let navbarToggle = select(".mobile-nav-toggle");
                    navbarToggle.classList.toggle("bi-list");
                    navbarToggle.classList.toggle("bi-x");
                }
                scrollto(this.hash);
            }
        },
        true
    );

    const onBookClick = (event) => {
        const type = event.target.dataset.type;
        console.log(type);
        window.location.href = `book_room.html?type=${type}`;
    };

    const createRooms = (rooms) => {
        const container = select(".carousel-inner");
        let html = container.innerHTML;
        rooms.forEach((room, i) => {
            html += `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
                <img src="${
                    room.image_paths[0]
                }" class="room-image d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${room.room_type}</h5>
                    <p>${room.description}</p>
                    <button type="button" data-type="${room.room_type}" class="btn btn-dark book_btn">Забронювати</button>
                </div>
            </div>`;
        });

        container.innerHTML = html;
        on("click", ".book_btn", onBookClick, true);
    };

    const generateRooms = async () => {
        const rooms = await fetchRooms();
        createRooms(rooms);
    };

    window.addEventListener("load", generateRooms);
})();
