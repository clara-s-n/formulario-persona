create table personas (
    id SERIAL primary key,
    nombre text not null,
    apellido text not null,
    email text not null unique,
    cedula text not null unique,
    rut bigint not null unique
)