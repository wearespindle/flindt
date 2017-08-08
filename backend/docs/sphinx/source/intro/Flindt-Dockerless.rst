Testcase: Flindt without Docker
===============================

| This is a Proof of Concept to run the Spindle feedback-tool "Flindt"
  without permanent Docker-containers.
| The setup was done on macOS Sierra using
  `Vagrant <https://www.vagrantup.com/intro/getting-started/index.html>`__
  1.9.7. for VirtualBox, using Vagrant Box ``debian/contrib-jessie64``.

Adding the box: ``vagrant box add debian/contrib-jessie64``

Vagrant plugins used:

-  vagrant-cachier
-  vagrant-hostsupdater
-  vagrant-share
-  vagrant-vbguest

Installing a Vagrant-plugin can be done like
``vagrant plugin install vagrant-cachier``.

Use the ``Vagrantfile`` down below in the appendix.

And remember: you will also need user-accounts at
`GlassFrog <https://glassfrog.com/>`__. Google Developer and Slack to
make full use of this holacracy feedback-tool!

Frontend
--------

Start by building the static content use by the frontend.

Edit file ``frontend/src/constants/constants.js`` to contain the right
value for your ``GOOGLE_CLIENT_ID``.

Option 1
~~~~~~~~

| The easy way, still using Docker though...
| Build with ``./build-frontend.sh`` (see in appendix) **outside** of
  the Vagrant VM. For this, you need to have Docker installed on your
  host.
| The resulting folder ``uploads/`` can be uploaded to a webserver. It
  contains static content (IMG / JS / CSS).
| FYI Vagrant will mount the whole Flindt-directory, including the
  generated content in ``upload``, under ``/srv/flindt``.

Option 2
~~~~~~~~

    | **NOTE**
    | Installing NodeJS in the VM as described below, is not needed when
      you build the frontend one time with Docker and serve the
      generated static files from the ``upload``-folder.

Install NodeJS in the VM
^^^^^^^^^^^^^^^^^^^^^^^^

.. code:: txt

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    apt-get install -y nodejs

Install node modules
^^^^^^^^^^^^^^^^^^^^

.. code:: txt

    npm install
    export NODE_PATH=/srv/flindt/frontend/node_modules
    npm install -g gulp-cli webpack@1.14.0

Vagrant / Linux
---------------

| Run ``vagrant up``. Once the box is up and running, do ``vagrant ssh``
  followed by ``sudo -i``. You are now root in the virtual machine.
| Next install some essential packages. So as user root:

.. code:: txt

    apt-get install python3.4-dev python3-pip virtualenvwrapper python3-virtualenv \
     libjpeg-dev curl zlib1g-dev mysql-server libmysqlclient-dev nginx-full

While installing, you will be prompted to set a password for the MySQL
admin-user. Take note of this for later usage. You'll need it in the
``.env``-file for the backend.

| Add ``export WORKON_HOME="/srv/virtualenvs"`` to ``/root/.bashrc``.
  It's needed for the backend's virtualenv.
| Setup the Python "virtualenvs", based on v3.4:

.. code:: txt

    mkdir -p /srv/virtualenvs
    export WORKON_HOME="/srv/virtualenvs"
    mkvirtualenv -a /srv/flindt -p /usr/bin/python3.4 flindt

Log out and back in as user root to activate the just installed
virtualenv-functions.

Backend
-------

First create a MySQL-database name "flindt":

.. code:: txt

    # mysql -u root -p
    Enter password:

    mysql> create database flindt CHARACTER SET utf8 COLLATE utf8_general_ci;
    Query OK, 1 row affected (0.00 sec)

    mysql> exit

Run ``workon flindt`` to activate the virtualenv. The working directory
will change to ``/srv/flindt``.

Enter the ``backend``-directory, upgrade pip and install the
Python-packages as stated in the requirements-files:

.. code:: txt

    cd backend
    pip install -U pip
    pip install -r requirements-dev.txt

In the file ``.env`` (in directory ``backend``), adapt values as needed,
e.g. the ``DATABASE_URL``, MySQL-password and the server-names:

.. code:: txt

    SOCIAL_AUTH_GOOGLE_PLUS_KEY=SomeSecretKey.apps.googleusercontent.com
    CORS_ORIGIN_WHITELIST=localhost:8005,cust.flindt.org,api.cust.flindt.org
    ALLOWED_HOSTS=localhost,127.0.0.1,cust.flindt.org,api.cust.flindt.org
    DATABASE_URL=mysql://root:password@localhost/flindt
    FRONTEND_HOSTNAME=cust.flindt.org
    DEBUG=1

Now the application can be setup:

.. code:: txt

    python manage.py migrate
    python manage.py createsuperuser
    python manage.py collectstatic

nginx
~~~~~

| Web server "nginx" will be used to server the static content from the
  frontend in ``upload`` and as a reverse proxy to the uWSGI-server,
  listening on port 8005.
| Used config files can be found below in the appendix.

