#!/bin/bash

# Ideally just use Docker functionality from IDEA

docker build . -t gcr.io/caip-notebooks-marketplace-dev/firebase-cli
docker push gcr.io/caip-notebooks-marketplace-dev/firebase-cli