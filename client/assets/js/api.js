import mockDB from "../../rooms_images_paths.json" assert { type: "json" };

const server = "http://localhost:3000";

export const fetchRooms = async () => {
    const result = await (await fetch(`${server}/api/rooms`)).json();
    if (!result.data) return null;

    const rooms = result.data.map((room) => {
        const roomItem = mockDB.find((el) => el.type === room.room_type);

        return {
            ...room,
            image_paths: roomItem?.image_paths || [],
        };
    });

    return rooms;
};

export const bookRoom = async (data) => {
    const result = await (
        await fetch(`${server}/api/rooms/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
        })
    ).json();

    return result;
};
