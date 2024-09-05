create extension if not exists pgcrypto;


create table if not exists personas (
    id SERIAL primary key,
    nombre text not null,
    apellido text not null,
    email text not null unique,
    cedula text not null unique,
    rut bigint not null unique,
    password text not null
);

insert into personas (nombre, apellido, email, cedula, rut, password)
    values('Martin', 'Perez', 'mperez@correo.com', '5.440.395-7', 213971680013, crypt('27DEenero2003_', gen_salt('bf')));