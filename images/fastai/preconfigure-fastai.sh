#!/bin/bash

readonly JUPYTER_USER_HOME="/home/jupyter"

cd "${JUPYTER_USER_HOME}" || exit 1

git clone https://github.com/fastai/fastai.git -b 1.0.59
git clone https://github.com/fastai/course-v3.git

chown jupyter:juypter -R "${JUPYTER_USER_HOME}"
