export const EXTENT = [-0.05, 1.05];

export const METRICS = {
  hdi: {
    label: 'Human Development Index',
    display: 'hdi',
    global: 'hdi_norm',
    local: 'hdi_norm_local',
    sortable: 'hdi_max',
  },
  gdp: {
    label: 'GDP per Capita',
    display: 'gdp_per_cap',
    global: 'gdp_norm',
    local: 'gdp_norm_local',
    sortable: 'gdp_max',
  },
  gni: {
    label: 'GNI per Capita',
    display: 'gni_per_cap',
    global: 'gni_norm',
    local: 'gni_norm_local',
    sortable: 'gni_max',
  },
  efree: {
    label: 'Economic Freedom',
    display: 'efree',
    global: 'efree_norm',
    local: 'efree_norm_local',
    sortable: 'efree_max',
  },
  gini: {
    label: 'Gini Index',
    display: 'gini',
    global: 'gini_norm',
    local: 'gini_norm_local',
    sortable: 'gini_max',
  },
  year: { label: 'Year', display: 'year' },
};

export const CONFIGS = {
  dataDisplay: {
    options: [
      { label: 'HDI vs GDP', id: 'hdi_gdp' },
      { label: 'Economic Freedom vs GDP', id: 'efree_gdp' },
      { label: 'Gini vs GDP', id: 'gini_gdp' },
      { label: 'HDI vs Economic Freedom', id: 'hdi_efree' },
      { label: 'HDI vs Gini', id: 'hdi_gini' },
      { label: 'Economic Freedom vs Gini', id: 'efree_gini' },
    ],
  },
  sortOrder: {
    options: [
      { label: 'By Region', id: 'region' },
      { label: 'By HDI', id: 'hdi' },
      { label: 'By GDP', id: 'gdp' },
      { label: 'By Economic Freedom', id: 'efree' },
      { label: 'By Gini Index', id: 'gini' },
      { label: 'Alphabetically', id: 'alpha' },
    ],
  },
  scale: {
    options: [{ label: 'Country-level', id: 'local' }, { label: 'Global', id: 'global' }],
  },
};

export const SCATTER_LABELS = {
  hdi: {
    'United States': { id: 'United States', position: 'below' },
    Singapore: { id: 'Singapore', position: 'below' },
    Italy: { id: 'Italy', position: 'below' },
    Iraq: { id: 'Italy', position: 'below' },
    Sudan: { id: 'Italy', position: 'right' },
    Chad: { id: 'Italy', position: 'right' },
  },
  efree: {
    'United States': { id: 'United States', position: 'below' },
    Singapore: { id: 'Singapore', position: 'below' },
    Italy: { id: 'Italy', position: 'below' },
    Iraq: { id: 'Iraq', position: 'below' },
    Algeria: { id: 'Algeria', position: 'below' },
    Chile: { id: 'Chile', position: 'below' },
    Switzerland: { id: 'Switzerland', position: 'below' },
  },
};

