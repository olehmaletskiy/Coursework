// THIS IS Server
const express = require("express"); //  express the same as server
const cors = require("cors");

require("dotenv").config();
require("./db");

const {
    getRooms,
    bookRoom,
    getAvailableRooms,
    getRoomsCount,
} = require("./services/room");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/api/rooms", async (request, response) => {
    const rooms = await getRooms();
    return response.send({ data: rooms });
});

app.get("/api/rooms/available", async (request, response) => {
    const rooms = await getAvailableRooms();
    return response.send({ data: rooms });
});

app.post("/api/rooms/book", async (request, response) => {
    const reservationData = request.body;
    // simple validation
    if (!reservationData.reservation || !reservationData.user) {
        return response.status(400).send({ error: "Invalid data" });
    }
    const result = await bookRoom(reservationData);
    response.send(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
