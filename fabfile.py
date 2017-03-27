"""
Fabfile to deploy Flindt front- and backend using fabric.

For the frontend you need aws cli installed.
   pip install awscli
And an ~/.aws/credentials file.
Its contents can be found in team password under "Admin - VoIPGRID - console.aws.amazon.com"

For more info see:
   https://aws.amazon.com/cli/

For manipulation of the backend a ssh certificate "Jenkins.pem" is needed.
it can also be found in team password under "Admin - VoIPGRID - console.aws.amazon.com"
The backend can then be deployed using

  fab -i /location/of/Jenkins.pem deploy_backend
"""


from fabric.api import local, cd, run
from fabric.state import env

# The Flindt ec2 backend
env.hosts = ['ec2-54-171-230-15.eu-west-1.compute.amazonaws.com']
env.user = 'admin'
env.forward_agent = True


def deploy_frontend():
    """
    Build and upload the latest frontend to S3.
    """
    local('./deploy-frontend.sh')


def docker_compose(command):
    """
    Run a docker compose command on the production vm.
    """
    with cd('/srv/feedbacktool-frontend'):
        run('docker-compose -f docker-compose.prod.yml {}'.format(command))


def bash():
    """
    Convenience function: get a bash shell in the backend container on the remote host.
    """
    run('docker exec -it feedbacktoolfrontend_backend_1 bash')


def manage(command):
    """
    run a python manage.py command in the remote docker on the remote host.

    Args:
        command (str): management command to execute.
    """
    run('docker exec -it feedbacktoolfrontend_backend_1 python manage.py {}'.
        format(command))


def deploy_backend():
    """
    Deploy the latest version of the backend.
    """
    with cd('/srv/feedbacktool-frontend'):
        run('git pull --rebase')

    docker_compose('build')
    docker_compose('stop')
    docker_compose('up -d')
    manage('collectstatic --no-input')
    manage('migrate --no-input')


def deploy():
    """
    Deploy both backend and frontend.
    """
    deploy_frontend()
    deploy_backend()
