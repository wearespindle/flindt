=========
 FeedBag
=========
*Shoving feedback down your throat since 2016*
----------------------------------------------

Development
===========

To get up and running you need to have a recent version of docker and
docker-compose. After that it is pretty easy:

1. `docker-compose build`
2. `docker-compose up`

On the first run you will probably want to run:

`docker-compose run backend python manage.py migrate`

To create a superuser for the backend, do:

`docker-compose run backend python manage.py createsuperuser`

Visit the backend at http://localhost:8005. The frontend is available at
http://localhost:3000.



