BEGIN;

TRUNCATE
cgc_users,
cgc_game_reviews,
cgc_upcoming_games
RESTART IDENTITY CASCADE;

INSERT INTO cgc_users(email,full_name,password,bio)
VALUES
('claytongamecorner@gmail.com', 'Corrin Clayton','$2y$12$4j0PiTCTPyzqv6pHLxeEa.g7QWKz1DnipUbkoiQDLdgTHZCj9Ngua','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
('admin@test.com', 'Test Admin', '$2y$12$W8w6TyzEG5m4x1Isi4byTuMOroLhjszIxG/dA6uhPyZqhhS4AiNVm','null');

INSERT INTO cgc_game_reviews(title,picture,review,link,game_type)
VALUES('Splendor','["http://ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg"]', 'this game is the best', 'https://www.amazon.com/Asmodee-SPL01-Splendor/dp/B00IZEUFIA', 'tabletop'
);
INSERT INTO cgc_upcoming_games(title,date,game_type)VALUES(
    'TEST GAME 1','January 20, 2020','video'
);
  COMMIT;