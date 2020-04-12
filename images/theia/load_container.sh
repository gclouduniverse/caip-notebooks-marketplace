#!/bin/bash -eu
#
# Copyright 2018 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

source /opt/c2d/c2d-utils || exit 1
source /etc/profile.d/env.sh || exit 1

install_driver_if_needed_or_prompt_user

rm -f /tmp/dlvm-NOPROXY
function set_error_message_container() {
  local message=$1
  set_error_message "${message}"
  # All startup scripts will execute regardless of prior exit codes.
  # In failure mode, write a signal file so register script does not
  # overwrite error in proxy-url/proxy-status.
  touch /tmp/dlvm-NOPROXY
}

set +e
CONTAINER=$(get_attribute_value container)
set -e
if [[ -z "${CONTAINER}" ]]; then
  set_error_message_container "ERROR: 'container' not found in metadata."
  exit 1
fi

PHYSICAL_GPU_MODE=$(physical_gpu_mode)
RUNTIME_FLAG=""
if [[ "${PHYSICAL_GPU_MODE}" == "${GPU_MODE_GPU_FOUND}" ]]; then
  if ! nvidia-smi > /dev/null 2>&1; then
    set_error_message_container "ERROR: NVIDIA driver must be installed for GPU-enabled containers."
    exit 1
  fi
  RUNTIME_FLAG="--runtime=nvidia"
fi

ENV_FILE_FLAG=$(get_env_file_flag_from_metadata container-env-file)

readonly CONTAINER_NAME="payload-container3"
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

# uses service account credentials to access gcr.io containers.
set +e
echo "Loading ${CONTAINER}."
gcloud auth configure-docker --quiet
count=0
num_of_retry=10
until [[ "${count}" -ge "${num_of_retry}" ]]
do
  docker pull "${CONTAINER}" && break
  count=$[$count+1]
  sleep 3
done

UI_NAME="$(docker inspect --format '{{ index .Config.Labels "com.google.environment"}}' ${CONTAINER})"
if [[ ! -z "${UI_NAME}" ]]; then
  echo "${UI_NAME}" > "${FRAMEWORK_FILE_PATH}"
fi

if [[ "${count}" -ge "${num_of_retry}" ]]; then
  set_error_message_container "ERROR: unable to pull ${CONTAINER}."
  exit 1
fi

docker run -d \
    ${RUNTIME_FLAG} \
    ${ENV_FILE_FLAG} \
    --restart always \
    --net=host \
    --name "${CONTAINER_NAME}" \
    "${CONTAINER}"
