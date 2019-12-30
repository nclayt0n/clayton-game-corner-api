CREATE TYPE game AS ENUM ('video', 'tabletop');
CREATE TABLE cgc_game_reviews(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL ,
    picture TEXT,
    review VARCHAR(400) NOT NULL ,
    link TEXT,
    game_type game NOT NULL ,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);