#!/bin/bash

# Purpose: change access permissions of assets

# Author: Martin Holdrege

# Script started April 4, 2023

cd
source $".bashrc" # b/ of aliases etc. for conda environment (just needed b/ idiosyncracies on my machine)
conda activate ee # earthengine commandline environment

# Set the Earth Engine asset folder
FOLDER="projects/ee-martinholdrege/assets/misc/newRR3" #earth engine directory

earthengine authenticate
earthengine set_project "ee-martinholdrege"
# recursively list all assets in the folder and save their paths in a file
earthengine ls -r $FOLDER > temp_assets.txt

# Loop through the assets and change their permissions
while read -r ASSET; do
  echo "$ASSET"
  COMMAND="earthengine acl set public $ASSET"

  eval $COMMAND # not sure why the straight 'eval' didn't work but this is working now
done < temp_assets.txt


# Remove the temporary file
rm temp_assets.txt
