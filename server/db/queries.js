const roomQ = `ALTER TABLE 'hotels'.'rooms' 
ADD COLUMN 'name' VARCHAR(45) NULL AFTER 'id',
ADD COLUMN 'price' DECIMAL NULL AFTER 'name',
ADD COLUMN 'booked' TINYINT NULL AFTER 'price';`;
