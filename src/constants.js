export const METRICS = {
  hdi: {
    label: "Human Development Index",
    display: "hdi",
    global: "hdi_norm",
    local: "hdi_norm_local",
    sortable: "hdi_max"
  },
  gdp: {
    label: "GDP per Capita",
    display: "gdp_per_cap",
    global: "gdp_norm",
    local: "gdp_norm_local",
    sortable: "gdp_max"
  },
  gni: {
    label: "GNI per Capita",
    display: "gni_per_cap",
    global: "gni_norm",
    local: "gni_norm_local",
    sortable: "gni_max"
  },
  efree: {
    label: "Economic Freedom",
    display: "efree",
    global: "efree_norm",
    local: "efree_norm_local",
    sortable: "efree_max"
  },
  year: { label: "Year", display: "year" }
};

export const CONFIGS = {
  dataDisplay: {
    options: [
      { label: "HDI vs GDP", id: "hdi_gdp" },
      { label: "Economic Freedom vs GDP", id: "efree_gdp" },
      { label: "HDI vs Economic Freedom", id: "hdi_efree" }
    ]
  },
  sortOrder: {
    options: [
      { label: "By HDI", id: "hdi" },
      { label: "By GDP", id: "gdp" },
      { label: "By Economic Freedom", id: "efree" },
      { label: "By Region", id: "region" },
      { label: "Alphabetically", id: "alpha" }
    ]
  },
  scale: {
    options: [
      { label: "Country-level", id: "local" },
      { label: "Global", id: "global" }
    ]
  }
};

export const SCATTER_LABELS = {
  hdi: {
    "United States": { id: "United States", position: "below" },
    Singapore: { id: "Singapore", position: "below" },
    Italy: { id: "Italy", position: "below" },
    Iraq: { id: "Italy", position: "below" },
    Sudan: { id: "Italy", position: "right" },
    Chad: { id: "Italy", position: "right" }
  },
  efree: {
    "United States": { id: "United States", position: "below" },
    Singapore: { id: "Singapore", position: "below" },
    Italy: { id: "Italy", position: "below" },
    Iraq: { id: "Iraq", position: "below" },
    Algeria: { id: "Algeria", position: "below" },
    Chile: { id: "Chile", position: "below" },
    Switzerland: { id: "Switzerland", position: "below" }
  }
};
