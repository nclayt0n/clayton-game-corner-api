CREATE TABLE cgc_users(
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email  text NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio text not null,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);