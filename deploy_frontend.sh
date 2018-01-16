#!/usr/bin/env bash -e

# Requires the aws cli
# See https://aws.amazon.com/cli/

docker-compose build frontend
docker-compose run --rm frontend npm run build

mkdir upload
cp -r frontend/build/* upload

aws s3 sync upload s3://feedbag.wearespindle.com/ --acl public-read

rm -rf upload
