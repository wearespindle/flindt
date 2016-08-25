import os


try:
    # Load the .env file in the project root and set them as system properties.
    # This is useful when you want to run the django server (or tools) without Foreman.
    curfile = os.path.abspath(os.path.dirname(__file__))
    with open(curfile + '/../../.env') as f:
        for line in f:
            line = line.strip()
            if len(line) > 0 and not line.startswith('#'):
                index = line.index('=')
                key = line[0:index]
                value = line[index + 1:]
                os.environ[key] = value
except:
    pass

if os.getenv('ENVIRONMENT', 'local') == 'prod':
    from .prod import *  # noqa
else:
    from .local import *  # noqa
