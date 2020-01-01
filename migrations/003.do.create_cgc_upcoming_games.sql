CREATE TABLE cgc_upcoming_games(
id SERIAL PRIMARY KEY,
title text NOT NULL,
date date NOT NULL,
game_type game NOT NULL
);