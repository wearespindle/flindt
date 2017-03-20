FROM django:latest

ADD requirements.txt requirements.txt
ADD requirements-dev.txt requirements-dev.txt
RUN pip install -r requirements-dev.txt

RUN mkdir -p /usr/src/flindt
WORKDIR /usr/src/flindt
