#!/bin/bash -eu

gsutil cp gs://marketplace-public-files/fastai/load_container.sh /opt/deeplearning/bin/load_container.sh
chmod +x /opt/deeplearning/bin/load_container.sh
gsutil cp gs://marketplace-public-files/fastai/attempt-register-vm-on-proxy.sh \
  /opt/deeplearning/bin/attempt-register-vm-on-proxy.sh
chmod +x /opt/deeplearning/bin/attempt-register-vm-on-proxy.sh