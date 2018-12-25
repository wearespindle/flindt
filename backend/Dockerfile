FROM python:3.7-slim-stretch

LABEL maintainer="info@wearespindle.com"

WORKDIR /usr/src/flindt

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    gettext \
    mime-support \
    mysql-client \
    default-libmysqlclient-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY . .

RUN pip install -r requirements-dev.txt

EXPOSE 8000

## uWSGI is only serving static files when "collectstatic" has run!
ENTRYPOINT ["/usr/local/bin/uwsgi"]
CMD ["--ini", "uwsgi.ini", "--static-map", "/static=/usr/src/flindt/flindt/static"]
