.. _intro/install:

############
Installation
############

=============
Prerequisites
=============

* You have `docker <https://www.docker.com/>`_ and `docker-compose <https://docs.docker.com/compose/>`_ installed
* You have Git installed

If you want to run the front end without Docker you also need to have Gulp, NPM and Node.JS installed locally.

==================
Docker environment
==================

1. Checkout the project on your computer with Git

.. code:: bash

    git git@github.com:wearespindle/flindt.git
    cd flindt

2. Build the docker image. This takes a while the first time.

.. code:: bash

    docker-compose build

.. note:: This command needs to run every time the Dockerfile, requirements or patches are adjusted. Good practice would be to run it every time the git repo is updated. If nothing changed, the command would complete almost instantly.

3. First start the database-container and keep it running in the background. This container is needed by the backend-container.

.. code:: bash

    docker-compose up -d db

4. Do a migration of the models

.. code:: bash

    docker-compose run --rm backend python manage.py migrate

5. Create a superuser for your backend

.. code:: bash

    docker-compose run --rm backend python manage.py createsuperuser

6. Run the containers

.. code:: bash

    docker-compose up

7. If you want to only run the backend via Docker and the frontend locally

.. code:: bash

    docker-compose run --service-ports backend

And for the front end

.. code:: bash

    cd frontend
    npm install
    gulp

Visit the backend at http://localhost:8005/admin and login with the superuser you created. The front end is available at
http://localhost:8080 (both via Docker as well as  locally)

==================
Google Login Setup
==================

The Flindt tool uses Google Login to register and login users from the domain you whitelist. To set this up you need to go through a couple of steps:

 * Login to the `Google APIs website <https://console.developers.google.com>`_
 * From the *Overview* screen, fill in *Google+ API* in the Search bar and select it from the search results
 * Click on the *Enable* button
 * Now you need to create Credentials. Click on the *Credentials* button in the navigation on the left.
 * Click on the blue *Create Credentials* button and select OAuth Client ID:
   * Application type? *Web application*
 * Give the credentials a name, e.g. *Flindt*
 * In *Authorized JavaScript origins* fill in your development url, e.g. localhost:8080
 * Click on the *Save* button
 * The current screen should be the Credentials overview; click on Flindt

 The credentials are needed for our Google Login setup. For this to work we need to add them to a .env file

 .. code:: bash

    vim /flindt/backend/.env

Add the following information in your file:

.. code:: bash

    SOCIAL_AUTH_GOOGLE_PLUS_KEY=your_client_id
    SOCIAL_AUTH_GOOGLE_PLUS_SECRET=your_client_secret
    SOCIAL_AUTH_GOOGLE_PLUS_WHITELISTED_DOMAINS=your_whitelisted_domains
    CORS_ORIGIN_WHITELIST=localhost:8080,yourdomain.com

==================
Django Social Auth
==================

For the backend to work correctly with Google we need to add our 'Application' to the backend.

* Go to http://localhost:8005/admin/oauth2_provider/application/ and log in with your superuser
* Click on the *Add application* button in the topright
* Replace the generated Client id with: *DsHaTowmFoOr3GQLOOoJaXQpViaV6NsIFzOVY3ME*
* In the Client Type field, select: *public*
* In the Authorization grand type select: *Resource owner password-based*
* Press save

Go to localhost:8080 and click on the Login with Google button, you can now succesfully log in using your Google account.
