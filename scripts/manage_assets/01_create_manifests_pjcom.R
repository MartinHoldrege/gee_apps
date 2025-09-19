# create manifests for the pj community suitability app layers

# dependencies ------------------------------------------------------------


library(jsonlite)
source('src/paths.R')

# create json files for ingesting images for t

files <- list('MODE' = "pj_overlay_fullwest_export_categorical_layers_v2.tif",
           'MEAN' = "pj_overlay_fullwest_numeric_layers.tif")


# get band names ----------------------------------------------------------

bandnames <- purrr::map(files, function(file) {
  names(terra::rast(file.path(path_gee, "data-raw/pj_overlay", file)))
})

# Define a function to create a JSON object
create_json <- function(bandnames, name, uri, pyramidingPolicy) {
  out <- list(
    name = name,
    tilesets = list(
      list(
        sources = list(
          list(
            uris = list(uri)
          )
        )
      )
    ))
  
  bands <- list()
  for(i in 1:length(bandnames)) {
    bands[[i]] <- list(id = bandnames[i], 
                       tilesetBandIndex = i - 1, # 0 indexed
                       pyramidingPolicy = pyramidingPolicy)
  
  }
  out$bands <- bands
  out

}

for (k in seq_along(files)) {
  asset_name <- stringr::str_replace(files[[k]], '.tif', '')
  name <- paste0("projects/ee-martinholdrege/assets/misc/pjcom/", asset_name)
  uri <- paste0('gs://gee_apps/pjcom/', asset_name, '.tif')
  json_file_name <- paste0("manifest_", asset_name, ".json")
  json_data <- create_json(bandnames[[k]], name = name,
                           uri = uri, pyramidingPolicy = names(files)[k])
  write_json(json_data, file.path('json', json_file_name), pretty = TRUE, auto_unbox = TRUE)
  
}
