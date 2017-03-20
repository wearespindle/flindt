=======
 Flindt
=======
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
http://localhost:8080.


To make use of the Google API to login you need to create an `.env` file in your backend folder.

The following info needs to be added to your .env file:

.. code:: bash
    
    SOCIAL_AUTH_GOOGLE_PLUS_KEY=your_client_id 
    SOCIAL_AUTH_GOOGLE_PLUS_SECRET=your_client_secret
    SOCIAL_AUTH_GOOGLE_PLUS_WHITELISTED_DOMAINS=your_whitelisted_domains
    CORS_ORIGIN_WHITELIST=localhost:8080,yourdomain.com

The Google keys can be found in your Google Developer dashboard.
