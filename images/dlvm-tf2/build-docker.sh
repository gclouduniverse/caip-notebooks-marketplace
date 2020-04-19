#!/bin/bash

# Ideally just use Docker functionality from IDEA

docker build . -t b0noi/tf2-jupyterlab2-gpu
docker push b0noi/tf2-jupyterlab2-gpu
