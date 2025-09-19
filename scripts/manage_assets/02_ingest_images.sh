#!/bin/bash

#  ingest those files into google earth engine


# Author: Martin Holdrege
# Date Started: January 8, 2025

# b/ of aliases etc. for conda environment isn't necessary if bash setup better:

source ~/.bashrc
cd_proj # alias for moving to directory where projects are
cd gee_apps

# setup environment
conda activate ee

# some things to try and run when initially setting up gcloud
#gcloud init
gcloud auth login
gcloud auth application-default login # (not always necessary)
gcloud config set project "ee-martinholdrege" # at least uncomment this line
earthengine authenticate
earthengine set_project "ee-martinholdrege" #  at least uncomment this line


# see https://developers.google.com/earth-engine/guides/image_manifest

# Loop through all JSON files in the ./json directory
for file in ./json/manifest_*_*.json; do
  # Run the earthengine command for each JSON file
  echo "$file"
  earthengine upload image --manifest "$file"
done