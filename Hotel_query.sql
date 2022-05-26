USE hotel;

--ГІСТЬ

--Який номер певної категорії є вільний в певний період 1 і 2 юз кейс.
SELECT TOP 1 room.id AS [Номер кімнати], room_type AS [Тип кімнати]  from room 
LEFT JOIN reservation ON reservation.room_id = room.id where room.id not in
(SELECT room_id from room JOIN reservation ON reservation.room_id = room.id 
where check_in_date >= '2022-06-07' and check_out_date <= '2022-06-20') and room.room_type = 'Люкс';

--Введенння особистих даних
INSERT INTO guest(id, firstname, lastname, phone, email, discount) VALUES (51, 'Василина','Коваль','+380685256987','koval1@gmail.com',0);

--Бронювання кімнати
INSERT INTO reservation (id, room_id, guest_id, amenity_id, number_of_guest, check_in_date, check_out_date, manager_id, date_of_reservation)
VALUES (21, 59, 29, 1, 1, '2022-07-29', '2022-08-02', 2, '2022-05-19');

--Перегляд бронювання
SELECT reservation.id AS [Номер бронювання], guest.firstname AS [Ім'я гостя], guest.lastname AS [Прізвише], room.id AS [Номер], room.room_type AS [Тип номеру], reservation.check_in_date AS [З], reservation.check_out_date AS [По], datediff(DAY, check_in_date, check_out_date) AS [Кількість ночей], date_of_reservation AS [Дата резервації]
FROM reservation 
JOIN guest ON guest.id = reservation.guest_id
JOIN room ON reservation.room_id = room.id;


--МЕНЕДЖЕР
--Оновлення інформації про номери
UPDATE room SET room_type = 'Люкс' 
FROM (SELECT * FROM room WHERE room_type = 'Президентський люкс')
AS SELECTED WHERE room.id=SELECTED.ID

--Скасування бронювання
DELETE * FROM reservation WHERE id >= 21

--Який номер зайнятий був зарезервований в заданий період
SELECT room.id AS [Номер], room_type AS [Тип номера] from room JOIN reservation on room.id = reservation.room_id
where date_of_reservation BETWEEN '2022-06-01' AND '2022-06-30' 
ORDER BY room.id;

--Який номер є зайнятий в певний період
SELECT room.id AS [Номер], room_type AS [Тип номеру] from room JOIN reservation on room.id = reservation.room_id
where check_in_date >= '2022-06-01' AND check_out_date <= '2022-06-03'
ORDER BY room.id;

--Який номер певної категорії є вільний в певний період
SELECT TOP 1 room.id AS [Номер кімнати], room_type AS [Тип кімнати]  from room 
LEFT JOIN reservation ON reservation.room_id = room.id where room.id not in
(SELECT room_id from room JOIN reservation ON reservation.room_id = room.id 
where check_in_date >= '2022-06-07' and check_out_date <= '2022-06-20') and room.room_type = 'Люкс';

--Тривалість проживання кожного гостя
SELECT reservation.id AS [Номер бронювання], guest.firstname AS [Імя], guest.lastname AS [Прізвище], datediff(DAY, check_in_date, check_out_date) AS [Кількість ночей] from reservation
JOIN guest ON guest_id = guest.id;


--Загальна сума для гостя за номер за проживання
SELECT guest.firstname AS [Імя], guest.lastname AS [Прізвище], room.id AS [Номер кімнати], 
room.price AS [Ціна за одну добу],check_in_date AS [Дата заселення], check_out_date AS [Дата виселення], 
datediff(DAY, check_in_date, check_out_date) AS [Кількість ночей],
amenity.feed_type [Тип харчування], amenity.is_spa[Наявність SPA], amenity.amenity_sum AS [Ціна за додаткові послуги за добу], 
(datediff(DAY, check_in_date, check_out_date)*room.price+datediff(DAY, check_in_date, check_out_date)*amenity.amenity_sum) AS [Сума до оплати] 
FROM guest
JOIN reservation ON guest_id = guest.id                                        
JOIN amenity ON amenity_id = amenity.id
JOIN room ON room_id = room.id


--Який гість яку страву замовив
SELECT guest.lastname AS [Прізвище], kitchen.dish_name AS [Назва страви], SUM(kitchen.dish_price) AS [Сума за страви] FROM guest
JOIN guestKitchen ON guest.id = guestKitchen.guest_id
JOIN kitchen ON guestKitchen.kitchen_id = kitchen.id
GROUP BY guest.lastname, kitchen.dish_name
ORDER BY guest.lastname


--Загальна сума за страви для кожного гостя
SELECT guest.lastname AS [Прізвище], SUM(kitchen.dish_price) AS [Сума за страви] FROM guest
JOIN guestKitchen ON guest.id = guestKitchen.guest_id
JOIN kitchen ON guestKitchen.kitchen_id = kitchen.id
GROUP BY guest.lastname;

--Загальна кількість номерів по типах
SELECT room_type, COUNT(description) AS [Кількість номерів], price FROM room
GROUP BY room_type, price;

--Яку кімнату прибирала покоївка за типом і номером
SELECT cleaners.lastname, room.id, room.room_type FROM cleaners
JOIN roomCleaners ON cleaners.id = roomCleaners.cleaners_id
JOIN room ON room.id = roomCleaners.room_id
JOIN reservation ON reservation.room_id = room.id;

--Заробіток покоївок за прибрані номери
SELECT cleaners.lastname, COUNT(room.id) AS [К-сть прибраних номерів], salary_for_one_room [Ціна за одне прибирання], (COUNT(room.id)*salary_for_one_room) AS [Заробіток] FROM cleaners
JOIN roomCleaners ON cleaners.id = roomCleaners.cleaners_id
JOIN room ON room.id = roomCleaners.room_id
JOIN reservation ON reservation.room_id = room.id
WHERE check_in_date >= '2022-06-01' AND check_out_date <= '2022-06-30'
GROUP BY cleaners.lastname, salary_for_one_room;

--Зарплата менеджера за місяць
SELECT manager.lastname AS [Прізвище], COUNT(room_id) AS [К-сть номерів], (SUM(room.price*0.05))+manager.salary AS [Зарплата] FROM reservation
JOIN manager ON manager.id = manager_id
JOIN room ON room_id = room.id
GROUP BY manager.lastname, manager.salary;

--Найпопулярніший тип номеру за певний період
SELECT room.room_type AS [Тип кімнати], COUNT(reservation.id) AS [Номери по пупулярності]  FROM room 
JOIN reservation on reservation.room_id = room.id
GROUP BY room.room_type
ORDER BY COUNT(reservation.id) DESC;

--Найпопулярніша страва 
SELECT kitchen.dish_name AS [Назва страви], COUNT(guestKitchen.kitchen_id) AS [Страви по пупулярності]  FROM kitchen 
JOIN guestKitchen on guestKitchen.kitchen_id = kitchen.id
GROUP BY kitchen.dish_name
ORDER BY COUNT(guestKitchen.kitchen_id) DESC;

--Найпопулярніше amenity
SELECT amenity.id AS [Тип послуги], amenity.feed_type AS [Додаткові послуги], amenity.is_spa AS [Додаткові послуги], COUNT(reservation.amenity_id) AS [Послуги по пупулярності]  FROM amenity 
JOIN reservation on reservation.amenity_id = amenity.id
GROUP BY amenity.id, amenity.feed_type, amenity.is_spa
ORDER BY COUNT(reservation.amenity_id) DESC;


