FROM python:3.4-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    gettext \
    mysql-client \
    libmysqlclient-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

## We COULD install Django from here, but it will be overriden
## by the requirements-file ...
# ENV DJANGO_VERSION 1.11.3
# RUN pip install mysqlclient django=="$DJANGO_VERSION"

RUN pip install mysqlclient

ADD requirements.txt requirements.txt
ADD requirements-dev.txt requirements-dev.txt
RUN pip install -r requirements-dev.txt

RUN mkdir -p /usr/src/flindt
WORKDIR /usr/src/flindt
