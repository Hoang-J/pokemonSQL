CREATE TABLE pokedex (
    id SERIAL PRIMARY KEY,
    hp INTEGER,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(25) NOT NULL,
    region VARCHAR(25) NOT NULL,
    abilities VARCHAR(25) NOT NULL,
    image VARCHAR(100) NOT NULL,
    attack INTEGER,
    defense INTEGER
);

CREATE TABLE pokemonParty(
    id SERIAL PRIMARY KEY,
    hp INTEGER,
    name VARCHAR(50),
    type VARCHAR(25),
    attacks TEXT [],
    abilities VARCHAR(25),
    attack INTEGER,
    defense INTEGER
    
);

CREATE TABLE attacks(
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    power INTEGER,
    type VARCHAR(25)
);


INSERT INTO pokedex (hp, name, type, abilities, region, image, defense, attack)
VALUES
    (39, 'Charmander', 'Fire', 'Blaze', 'Kanto', 'https://img.pokemondb.net/artwork/avif/charmander.avif', 52, 43),
    (70, 'Machop', 'Fighting', 'Guts', 'Kanto', 'https://img.pokemondb.net/artwork/avif/machop.avif', 80, 50),
    (44, 'Squirtle', 'Water', 'Torrent', 'Kanto', 'https://img.pokemondb.net/artwork/avif/squirtle.avif', 48, 65),
    (45, 'Bulbasaur', 'Grass', 'Overgrow', 'Kanto', 'https://img.pokemondb.net/artwork/avif/bulbasaur.avif', 49, 49),
    (35, 'Pikachu', 'Electric', 'Lightning Strike', 'Kanto', 'https://img.pokemondb.net/artwork/avif/pikachu.avif', 55, 40),
    (35, 'Onix', 'Rock', 'Smash', 'Kanto', 'https://img.pokemondb.net/artwork/avif/onix.avif', 45, 160),
    (45, 'Caterpie', 'Bug', 'Harden', 'Kanto', 'https://img.pokemondb.net/artwork/avif/caterpie.avif', 30, 35),
    (50, 'Sandshrew', 'Ground', 'Dig', 'Kanto', 'https://img.pokemondb.net/artwork/avif/sandshrew.avif', 75, 90),
    (50, 'Oddish', 'Grass', 'Chlorophyll', 'Kanto', 'https://img.pokemondb.net/artwork/avif/oddish.avif', 50, 55),
    (35, 'Paras', 'Grass', 'Effect Spore', 'Kanto', 'https://img.pokemondb.net/artwork/avif/paras.avif', 70, 55);

-- INSERT INTO pokemonParty (hp, name, type, attacks, abilities, defense, attack)
-- VALUES
--     (39, 'Charmander', 'Fire', ARRAY [''], 'Blaze', 52, 43),
--     (44, 'Squirtle', 'Water', ARRAY [''], 'Torrent', 48, 65),
--     (45, 'Bulbasaur', 'Grass', ARRAY [''], 'Overgrow', 49, 49),
--     (45, 'Oddish','Grass', ARRAY [''], 'Chlorophyll', 50, 55),
--     (35, 'Pikachu','Electric', ARRAY [''], 'Lightning Strike', 55, 40),
--     (50, 'Sandshrew','Ground', ARRAY [''], 'Chlorophyll', 75, 90);

INSERT INTO attacks (name, power, type)
VALUES
    ('Ember', 40, 'Fire'),
    ('Fire Spin', 35, 'Fire'),
    ('Inferno', 100, 'Fire'),
    ('Fire Fang', 65, 'Fire'),
    ('Hydro Pump', 110, 'Water'),
    ('Water Pulse', 60, 'Water'),
    ('Wave Crash', 120, 'Water'),
    ('Vine Whip', 45, 'Grass'),
    ('Razor Leaf', 55, 'Grass'),
    ('Solar Beam', 120, 'Grass'),
    ('Bulldoze', 60, 'Rock'),
    ('Rock Blast', 20, 'Rock'),
    ('Bug Bite', 60, 'Bug'),
    ('Bug Buzz', 90, 'Bug'),
    ('Mud Slap', 20, 'Ground'),
    ('Dig', 80, 'Ground'),
    ('Earthquake', 100, 'Ground'),
    ('Thunder Shock', 40, 'Electric'),
    ('Discharge', 80, 'Electric');