.. code:: txt

    cd /etc/nginx/sites-available
    cp *.flindt.io .
    cd ../sites-enabled
    ln -s /etc/nginx/sites-available/* .
    rm default
    nginx -t # configuration test

uWSGI
~~~~~

| Start uWSGI with
  ``uwsgi --daemonize2 uwsgi.log --ini flindt_backend.ini``.
| Again the used config file ``flindt_backend.ini`` can be found in the
  appendix.

Finally you can login with the superuser-account at
``http://api.cust.flindt.org/admin/`` and add the application as
described in
`flindt.readthedocs.io <http://flindt.readthedocs.io/en/develop/intro/install.html#django-social-auth>`__.

Connecting to the `Flindt-frontend <http://cust.flindt.org/>`__ should
result in a page that says **Welcome to Flindt!**

Google API
----------

Here are some Google related errors encountered along the way,
accompanied by what fixed it.

Not a valid origin
~~~~~~~~~~~~~~~~~~

.. code:: txt

    "Not a valid origin for the client: http://cust.flindt.org has not been whitelisted for client ID 197265621337-blahblahblah.apps.googleusercontent.com. Please go to https://console.developers.google.com/ and whitelist this origin for your project's client ID."

**FIX:** Domain verification from Google to DNS-provider (TransIP).
Added domain "flindt.io" to the whitelist.

Not allowed access
~~~~~~~~~~~~~~~~~~

.. code:: txt

    XMLHttpRequest cannot load https://api.flindt.wearespindle.com/api-social-auth/convert-token/. Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://cust.flindt.org' is therefore not allowed access.

**FIX:** Recompile (and upload) the frontend with the right name / URL
in file ``constants.js``!

Can't reach Google API / error 502
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: txt

    XMLHttpRequest cannot load http://api.cust.flindt.org/api-social-auth/convert-token/. Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://cust.flindt.org' is therefore not allowed access. The response had HTTP status code 502.

| **FIX:** Added wide-open CORS-config to nginx vhost-config
  ``cust.flindt.org``.
| See `CORS on Nginx <https://enable-cors.org/server_nginx.html>`__.

Appendix
--------

Configuration files
~~~~~~~~~~~~~~~~~~~

Configuration files not found in the default Flindt repository.

Vagrant
^^^^^^^

Add a line ``192.168.33.10 api.cust.flindt.org`` to /etc/hosts manually!

File ``Vagrantfile``:

.. code:: ruby

    # -*- mode: ruby -*-
    # vi: set ft=ruby :

    Vagrant.configure("2") do |config|
      config.vm.provider :virtualbox do |vb|

        # change the network card hardware for better performance
        vb.customize ["modifyvm", :id, "--nictype1", "virtio" ]
        vb.customize ["modifyvm", :id, "--nictype2", "virtio" ]

        # suggested fix for slow network performance
        # see https://github.com/mitchellh/vagrant/issues/1807
        vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
      end

      config.vm.box = "debian/contrib-jessie64"
      config.ssh.insert_key = false

      config.vbguest.auto_update = false

      # To speed up installation cache packages
      # on the local drive
      if Vagrant.has_plugin?("vagrant-cachier")
        config.cache.scope = :box
        config.cache.synced_folder_opts = {
          type: :nfs,
          mount_options: ['rw', 'vers=3', 'tcp', 'nolock']
        }
      end

      config.vm.synced_folder "./", "/srv/flindt", type: "nfs"

      config.vm.network "private_network", ip: "192.168.33.10"
      config.vm.hostname = 'cust.flindt.org'
      # Add 'api.cust.flindt.org' to /etc/hosts manually !!
      config.vm.network "forwarded_port", guest: 443, host: 443
      config.vm.network "forwarded_port", guest: 80, host: 80

      config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
      end

    end

Frontend
^^^^^^^^

File ``build_frontend.sh``:

.. code:: bash

    #!/bin/bash -e

    rm -rf upload

    docker-compose build frontend
    docker-compose run --rm frontend gulp build-production

    mkdir upload
    cp frontend/index.html upload
    cp -r frontend/dist upload

nginx vhosts
^^^^^^^^^^^^

The frontend-server.

File ``cust.flindt.org``:

.. code:: txt

    server {

      listen 80 default;
      server_name cust.flindt.org;

      root /srv/flindt/upload;

    # Wide-open CORS config for nginx
    # https://enable-cors.org/server_nginx.html
    location / {
         if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            #
            # Custom headers and headers various browsers *should* be OK with but aren't
            #
            add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
            #
            # Tell client that this pre-flight info is valid for 20 days
            #
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
         }
         if ($request_method = 'POST') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
            add_header 'Access-Control-Expose-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
         }
         if ($request_method = 'GET') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
            add_header 'Access-Control-Expose-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
         }
    }

    }

The backend-server, which serves the API.

File ``api.cust.flindt.org``:

.. code:: txt

    server {

      listen 80;
      server_name api.cust.flindt.org;

      location /static/ {
        alias /srv/flindt/backend/flindt/static/;
      }

      location / {
        #if ($http_x_forwarded_proto != "https") {
        #  rewrite ^(.*)$ https://$http_host$1 permanent;
        #}

        proxy_pass http://127.0.0.1:8005;
      }

    }

uWSGI
^^^^^

File ``flindt_backend.ini``:

.. code:: txt

    [uwsgi]
    virtualenv = /srv/virtualenvs/flindt
    chdir = /srv/flindt/backend
    wsgi-file = /srv/flindt/backend/flindt/wsgi.py

    module = flindt.wsgi:application
    env DJANGO_SETTINGS_MODULE = flindt.settings
    master = true
    pidfile = /tmp/project-master.pid
    http = 0.0.0.0:8005
    processes = 5
    harakiri = 1000
    max-requests = 5000

TODO
----

-  HTTPS / certificates for ``CUSTOMER.flindt.io`` and
   ``api.CUSTOMER.flindt.io``, preferably with Let's Encrypt and
   `Caddyserver <https://caddyserver.com/>`__.

--------------

Devhouse Spindle, 2017.
