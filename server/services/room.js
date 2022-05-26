const sql = require("mssql");

const buildResponse = (response) => {
    const result = { error: null, data: null, code: null };

    if (response instanceof Error) {
        result.error = response.message;
    } else result.data = response;

    return result;
};

const bookRoom = async ({ reservation, user }) => {
    try {
        const availableRooms = await getAvailableRooms(reservation);

        if (!availableRooms || !availableRooms.length)
            throw new Error("Не вдалось знайти вільну кімнату");
            
        const userId = await insertGuest(user);
        if (!userId) throw new Error("Помилка при створенні користувача");
        

        const roomId = availableRooms[0].id;

        const result = await sql.query(
            `insert into reservation (room_id, guest_id, number_of_guest, check_in_date, check_out_date, date_of_reservation) values 
            ('${roomId}', '${userId}', '${reservation.guests}', '${
                reservation.start_date
            }', '${reservation.end_date}', '${new Date().toISOString()}'); 
            SELECT SCOPE_IDENTITY() AS id;`
        );

        if (!result.recordset[0].id) throw new Error("Internal server error");
        return buildResponse(result.recordset[0].id);
    } catch (error) {
        console.error("bookRoom error:", error);
        return buildResponse(error);
    }
};

const getAvailableRooms = async ({ room_type, start_date, end_date }) => {
    try {
        const result = await sql.query(
            `SELECT TOP 1 room.id from room LEFT JOIN reservation ON reservation.room_id = room.id where room.id not in(
                SELECT room_id from room JOIN reservation ON reservation.room_id = room.id where check_in_date >= '${start_date}' and check_out_date <= '${end_date}') and room.room_type = '${room_type}';`
        );
        if (!result.recordset || !result.recordset.length) return null;
        return result.recordset;
    } catch (error) {
        console.error("getAvailableRooms error:", error);
        return error;
    }
};

const insertGuest = async (user) => {
    try {
        const insertGuestResult = await sql.query(
            `insert into guest (firstname, lastname, phone, email) values ('${user.firstname}', '${user.lastname}', '${user.phone}', '${user.email}'); SELECT SCOPE_IDENTITY() AS id;`
        );
        return insertGuestResult.recordset[0].id;
    } catch (error) {
        console.error("insertGuest error:", error);
        return error;
    }
};

const getRooms = async () => {
    try {
        const result = await sql.query(`
        SELECT room_type, COUNT(description) AS [count], description, price FROM room
        GROUP BY room_type, description, price;`);
        if (!result.recordset || !result.recordset.length) return null;
        return result.recordset;
    } catch (error) {
        console.error("getRoom error:", error);
        return error;
    }
};

module.exports = {
    getRooms,
    bookRoom,
    getAvailableRooms,
};
