#!/bin/bash -e

# requires the aws cli
# see https://aws.amazon.com/cli/

docker-compose build frontend
docker-compose run --rm frontend gulp build-production
mkdir upload
cp frontend/index.html upload
cp -r frontend/dist upload

aws s3 sync upload s3://feedbag.wearespindle.com/ --acl public-read

rm -rf upload
