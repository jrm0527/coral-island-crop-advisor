DROP TABLE crop;

CREATE TABLE crop (
    id serial PRIMARY KEY,
    name varchar(30),
    growth_time int,
    regrowth boolean,
    regrowth_time int,
    seed_price int,
    sell_price int,
    season varchar (30)
)