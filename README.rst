.. image:: https://user-images.githubusercontent.com/519955/34173812-07860bf6-e4f7-11e7-8cbb-2a1c19695b7e.png
     :target: http://www.flindt.io/

A feedback tool for Holacracy companies.

*Sparks conversations since 2016*

Status
======

.. image:: https://travis-ci.org/wearespindle/flindt.svg?branch=develop
    :target: https://travis-ci.org/wearespindle/flindt

Active / maintained.

At the moment this project a MVP (*Minimum Viable Product*) and is currently Docker-based only.

However, the frontend is meant to be run outside of Docker. You can find the repo for the front end at https://github.com/wearespindle/flindt-front-end

Contributing
============

See the `CONTRIBUTING.md <CONTRIBUTING.md>`_ file on how to contribute to this project.

Contributors
============

See the `CONTRIBUTORS.md <CONTRIBUTORS.md>`_ file for a list of contributors to the project.

Usage
=====

Check out the `Sphinx docs <http://flindt.readthedocs.org/en/latest/>`_ for detailed information

Requirements
============

* You have git installed.
* You have `Docker <https://www.docker.com/>`_ and `docker-compose <https://docs.docker.com/compose/>`_ installed.
* To be able to give and receive feedback you need an active account at `GlassFrog <https://glassfrog.com/>`_.
* For OAuth2 authentication, a Google Developer-account is preferred.
* For notifications an account at `Slack <https://slack.com/>`_.

Development
===========

A quickstart for a local development.

Local setup
^^^^^^^^^^^

Pull the repository from GitHub to your local machine:

::

    cd ~Projects/wearespindle
    git clone git@github.com:wearespindle/flindt.git
    cd flindt

Docker related
^^^^^^^^^^^^^^

-  Build the containers:

``docker-compose build``

-  Start the 3 containers in the background:

``docker-compose up -d``

-  Wait something like 10 to 15 seconds for the DB-container to initialize and run the default Django migrate-stuff:

``docker-compose run --rm backend python manage.py migrate``

-  Add a superuser, e.g. ``john.doe@wearespindle.com``:

``docker-compose run --rm backend python manage.py createsuperuser``

You'll **have to restart** the environment to get anything to show up in the browser:

``docker-compose restart``

Now you can connect to the backend at http://localhost:8005/admin/.

Login with the superuser & password you've just created. You are now ready to add an OAuth2-enabled application.

OAuth2 authentication
^^^^^^^^^^^^^^^^^^^^^

To make use of the Google API to login, you need to create an .env-file in the backend folder (**so not the root of the project!**).

The following credentials needs to be set in this .env-file:

::

    SOCIAL_AUTH_GOOGLE_PLUS_KEY=your_client_id
    SOCIAL_AUTH_GOOGLE_PLUS_SECRET=your_client_secret
    SOCIAL_AUTH_GOOGLE_PLUS_WHITELISTED_DOMAINS=your_whitelisted_domains
    CORS_ORIGIN_WHITELIST=localhost:3000,localhost:8005,yourdomain.com

The Google Plus secret can be found in the Google Developer dashboard.

Add an OAuth2-enabled application
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can add an OAuth2-enabled application in the Django Administration-backend.
Follow these steps:

1. Browse to
   ``http://localhost:8005/admin/oauth2_provider/application/``
2. Add application (button on top right corner)
3. Add this (hard-coded) "Client id" -->
   ``DsHaTowmFoOr3GQLOOoJaXQpViaV6NsIFzOVY3ME``
4. "User" should point to the added superuser. Use the looking glass to find it.
5. "Client type" --> Public
6. "Authorization grant type" --> Resource owner password-based
7. "Name" is OK to remain empty

You should be able to login to the frontend using the superuser's email-address at http://localhost:3000/.

At this point selecting the options "Give feedback" and "Received feedback" are waiting indefinitely. This is because there aren't any feedback objects for a user as of yet.

Continue with the documentation at `Starting to work <http://flindt.readthedocs.io/en/latest/starting/starting.html>`_.
