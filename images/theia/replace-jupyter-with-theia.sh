#!/bin/bash

rm /var/lock/google_vm_config.lock
systemctl --no-reload --now disable /lib/systemd/system/jupyter.service
service jupyter stop
rm /lib/systemd/system/jupyter.service
rm /opt/c2d/scripts/01-enable-jupyter

source /opt/c2d/c2d-utils || exit 1
ENV_FILE="/etc/profile.d/env.sh"
source "${ENV_FILE}" || exit 1
chmod +x "${DL_PATH}/bin/start-theiaide.sh"
add_to_rc_local "${DL_PATH}/bin/start-theiaide.sh"
"${DL_PATH}/bin/start-theiaide.sh"
