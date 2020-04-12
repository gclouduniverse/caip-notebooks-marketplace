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
ENV_FILE="/etc/profile.d/env.sh"
source "${ENV_FILE}" || exit 1

if [[ -e /tmp/dlvm-NOPROXY ]]; then
  echo "Required upstream script failed, will not attempt to connect to proxy."
  exit 0
fi

PROXY_MODE=$(get_proxy_mode)
INSTANCE_NAME=$(get_metadata_value "instance/name")
INSTANCE_ZONE="/"$(get_metadata_value "instance/zone")
INSTANCE_ZONE="${INSTANCE_ZONE##/*/}"
MAIL=""
SERVICE_ACCOUNT=""

PROXY_AGENT_CONFIG="${DL_PATH}/proxy-agent-config.json"

function set_error_message_proxy() {
  local message=$1
  local err_code=$2

  local ui_msg="Error: $message. Please connect to notebook via SSH instead"

  local console_msg="Error: $message"
  if [ ! -z $err_code ]
  then
    console_msg="$console_msg ($err_code)"
  fi

  echo $console_msg >&2

  set_error_message "${ui_msg}"
}

if [[ "${PROXY_MODE}" = "${PROXY_MODE_NONE}" ]]; then
  echo "proxy mode is NONE, exiting"
  exit 0
elif [[ "${PROXY_MODE}" = "${PROXY_MODE_MAIL}" ]]; then
  if [[ ! -z $(get_attribute_value proxy-user-mail) ]]; then
    MAIL=$(get_attribute_value proxy-user-mail)
    echo "Proxy mode is mail with proxy-user-mail=${MAIL}"
  else
    echo "Mail for the proxy is not set, proxy access will not be activated."
    exit 0
  fi
elif [[ "${PROXY_MODE}" = "${PROXY_MODE_PROJECT_EDITORS}" ]]; then
  echo "Proxy mode is ${PROXY_MODE_PROJECT_EDITORS}."
elif [[ "${PROXY_MODE}" = "${PROXY_MODE_SERVICE_ACCOUNT}" ]]; then
    SERVICE_ACCOUNT=$(get_service_account)
    echo "Proxy mode is service account with service account ${SERVICE_ACCOUNT}"
else
  echo "Unknown proxy mode: ${PROXY_MODE}, no proxy access will be enabled."
  exit 0
fi

# Get the latest agent config. Don't try registering with Proxy if this fails
# Doing it in this cumbersome way so that other scripts invoked after this one
# continue to get executed
set +e
"${DL_PATH}/bin/update_proxy_agent.sh"
RETVAL=$?
set -e

if [ "$RETVAL" -gt 0 ]
then
  echo "Error: Could not update proxy agent ($RETVAL).  This can happen if you're inside a VPC-SC perimeter or don't have access to public GKE images. Using local agent instead"
fi

VERSION=$(cat "${VERSION_FILE_PATH}")
PROXY_URL=""
if [[ ! -z $(get_attribute_value proxy-registration-url) ]]; then
  PROXY_URL=$(get_attribute_value proxy-registration-url)
else
  PROXY_URL=$(python /opt/deeplearning/bin/get_proxy_url.py --config-file-path "${PROXY_AGENT_CONFIG}" --location "${INSTANCE_ZONE}" --version "${VERSION}")
fi

if [[ -z "${PROXY_URL}" ]]; then
  set_error_message_proxy "Proxy is not supported in zone ${INSTANCE_ZONE}"
  exit 0
fi

echo "Proxy URL from the config: ${PROXY_URL}"

VM_ID=$(curl -H 'Metadata-Flavor: Google' "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?format=full&audience=${PROXY_URL}/request-endpoint"  2>/dev/null)

set +e
RESULT_JSON=""
if [[ "${PROXY_MODE}" = "${PROXY_MODE_MAIL}" ]]; then
  RESULT_JSON=$(curl -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "X-Inverting-Proxy-VM-ID: ${VM_ID}" -d "${MAIL}" "${PROXY_URL}/request-endpoint" 2>/dev/null)
