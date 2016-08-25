FROM django:latest

ADD requirements.txt requirements.txt
ADD requirements-dev.txt requirements-dev.txt
RUN pip install -r requirements-dev.txt

ENV DEBUG 1
ENV DATABASE_URL mysql://feedbag:feedbag@db/feedbag

RUN mkdir -p /usr/src/feedbag
WORKDIR /usr/src/feedbag
