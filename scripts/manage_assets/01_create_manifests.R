library(jsonlite)

# create json files for ingesting images, defining bandnames and pyramiding policies


# Define a function to create a JSON object
create_json <- function(name, uri) {
  list(
    name = name,
    tilesets = list(
      list(
        sources = list(
          list(
            uris = list(uri)
          )
        )
      )
    ),
    bands = list(
      list(id = "current_suitability", tilesetBandIndex = 0, pyramidingPolicy = "MEAN"),
      list(id = "suitability_245mid", tilesetBandIndex = 1, pyramidingPolicy = "MEAN"),
      list(id = "suitability_370mid", tilesetBandIndex = 2, pyramidingPolicy = "MEAN"),
      list(id = "suitability_585mid", tilesetBandIndex = 3, pyramidingPolicy = "MEAN"),
      list(id = "suitability_245end", tilesetBandIndex = 4, pyramidingPolicy = "MEAN"),
      list(id = "suitability_370end", tilesetBandIndex = 5, pyramidingPolicy = "MEAN"),
      list(id = "suitability_585end", tilesetBandIndex = 6, pyramidingPolicy = "MEAN"),
      list(id = "suitability_change_245mid", tilesetBandIndex = 7, pyramidingPolicy = "MEAN"),
      list(id = "suitability_change_370mid", tilesetBandIndex = 8, pyramidingPolicy = "MEAN"),
      list(id = "suitability_change_585mid", tilesetBandIndex = 9, pyramidingPolicy = "MEAN"),
      list(id = "suitability_change_245end", tilesetBandIndex = 10, pyramidingPolicy = "MEAN"),
      list(id = "suitability_change_370end", tilesetBandIndex = 11, pyramidingPolicy = "MEAN"),
      list(id = "suitability_change_585end", tilesetBandIndex = 12, pyramidingPolicy = "MEAN"),
      list(id = "robust_category_245mid", tilesetBandIndex = 13, pyramidingPolicy = "MODE"),
      list(id = "robust_category_370mid", tilesetBandIndex = 14, pyramidingPolicy = "MODE"),
      list(id = "robust_category_585mid", tilesetBandIndex = 15, pyramidingPolicy = "MODE"),
      list(id = "robust_category_245end", tilesetBandIndex = 16, pyramidingPolicy = "MODE"),
      list(id = "robust_category_370end", tilesetBandIndex = 17, pyramidingPolicy = "MODE"),
      list(id = "robust_category_585end", tilesetBandIndex = 18, pyramidingPolicy = "MODE"),
      list(id = "transparency_mask_binary", tilesetBandIndex = 19, pyramidingPolicy = "MODE")
    )
  )
}

# Define the list of names and URIs
spp <- c("juniperus_californica", "juniperus_deppeana", "juniperus_monosperma", 
         "juniperus_occidentalis", "juniperus_osteosperma", "juniperus_scopulorum", 
         "pinus_cembroides", "pinus_edulis", "pinus_monophylla")

asset_names <- paste0(spp, '_suitability_layers_01102025')
names <- paste0("projects/ee-martinholdrege/assets/misc/pj_niche/", asset_names)

uris <- paste0('gs://gee_apps/pj/', asset_names, '.tif')

# Create JSON files
for (i in seq_along(names)) {
  json_data <- create_json(names[i], uris[i])
  json_file_name <- paste0("manifest_", spp[i], ".json")
  write_json(json_data, file.path('json', json_file_name), pretty = TRUE, auto_unbox = TRUE)
  cat(paste("Created:", json_file_name, "\n"))
}