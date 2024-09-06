create extension if not exists pgcrypto;


create table if not exists personas (
    id SERIAL primary key,
    name text not null,
    lastname text not null,
    email text not null unique,
    countryId text not null unique,
    rut bigint not null unique,
    password text not null
);

insert into personas (name, lastname, email, countryId, rut, password)
    values('Martin', 'Perez', 'mperez@correo.com', '5.440.395-7', 213971680013, crypt('27DEenero2003_', gen_salt('bf'))),
          ('Lorena', 'Gonzalez', 'lorena@correo.com', '4.510.196-4', 130057830019, crypt('28DEenero2003_', gen_salt('bf'))),
          ('Celeste', 'Gomez', 'celeste@correo.com', '3.312.475-0', 150046270011, crypt('29DEenero2003_', gen_salt('bf'))),
          ('Juan', 'Perez', 'juan@correo.com', '5.483.597-4', 215081750014, crypt('30DEenero2003_', gen_salt('bf')));