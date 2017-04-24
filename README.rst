=======
 Flindt
=======
*Sparks conversations since 2016*

Development
===========

This is a quickstart for a local development setup.
For in-depth documentation, see the Sphinx-docs at ``backend/docs/sphinx/source/intro/install.rst``.

Local setup
^^^^^^^^^^^

Pull the repository from GitHub to your local machine:

::

    cd ~Projects/wearespindle
    git clone git@github.com:wearespindle/feedbacktool-frontend.git
    cd feedbacktool-frontend

OAuth2 authentication
^^^^^^^^^^^^^^^^^^^^^

To make use of the Google API to login, you need to create an .env-file in the backend folder (**so not the root of the project!**).

The following credentials needs to be set in this .env-file:

::

    SOCIAL_AUTH_GOOGLE_PLUS_KEY=your_client_id
    SOCIAL_AUTH_GOOGLE_PLUS_SECRET=your_client_secret
    SOCIAL_AUTH_GOOGLE_PLUS_WHITELISTED_DOMAINS=your_whitelisted_domains
    CORS_ORIGIN_WHITELIST=localhost:8080,localhost:8005,yourdomain.com

The Google Plus secret can be found in the Google Developer dashboard.

Add an OAuth2-enabled application
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can add an OAuth2-enabled application in the Django Administration-backend.
Follow these steps:

1. Browse to
   ``http://localhost:8005/admin/oauth2_provider/application/``
2. Create an application
3. Add this (hard-coded) "Client id" -->
   ``DsHaTowmFoOr3GQLOOoJaXQpViaV6NsIFzOVY3ME``
4. "User" should point to the added superuser
5. "Client type" --> Public
6. "Authorization grant type" --> Resource owner password-based

You should be able to login to the frontend using the superuser's email-address at http://localhost:8080/.

At this point selecting the options "Give feedback" and "Received feedback" are waiting indefinitely. This is because there aren't any feedback objects for a user as of yet.

Continue with the setup following the documentation:
``backend/docs/sphinx/source/starting/starting.rst``

Docker related
^^^^^^^^^^^^^^

-  Build the containers:

``docker-compose build``

-  Start the containers, running in the background:

``docker-compose up -d``

-  Wait something like 10 seconds (for the DB-container to initialize)
   and run the default Django migrate-stuff:

``docker-compose run --rm backend python manage.py migrate``

-  Add a superuser, e.g. ``john.doe@example.com``:

``docker-compose run --rm backend python manage.py createsuperuser``

You'll **have to restart** the environment to get anything to show up in the browser:

``docker-compose restart``

Now you can connect to the backend at http://localhost:8005/admin/.

Login with the superuser & password you've just created and add an application in the next step.
