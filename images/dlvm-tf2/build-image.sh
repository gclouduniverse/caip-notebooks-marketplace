#!/bin/bash

export ID=$(date +%s)
packer build ./dlvm-tf2-pakcer.json
gcloud compute images add-iam-policy-binding "dlvm-tensorflow2-${ID}" \
    --member="allAuthenticatedUsers" \
    --role="roles/compute.imageUser" \
    --project "caip-notebooks-marketplace-dev"