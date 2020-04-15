#!/bin/bash

export ID=$(date +%s)
packer build ./build-theia-pakcer.json
gcloud compute images add-iam-policy-binding "theia-ide-${ID}" \
    --member="allAuthenticatedUsers" \
    --role="roles/compute.imageUser" \
    --project "caip-notebooks-marketplace-dev"