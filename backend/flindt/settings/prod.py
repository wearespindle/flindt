from flindt.settings.base import *  # noqa

DEBUG = boolean(os.environ.get('DEBUG', 0))
TEMPLATE_DEBUG = boolean(os.environ.get('DEBUG', DEBUG))

# Use the cached template loader so template is compiled once and read from
# memory instead of reading from disk on each load.
#TEMPLATES[0]['OPTIONS']['loaders'] = [
#    ('django.template.loaders.cached.Loader', [
#        'django.template.loaders.filesystem.Loader',
#        'django.template.loaders.app_directories.Loader',
#    ]),
#]

# HTTPS and Security Settings
SECURE_HSTS_SECONDS = 31536000 # Future requests for the next year should use HTTPS only
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = 'DENY'
