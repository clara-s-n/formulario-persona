FROM postgres
RUN localedef -i es_ES -c -f UTF-8 -A /usr/share/locale/locale.alias es_ES.UTF-8
ENV LANG es_ES.utf8
COPY ./init.sql /docker-entrypoint-initdb.d