elif [[ "${PROXY_MODE}" = "${PROXY_MODE_PROJECT_EDITORS}" ]]; then
  RESULT_JSON=$(curl -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "X-Inverting-Proxy-VM-ID: ${VM_ID}" -d "" "${PROXY_URL}/request-endpoint" 2>/dev/null)
elif [[ "${PROXY_MODE}" = "${PROXY_MODE_SERVICE_ACCOUNT}" ]]; then
  RESULT_JSON=$(curl -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "X-Inverting-Proxy-VM-ID: ${VM_ID}" -d "" "${PROXY_URL}/request-endpoint" 2>/dev/null)
else
  set_error_message_proxy "Unknown proxy mode: ${PROXY_MODE}, no proxy access will be enabled."
  set -e
  exit 0
fi
RETVAL=$?
set -e

echo "Response from the registration server: ${RESULT_JSON}"
if [ "$RETVAL" -gt 0 ]
then
  set_error_message_proxy "Could not register with proxy" $RETVAL
  exit 0
fi

HOSTNAME=$(echo "${RESULT_JSON}" | jq -r ".hostname")
BACKEND_ID=$(echo "${RESULT_JSON}" | jq -r ".backendID")

# Following echo output will appear in the serial log output and will allow UI to get this information even if it does
# not exist in metadata.
echo "Hostname: ${HOSTNAME}"
echo "Backend id: ${BACKEND_ID}"

USE_SHIM_WEBSOCKETS=true
if [[ ! -z $(get_attribute_value use-shim-websockets) ]]; then
  # Try to use VM metadata. Used mostly for testing.
  USE_SHIM_WEBSOCKETS=$(get_attribute_value use-shim-websockets)
else
  USE_SHIM_WEBSOCKETS=$(python /opt/deeplearning/bin/get_key_value.py --config-file-path "${PROXY_AGENT_CONFIG}" --location "${INSTANCE_ZONE}" --version "${VERSION}" --key "use-shim-websockets" --default-value true)
fi

# Default to JupyterLab, allow customers to change for alternate services.
HEALTH_CHECK_PATH="/api/kernelspecs"
if [[ ! -z "$(get_attribute_value agent-health-check-path)" ]]; then
  HEALTH_CHECK_PATH="$(get_attribute_value agent-health-check-path)"
fi

AGENT_ENV_FILE=$(get_env_file_flag_from_metadata agent-env-file)
CONTAINER_URL=$(python /opt/deeplearning/bin/get_latest_proxy_agent_container_hash.py  --config-file-path "${PROXY_AGENT_CONFIG}" --version "${VERSION}")
CONTAINER_NAME="proxy-agent"
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi
echo "*** ${USE_SHIM_WEBSOCKETS}"
docker run -d \
       --env "BACKEND=${BACKEND_ID}" \
       --env "PROXY=${PROXY_URL}/" \
       --env "SHIM_WEBSOCKETS=${USE_SHIM_WEBSOCKETS}" \
       --env "SHIM_PATH=websocket-shim" \
       --env "PORT=3000" \
       --env "HEALTH_CHECK_PATH=${HEALTH_CHECK_PATH}" \
       --env "HEALTH_CHECK_INTERVAL_SECONDS=30" \
       ${AGENT_ENV_FILE} \
       --net=host \
       --restart always \
       --name "${CONTAINER_NAME}" \
       "${CONTAINER_URL}"

if [[ -n "$(get_attribute_value notebooks-api || true)" ]]; then
  set_instance_metadata_local "proxy-url" "${HOSTNAME}"
else
  # This operation might fail due to strange bug (b/127660492) therefore it should always be executed last.
  timeout 30 gcloud compute instances add-metadata "${INSTANCE_NAME}" \
    --metadata proxy-url="${HOSTNAME}" --zone "${INSTANCE_ZONE}"

  # We've successfully connected to the proxy, so remove any previous error message that may have been set
  timeout 30 gcloud compute instances remove-metadata "${INSTANCE_NAME}" \
      --keys=proxy-status --zone "${INSTANCE_ZONE}"
fi
