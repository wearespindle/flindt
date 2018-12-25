# Flindt in Kubernetes (k8s)

## :stew: Status

This is a working PoC.

The Docker images are making use of newer versions as base (Python 3.7, nginx stable).\
All Python requirements are on the latest versions after checking with [`sesh/piprot`](https://github.com/sesh/piprot).

The containers in Kubernetes have resources set, but not (yet) a full security context.

## :wrench: Requirements

- Minikube, a tool that makes it easy to run Kubernetes locally.
- Skaffold, a command line tool that facilitates continuous development for Kubernetes applications.
- the Kubernetes command-line tool, [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
- access to an external MySQL database.
- an account at Google (for console.developers.google.com).

## :package: Minikube

Install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). Install [Skaffold](https://skaffold.dev/docs/getting-started/#installing-skaffold).

[Start Minikube](https://kubernetes.io/docs/setup/minikube/#quickstart) and make it use its own Docker: `eval $(minikube docker-env)`

Enable the dashboard and ingress addons:

```txt
minikube addons enable dashboard
minikube addons enable ingress
```

Start dashboard: `minikube dashboard &`

Run `minikube ip` and add the shown IP address plus these hostnames to file `/etc/hosts`:

`192.168.64.6 flindt.internal api.flindt.internal`

## :whale: Build container images

Clone [`wearespindle/flindt`](https://github.com/wearespindle/flindt) (the Django backend / API application) into a project folder:

```txt
cd ~/Projects/wearespindle/
git clone git@github.com:wearespindle/flindt.git
cd flindt
```

### Front end

For the front end we need to replace the hardcoded `client_id` in file `src/config/google.json`.\
This specific `client_id` is connected to the domain and origins of **`wearespindle.com`** and we need it for **`flindt.internal`**.

So whenever using a different domain, make sure you have done this at the Google APIs website:

- add a new [Google Client ID](https://flindt.readthedocs.io/en/latest/intro/install.html#google-login-setup) for Web application
- as "Authorized JavaScript origins" add `http://domain.name` & `https://domain.name`

Now you can build the front end, with the new `client_id` as a build argument, **without** using the extension `.apps.googleusercontent.com`:

```txt
cd frontend
docker build -f Dockerfile -t wearespindle/flindt_frontend:latest \
 --build-arg CLIENT_ID=587834240110-2kju38c786jk0okdqp3v74im71f7lbf1 .
```

### Back end

Lets move to the backend: `cd ../backend`.

Add this file `.env` in the backend-folder:

```txt
SOCIAL_AUTH_GOOGLE_PLUS_WHITELISTED_DOMAINS=localhost,flindt.internal
CORS_ORIGIN_WHITELIST=localhost:3000,flindt.internal:8005,flindt.internal
#
ALLOWED_HOSTS=localhost,0.0.0.0,api.flindt.internal
ALLOWED_CIDR_NETS=['10.0.0.0/8','172.16.0.0/12','192.168.0.0/16']
#
## These env vars are set in the k8s deployment:
# SOCIAL_AUTH_GOOGLE_PLUS_KEY=
# SOCIAL_AUTH_GOOGLE_PLUS_SECRET=
# DJANGO_SECRET_KEY=
# FRONTEND_HOSTNAME=
# DATABASE_URL=
# DEBUG=
```

Still in the backend-folder, build the container image:

```txt
docker build -f Dockerfile -t wearespindle/flindt_backend .
```

## :truck: Create database

It's best to use an **external** database instance, not one inside Kubernetes!

Create a new database (with more secure options than shown here):

```sql
CREATE DATABASE flindt CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER 'flindt'@'%' IDENTIFIED BY 'flindtpassword';
GRANT ALL PRIVILEGES ON flindt.* TO 'flindt'@'%' WITH GRANT OPTION
```

## :running: Run

First create a new namespace to run things in: `kubectl create namespace flindt-website`

> :warning: **WARNING** :warning:\
> For security reasons the file `k8s-config/dev.secret.yaml` is renamed to `k8s-config/example.secret.yaml`.\
> You'll have to create a **NEW** file `k8s-config/dev.secret.yaml` containing valid secrets!!

Start the application with `skaffold run`.\
Or use `skaffold dev` and leave it running and continue in another terminal.

Check all resources in the namespace `flindt-website`:

```txt
$ kubectl get all --namespace=flindt-website
NAME                                  READY   STATUS    RESTARTS   AGE
pod/flindt-backend-56c85c6f7c-fq2s8   1/1     Running   0          32s
pod/flindt-frontend-79fcf86cb-2w4m2   1/1     Running   0          32s

NAME                        TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/flindt-be-service   NodePort   10.100.154.236   <none>        8005:30886/TCP   32s
service/flindt-fe-service   NodePort   10.104.182.68    <none>        80:31998/TCP     32s

NAME                              DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/flindt-backend    1         1         1            1           32s
deployment.apps/flindt-frontend   1         1         1            1           32s

NAME                                        DESIRED   CURRENT   READY   AGE
replicaset.apps/flindt-backend-56c85c6f7c   1         1         1       32s
replicaset.apps/flindt-frontend-79fcf86cb   1         1         1       32s
```

Run migrations, add superuser ~~and collectstatic~~ through the `flindt-backend` pod:

```txt
# Migrations - database setup:
kubectl exec $(kubectl get pods --all-namespaces | grep flindt-backend | awk '{print $2}') \
-n=flindt-website -- python manage.py migrate

# Superuser - needs a TTY, hence through a shell:
kubectl exec $(kubectl get pods --all-namespaces | grep flindt-backend | awk '{print $2}') \
-n=flindt-website -ti bash

root@flindt-backend-56c85c6f7c-fq2s8:/usr/src/flindt# python manage.py createsuperuser
```

Kept for historic reasons, not needed anymore:

```txt
# Collect static:
kubectl exec $(kubectl get pods --all-namespaces | grep flindt-backend | awk '{print $2}') \
-n=flindt-website -- python manage.py collectstatic -v0 --no-input
```

In a browser connect to <https://api.flindt.internal/admin/>.\
Make an exception for the self signed certificate (if needed) and login with the above created superuser account.

Add a new application in Django as described [here](https://flindt.readthedocs.io/en/latest/intro/install.html#django-social-auth).

Check for the API: <https://api.flindt.internal/api/v1/>.

And the front end <https:/flindt.internal/>. Login here, using the superuser account.

## :white_check_mark: Todo

- [x] Container images can be build through Skaffold
- [x] Combine YAML-files into deployments
- [x] Enable HTTPS with a (self-signed) certificate
- [x] Create job to run `collectstatic` for a new back end pod\
      **DONE**: using a post-start lifecycle hook
- [ ] Create job to run `migrate` once after initial setup
- [ ] Add better working [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) (if possible)
- [ ] Enable [CORS](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#enable-cors) and fix `cors-allow-origin` for `nginx.ingress`
- [ ] A Helm chart would be nice

## :hash: Addendum

### :lock_with_ink_pen: Self-signed certificate

Use OpenSSL or even better the script at [`FiloSottile/mkcert`](https://github.com/FiloSottile/mkcert) to create self-signed certificates, used in file `k8s-config/dev.*-secret-tls.yaml`.

Generate certificate(s) and key(s) and convert these to base64 (without line wrapping).

****Wildcard certificate:****

> **NOTE** This setup is unique for each localhost!

```txt
$ mkcert -install

Created a new local CA at "/Users/hbokh/Library/Application Support/mkcert" 💥
The local CA is now installed in the system trust store! ⚡️
The local CA is now installed in the Firefox trust store (requires browser restart)! 🦊

$ mkcert flindt.internal "*.flindt.internal" localhost 127.0.0.1 ::1

Using the local CA at "/Users/hbokh/Library/Application Support/mkcert" ✨

Created a new certificate valid for the following names 📜
 - "flindt.internal"
 - "*.flindt.internal"
 - "localhost"
 - "127.0.0.1"
 - "::1"

Reminder: X.509 wildcards only go one level deep, so this won't match a.b.flindt.internal ℹ️

The certificate is at "./flindt.internal+4.pem" and the key at "./flindt.internal+4-key.pem" ✅

cat flindt.internal+4-key.pem | base64 -w0
cat flindt.internal+4.pem | base64 -w0
```

****OpenSSL:****

```txt
openssl req -x509 -nodes -days 3653 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=flindt.internal/O=flindt.internal"

cat tls.crt | base64 -w0
cat tls.key | base64 -w0
```

Paste the outpout starting with `LS0t...` into the file for both (crt and key).

### :ghost: Debugging

- Enter an image inside Minikube (run `minikube ssh` first):

  `docker run --rm --entrypoint "/bin/sh" -ti 691992ed9e96`, where the value on the end is the image ID

- The URLs served by ingress can also be checked with:

  ```txt
  $ minikube service flindt-be-service --url
  http://192.168.64.6:32347

  $ minikube service flindt-fe-service --url
  http://192.168.64.6:31110
  ```

- Check the memory usage of pods, to update `resources`:

  ```txt
  $ kubectl top pods --all-namespaces
  NAMESPACE        NAME                                        CPU(cores)   MEMORY(bytes)
  flindt-website   flindt-backend-84c45cdf78-n97gg             3m           166Mi
  flindt-website   flindt-frontend-786dfccbc7-kjs7v            0m           4Mi
  kube-system      coredns-576cbf47c7-9m2qs                    2m           15Mi
  ...
  ```

- Access the Grafana dashboard from Minikube:

  ```txt
  $ minikube service monitoring-grafana -n kube-system
  Opening kubernetes service kube-system/monitoring-grafana in default browser...
  ```
