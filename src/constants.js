export const EXTENT = [-0.05, 1.05];

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
  gini: {
    label: "Gini Index",
    display: "gini",
    global: "gini_norm",
    local: "gini_norm_local",
    sortable: "gini_max"
  },
  year: { label: "Year", display: "year" }
};

export const CONFIGS = {
  dataDisplay: {
    options: [
      { label: "HDI vs GDP", id: "hdi_gdp" },
      { label: "Economic Freedom vs GDP", id: "efree_gdp" },
      { label: "Gini vs GDP", id: "gini_gdp" },
      { label: "HDI vs Economic Freedom", id: "hdi_efree" },
      { label: "HDI vs Gini", id: "hdi_gini" },
      { label: "Gini vs Economic Freedom", id: "gini_efree" }
    ]
  },
  sortOrder: {
    options: [
      { label: "By HDI", id: "hdi" },
      { label: "By GDP", id: "gdp" },
      { label: "By Economic Freedom", id: "efree" },
      { label: "By Gini Index", id: "gini" },
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

export const ANNOTATIONS = {
  "Norway:hdi:gdp:local": [
    { year: 2015, text: "Falling oil prices impact GDP.", dx: 47, dy: -21 }
  ],
  "United Kingdom:hdi:gdp:local": [
    { year: 2009, text: "The Great Recession.", dx: -38, dy: -26 }
  ],
  "Sweden:hdi:gdp:local": [
    { year: 2009, text: "The Great Recession.", dx: -9, dy: -46 }
  ],
  "Libya:hdi:gdp:local": [
    { year: 2011, text: "First Libyan Civil War.", dx: 0, dy: -139 }
  ],
  "Iraq:hdi:gdp:local": [
    {
      year: 2003,
      text: "US invades of Iraq for weapons of mass destruction.",
      dx: 0,
      dy: -139
    }
  ],
  "Zimbabwe:hdi:gdp:local": [
    {
      year: 2009,
      text: "Power-sharing agreement between president and prime minister.",
      dx: 0,
      dy: -109
    }
  ],
  "Singapore:hdi:gdp:global": [
    {
      year: 2010,
      text:
        "Singapore has one of the most open and least corrupt economies in the world.",
      dx: -5,
      dy: 97
    }
  ],
  "Singapore:efree:gdp:global": [
    {
      year: 2010,
      text:
        "Singapore has one of the most open and least corrupt economies in the world.",
      dx: -5,
      dy: 97
    }
  ],
  "Azerbaijan:gini:gdp:local": [
    {
      year: 2002,
      text:
        "Researchers suggest low Gini values are due to data collection issues.",
      dx: 59,
      dy: -41
    }
  ],
  "Azerbaijan:gini:hdi:local": [
    {
      year: 2002,
      text:
        "Researchers suggest low Gini values are due to data collection issues.",
      dx: 59,
      dy: -41
    }
  ],
  "Azerbaijan:hdi:gini:local": [
    {
      year: 2002,
      text:
        "Researchers suggest low Gini values are due to data collection issues.",
      dx: 59,
      dy: -41
    }
  ],
  "Azerbaijan:gini:efree:local": [
    {
      year: 2002,
      text:
        "Researchers suggest low Gini values are due to data collection issues.",
      dx: 59,
      dy: -41
    }
  ],
  "Azerbaijan:gini:gdp:global": [
    {
      year: 2002,
      text:
        "Researchers suggest low Gini values are due to data collection issues.",
      dx: 59,
      dy: -41
    }
  ],
  "Azerbaijan:hdi:gini:global": [
    {
      year: 2002,
      text:
        "Researchers suggest low Gini values are due to data collection issues.",
      dx: 65,
      dy: 31
    }
  ],
  "Azerbaijan:gini:efree:global": [
    {
      year: 2002,
      text:
        "Researchers suggest low Gini values are due to data collection issues.",
      dx: -26,
      dy: -38
    }
  ],
  "El Salvador:efree:gdp:local": [
    {
      year: 2011,
      text:
        "Bureaucracy, corruption, and government interference has erroded Economic Freedom.",
      dx: 4,
      dy: -43
    }
  ],
  "Sudan:hdi:gdp:local": [
    { year: 2013, text: "South Sudanese Civil War.", dx: -1, dy: 71 }
  ],
  "Haiti:hdi:gdp:local": [
    { year: 2010, text: "2010 Haiti earthquake.", dx: 0, dy: -90 }
  ]
};
