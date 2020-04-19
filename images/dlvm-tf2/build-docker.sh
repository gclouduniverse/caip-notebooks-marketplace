#!/bin/bash

# Ideally just use Docker functionality from IDEA

docker build . -t docker.pkg.github.com/gclouduniverse/caip-notebooks-marketplace/tf2-jupyterlab2
docker push docker.pkg.github.com/gclouduniverse/caip-notebooks-marketplace/tf2-jupyterlab2