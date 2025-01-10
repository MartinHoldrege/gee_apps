#!/bin/bash

#  ingest those files into google earth engine


# Author: Martin Holdrege
# Date Started: January 8, 2025

# b/ of aliases etc. for conda environment isn't necessary if bash setup better:
cd ../../ # set directory to gee_apps

source ~/.bashrc


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

earthengine upload image --manifest ./json/test_manifest.json  