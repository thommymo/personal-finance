//This is data that will come from a database later

export const portfolio =  [
  { name: "DKB EUR Privatkonto", y: 841, description: "Cash", type: "Cash", currency: "EUR" },
  { name: "Postfinance Privatkonto 2", y: 3361, description: "Cash", type: "Cash", currency: "CHF" },
  { name: "Postfinance Privatkonto", y: 13402, description: "Cash", type: "Cash", currency: "CHF" },
  { name: "Postfinance Sparkonto", y: 60806, description: "Cash", type: "Cash", currency: "CHF" },
  { name: "True Wealth GBP Account", y: 41, description: "Cash", type: "Cash", currency: "GBP"  },
  { name: "True Wealth USD Account", y: 400, description: "Cash", type: "Cash", currency: "USD"  },
  { name: "True Wealth EUR Account", y: 86, description: "Cash", type: "Cash", currency: "EUR"  },
  { name: "True Wealth CHF Account", y: 41, description: "Cash", type: "Cash", currency: "CHF"  },
  { name: "ABL kurzfristig", y: 20300, description: "Cash", type: "Cash", currency: "CHF", interest: 0.1 },
  { name:"SPDR® FTSE UK All Share UCITS ETF", y: 17, type: "Equities", exchange: "SWX", symbol: 'IE00B7452L46', currency: "CHF"},
  { name:"iShares STOXX Europe 600 UCITS ETF", y: 32, type: "Equities", exchange: "SWX", symbol: 'DE0002635307', currency: "EUR"},
  { name:"Vanguard US Total Stock Market Shares Index ETF", y: 8, type: "Equities", exchange: "NYSE", symbol: 'VTI', currency: "USD"},
  { name:"Vanguard FTSE Emerging Markets ETF", y: 34, type: "Equities", exchange: "NYSE", symbol: 'VWO', currency: "USD"},
  { name:"Vanguard FTSE Pacific ETF", y: 13, type: "Equities", exchange: "NYSE", symbol: 'VPL', currency: "USD"},
  { name:"UBS ETF (CH) - SMI (CHF)", y: 96, type: "Equities", exchange: "SWX", symbol: 'CH0017142719', currency: "CHF"},
  { name:"ZKB Gold ETF A (CHF)", y: 5, type: "Natural Resources", exchange: "SWX", symbol: 'CH0139101593', currency: "CHF"},
  { name:"ETFS Longer Dated All Commodities GO UCITS ETF", y: 180, type: "Natural Resources", exchange: "SWX", symbol: 'IE00B4WPHX27', currency: "CHF"},
  { name:"Vanguard REIT ETF", y: 25, type: "Real Estate", exchange: "NYSE", symbol: 'VNQ', currency: "USD"},
  { name:"Vanguard Global ex-US Real Estate ETF", y: 13, type: "Real Estate", exchange: "NYSE", symbol: 'VNQI', currency: "USD"},
  { name: "ABL 8 Jahre", y: 20000, description: "Cash", type: "Private Loan", currency: "CHF", interest: 1.5 },
  { name: "ABL Genossenschaftsanteile", y: 4000, description: "Coop", type: "coop", currency: "CHF", interest: 2.5 },
  { name: "Viac 3a Konto", y: 6768, description: "Retirement Cash", type: "Retirement Money", currency: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 20782, description: "Retirement Cash", type: "Retirement Money", currency: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 21490, description: "Retirement Cash", type: "Retirement Money", currency: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 13616, description: "Retirement Cash", type: "Retirement Money", currency: "CHF", interest: 0.3 },
  { name: "LUPK Pensionskasse", y: 94000, description: "Retirement Cash", type: "Retirement Money", currency: "CHF", interest: 1.5 },
]
export const currency = {
  GBP: 1.2,
  CHF: 1,
  USD: 0.95,
  EUR: 1.15
}
export const holdingsWithMarketPrice = [
  "Equities",
  "Natural Resources",
  "Real Estate",
]
export const shareValue = {
  IE00B7452L46:51.12,
  DE0002635307:39.07,
  VTI:140.37,
  VWO:47.86,
  VPL:75.01,
  CH0017142719:96.96,
  CH0139101593:394.20,
  IE00B4WPHX27:14.34,
  VNQ:81.05,
  VNQI: 62.38
}
