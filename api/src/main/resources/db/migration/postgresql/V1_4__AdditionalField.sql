-- Add a new temporary column with the desired constraints
ALTER TABLE additional_field_type
    ADD COLUMN new_type varchar(255) CHECK (new_type IN ('DATE', 'NUMBER', 'STRING', 'LIST', 'JSON'));

-- Update the new column with the values from the existing column
UPDATE additional_field_type
SET new_type = type;

-- Drop the old column
ALTER TABLE additional_field_type
DROP COLUMN type;

-- Rename the new column to the original column name
ALTER TABLE additional_field_type
    RENAME COLUMN new_type TO type;

-- Add a new temporary column with the desired constraints
ALTER TABLE additional_field_type_aud
    ADD COLUMN new_type varchar(255) CHECK (new_type IN ('DATE', 'NUMBER', 'STRING', 'LIST', 'JSON'));

-- Update the new column with the values from the existing column
UPDATE additional_field_type_aud
SET new_type = type;

-- Drop the old column
ALTER TABLE additional_field_type_aud
DROP COLUMN type;

-- Rename the new column to the original column name
ALTER TABLE additional_field_type_aud
    RENAME COLUMN new_type TO type;

ALTER TABLE additional_field_value
    add COLUMN if not exists json_value_of json;

ALTER TABLE additional_field_value_aud
    add COLUMN if not exists json_value_of json;