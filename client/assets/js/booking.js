import { select, createEl, getQueryParams, showAlert } from "./utils.js";
import { fetchRooms, bookRoom } from "./api.js";

(function () {
    "use strict";
    /**
     * Easy on scroll event listener
     */

    const getRoomData = (rooms, type) =>
        rooms.find((el) => el.room_type === type) || null;

    window.addEventListener("load", async () => {
        const { type } = getQueryParams();

        const rooms = await fetchRooms();

        const room = getRoomData(rooms, type);

        if (!room) return;

        select(".room_type_title").textContent = room.room_type;
        if (room.count === 0) {
            select(".room_type_description").textContent = "Номер не доступний";
        }
        select(".full_description").textContent = room.description;
        select(".price").innerHTML = `Ціна номера: <b>${room.price} гривень</b>`;

        const images = room.image_paths.map((path, i) => {
            const el = createEl("img");
            el.classList.add(
                "room-image",
                "d-block",
                `${i === 0 ? "main_image" : "secondary_image"}`
            );
            el.src = path;
            return el;
        });

        select(".images_container").append(images[0]);
        select(".secondary_images").append(...images.slice(1));

        // Form
        // Form
        // Form
        select(".book_form").onsubmit = async (e) => {
            e.preventDefault();
            if (room.count === 0) return null;
            const firstname = select(".user_firstname").value;
            const lastname = select(".user_lastname").value;
            const email = select(".user_email").value;
            const start_date = select("#start_date").value;
            const end_date = select("#end_date").value;
            // const comment = select(".user_comment").value;
            const phone = select(".user_phone").value;
            const guests = select("#guests").value;

            const user = { firstname, lastname, email, phone };
            const reservation = {
                start_date,
                end_date,
                guests,
                room_type: type,
            };

            const result = await bookRoom({ user, reservation });

            if (result.error) showAlert(result.error, "danger");
            else if (result.data) showAlert("Кімнату заброньовано!", "success");
        };
        // end form
    });

    window.addEventListener("load", () => {});
})();
