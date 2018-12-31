export const METRICS = {
  hdi: {
    label: "Human Development Index",
    display: "hdi",
    global: "hdi_norm",
    local: "hdi_norm_local"
  },
  gni: {
    label: "GNI per Capita",
    display: "gni_per_cap",
    global: "gni_norm",
    local: "gni_norm_local"
  },
  efree: {
    label: "Economic Freedom",
    display: "efree",
    global: "efree_norm",
    local: "efree_norm_local"
  },
  year: {
    label: "Year",
    display: "year"
  }
};

export const CONFIGS = {
  dataDisplay: {
    options: [
      { label: "HDI vs GNI", id: "hdi_gni" },
      { label: "Economic Freedom vs GNI", id: "efree_gni" },
      { label: "HDI vs Economic Freedom", id: "hdi_efree" }
    ]
  },
  sortOrder: {
    options: [{ label: "Alphabetically", id: "alpha" }]
  },
  scale: {
    options: [
      { label: "Global", id: "global" },
      { label: "Country-level", id: "local" }
    ]
  }
};
