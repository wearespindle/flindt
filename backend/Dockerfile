FROM python:3.6-slim-stretch

LABEL maintainer="info@wearespindle.com"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    gettext \
    mime-support \
    mysql-client \
    default-libmysqlclient-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY requirements.txt requirements.txt
COPY requirements-dev.txt requirements-dev.txt
RUN pip install -r requirements-dev.txt

RUN mkdir -p /usr/src/flindt
WORKDIR /usr/src/flindt
