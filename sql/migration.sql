DROP TABLE crop;

CREATE TABLE crop (
    id serial PRIMARY KEY,
    name varchar(30) NOT NULL,
    growth_time int NOT NULL,
    regrowth boolean DEFAULT false,
    regrowth_time int DEFAULT 0,
    seed_price int NOT NULL,
    sell_price int NOT NULL,
    season varchar (30) NOT NULL
)