export const ANNOTATIONS = {
  'Norway:hdi:gdp:local': [{ year: 2015, text: 'Falling oil prices impact GDP.', dx: -81, dy: 8 }],
  'United Kingdom:hdi:gdp:local': [{ year: 2009, text: 'The Great Recession.', dx: -38, dy: -26 }],
  'United States:hdi:gdp:local': [{ year: 2009, text: 'The Great Recession.', dx: -27, dy: -9 }],
  'Sweden:hdi:gdp:local': [{ year: 2009, text: 'The Great Recession.', dx: -9, dy: -76 }],
  'Libya:hdi:gdp:local': [{ year: 2011, text: 'First Libyan Civil War.', dx: 0, dy: -139 }],
  'Libya:hdi:gdp:global': [{ year: 2011, text: 'First Libyan Civil War.', dx: 70, dy: 50 }],
  'Iraq:hdi:gdp:local': [
    {
      year: 2003,
      text: 'US invades of Iraq for weapons of mass destruction.',
      dx: 0,
      dy: -139,
    },
  ],
  'Zimbabwe:hdi:gdp:local': [
    {
      year: 2009,
      text: 'Power-sharing agreement between president and prime minister.',
      dx: 0,
      dy: -109,
    },
  ],
  'Singapore:hdi:gdp:global': [
    {
      year: 2010,
      text: 'Singapore has one of the most open and least corrupt economies in the world.',
      dx: -5,
      dy: 97,
    },
  ],
  'Singapore:efree:gdp:global': [
    {
      year: 2010,
      text: 'Singapore has one of the most open and least corrupt economies in the world.',
      dx: -5,
      dy: 97,
    },
  ],
  'Azerbaijan:gini:gdp:local': [
    {
      year: 2002,
      text: 'Researchers suggest low Gini values are due to data collection issues.',
      dx: 59,
      dy: -41,
    },
  ],
  'Azerbaijan:gini:hdi:local': [
    {
      year: 2002,
      text: 'Researchers suggest low Gini values are due to data collection issues.',
      dx: 59,
      dy: -41,
    },
  ],
  'Azerbaijan:hdi:gini:local': [
    {
      year: 2002,
      text: 'Researchers suggest low Gini values are due to data collection issues.',
      dx: 59,
      dy: -41,
    },
  ],
  'Azerbaijan:gini:efree:local': [
    {
      year: 2002,
      text: 'Researchers suggest low Gini values are due to data collection issues.',
      dx: 59,
      dy: -41,
    },
  ],
  'Azerbaijan:gini:gdp:global': [
    {
      year: 2002,
      text: 'Researchers suggest low Gini values are due to data collection issues.',
      dx: 59,
      dy: -41,
    },
  ],
  'Azerbaijan:hdi:gini:global': [
    {
      year: 2002,
      text: 'Researchers suggest low Gini values are due to data collection issues.',
      dx: 65,
      dy: 31,
    },
  ],
  'Azerbaijan:gini:efree:global': [
    {
      year: 2002,
      text: 'Researchers suggest low Gini values are due to data collection issues.',
      dx: -26,
      dy: -38,
    },
  ],
  'El Salvador:efree:gdp:local': [
    {
      year: 2011,
      text: 'Bureaucracy and government interference has erroded Economic Freedom.',
      dx: 4,
      dy: -43,
    },
  ],
  'Sudan:hdi:gdp:local': [{ year: 2013, text: 'South Sudanese Civil War.', dx: -1, dy: 71 }],
  'Haiti:hdi:gdp:local': [{ year: 2010, text: '2010 Haiti earthquake.', dx: 0, dy: -90 }],
  'Greece:hdi:gdp:local': [{ year: 2009, text: 'Greek government debt crisis.', dx: -8, dy: 98 }],
  'Jordan:hdi:gdp:local': [{ year: 2011, text: 'Arab Spring protests.', dx: -9, dy: 58 }],
  'United States:efree:gdp:local': [
    {
      year: 2010,
      text: 'Federal regulations increased during Barack Obama’s presidency',
      dx: -2,
      dy: 33,
    },
  ],
  'Cambodia:hdi:gdp:global': [
    { year: 2011, text: 'Poverty rate has been cut in half since 2004.', dx: 66, dy: 0 },
  ],
  'Cambodia:hdi:gdp:local': [
    { year: 2011, text: 'Poverty rate has been cut in half since 2004.', dx: 12, dy: 72 },
  ],
  'Sri Lanka:hdi:gdp:global': [
    {
      year: 2008,
      text: 'Sri Lanka provides free health and education services to its citizens.',
      dx: 70,
      dy: 57,
    },
  ],
  'Malawi:hdi:gdp:local': [{ year: 2002, text: 'Malawian food crisis.', dx: 22, dy: -113 }],
  'Central African Republic:hdi:gdp:local': [
    { year: 2012, text: 'Start of Civil War.', dx: -46, dy: -1 },
  ],
};
