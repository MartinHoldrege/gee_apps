# purpose create strings that can be pasted into javascript scripts
# so can loop over image names, and their visualization parameters

library(tidyverse)

dat <- read_csv("D://USGS/large_files/gee_apps/data-raw/newRR3_COGs_GEEapp/RrAppFileList.csv")

paste2j <- function(x) {
  paste0("['",
         paste0(x, collapse = "', '"),
         "']"
  )
}

dat2 <- dat %>% 
  filter(Colors != 'type0') %>% 
  mutate(vis = c('type1' = 'visT1',
                 'type2' = 'visT2',
                 'type3' = 'visT3')[Colors],
         row = 1:nrow(.)) %>% 
  arrange(desc(row))

paste2j(dat2$appLayerName) # vector of file names, written as a javascript list
paste0('[', paste0(dat2$vis, collapse = ", "), ']')

