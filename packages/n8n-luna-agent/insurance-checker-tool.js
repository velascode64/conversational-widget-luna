// n8n Insurance Coverage Checker Tool - FULLY FIXED VERSION
// Handles natural language insurance questions for Luna Physical Therapy
// ALL RETURNS ARE JSON.stringify() FOR n8n COMPATIBILITY

// Insurance coverage data
const insuranceData = {
  "Aetna": {
    "AZ": { "PPO": true, "HMO": "conditional" },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Ambetter": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Anthem": {
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Banner Health": {
    "AZ": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Arizona": {
    "AZ": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Florida": {
    "FL": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Georgia": {
    "GA": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Illinois": {
    "IL": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Indiana": {
    "IN": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Kansas": {
    "KS": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Massachusetts": {
    "MA": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Michigan": {
    "MI": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Minnesota": {
    "MN": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of North Carolina": {
    "NC": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Oklahoma": {
    "OK": { "PPO": true, "HMO": true }
  },
  "Blue Cross Blue Shield of Texas": {
    "TX": { "PPO": true, "HMO": true }
  },
  "Blue KC": {
    "MO": { "PPO": true, "HMO": true }
  },
  "Blue Shield of California": {
    "CA": { "PPO": true, "HMO": true }
  },
  "BlueCross BlueShield of Tennessee": {
    "TN": { "PPO": true, "HMO": true }
  },
  "Boston Medical Center Health Plan": {
    "MA": { "PPO": true, "HMO": true }
  },
  "BridgeSpan Health": {
    "OR": { "PPO": true, "HMO": true }
  },
  "Capital BlueCross": {
    "PA": { "PPO": true, "HMO": true }
  },
  "CareFirst BlueCross BlueShield": {
    "DC": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true }
  },
  "CareSource": {
    "IN": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true }
  },
  "CHAMPVA": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Cigna": {
    "AZ": { "PPO": true, "HMO": "conditional" },
    "CA": { "PPO": true, "HMO": "conditional" },
    "CO": { "PPO": true, "HMO": "conditional" },
    "CT": { "PPO": true, "HMO": "conditional" },
    "DC": { "PPO": true, "HMO": "conditional" },
    "DE": { "PPO": true, "HMO": "conditional" },
    "FL": { "PPO": true, "HMO": "conditional" },
    "GA": { "PPO": true, "HMO": "conditional" },
    "IL": { "PPO": true, "HMO": "conditional" },
    "IN": { "PPO": true, "HMO": "conditional" },
    "MA": { "PPO": true, "HMO": "conditional" },
    "MD": { "PPO": true, "HMO": "conditional" },
    "MI": { "PPO": true, "HMO": "conditional" },
    "MN": { "PPO": true, "HMO": "conditional" },
    "MO": { "PPO": true, "HMO": "conditional" },
    "NC": { "PPO": true, "HMO": "conditional" },
    "NV": { "PPO": true, "HMO": "conditional" },
    "NY": { "PPO": true, "HMO": "conditional" },
    "OH": { "PPO": true, "HMO": "conditional" },
    "OK": { "PPO": true, "HMO": "conditional" },
    "OR": { "PPO": true, "HMO": "conditional" },
    "PA": { "PPO": true, "HMO": "conditional" },
    "TN": { "PPO": true, "HMO": "conditional" },
    "TX": { "PPO": true, "HMO": "conditional" },
    "UT": { "PPO": true, "HMO": "conditional" },
    "VA": { "PPO": true, "HMO": "conditional" },
    "WA": { "PPO": true, "HMO": "conditional" },
    "WI": { "PPO": true, "HMO": "conditional" }
  },
  "Clear Spring Health": {
    "OR": { "PPO": true, "HMO": true }
  },
  "CommunityCare": {
    "OK": { "PPO": true, "HMO": true }
  },
  "ConnectiCare/EmblemHealth": {
    "CT": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true }
  },
  "Coordinated Care": {
    "WA": { "PPO": true, "HMO": true }
  },
  "Coventry Healthcare": {
    "MO": { "PPO": true, "HMO": true }
  },
  "Denver Health Medical Plan": {
    "CO": { "PPO": true, "HMO": true }
  },
  "EmblemHealth": {
    "NY": { "PPO": true, "HMO": true }
  },
  "Empire BlueCross BlueShield": {
    "NY": { "PPO": true, "HMO": true }
  },
  "Excellus BlueCross BlueShield": {
    "NY": { "PPO": true, "HMO": true }
  },
  "First Choice": {
    "TN": { "PPO": true, "HMO": true },
    "WV": { "PPO": true, "HMO": true }
  },
  "First Health": {
    "IL": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true }
  },
  "GEHA": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Geisinger": {
    "PA": { "PPO": true, "HMO": true }
  },
  "Harvard Pilgrim Health Care": {
    "MA": { "PPO": true, "HMO": true }
  },
  "Health Net": {
    "CA": { "PPO": true, "HMO": true }
  },
  "HealthPartners": {
    "MN": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "HealthSmart": {
    "TX": { "PPO": true, "HMO": true }
  },
  "Highmark Blue Cross Blue Shield": {
    "PA": { "PPO": true, "HMO": true }
  },
  "Highmark Blue Cross Blue Shield Delaware": {
    "DE": { "PPO": true, "HMO": true }
  },
  "Highmark Blue Cross Blue Shield of Western New York": {
    "NY": { "PPO": true, "HMO": true }
  },
  "Humana": {
    "AZ": { "PPO": true, "HMO": false },
    "CA": { "PPO": true, "HMO": false },
    "CO": { "PPO": true, "HMO": false },
    "CT": { "PPO": true, "HMO": false },
    "DC": { "PPO": true, "HMO": false },
    "DE": { "PPO": true, "HMO": false },
    "FL": { "PPO": true, "HMO": false },
    "GA": { "PPO": true, "HMO": false },
    "IL": { "PPO": true, "HMO": false },
    "IN": { "PPO": true, "HMO": false },
    "MA": { "PPO": true, "HMO": false },
    "MD": { "PPO": true, "HMO": false },
    "MI": { "PPO": true, "HMO": false },
    "MN": { "PPO": true, "HMO": false },
    "MO": { "PPO": true, "HMO": false },
    "NC": { "PPO": true, "HMO": false },
    "NV": { "PPO": true, "HMO": false },
    "NY": { "PPO": true, "HMO": false },
    "OH": { "PPO": true, "HMO": false },
    "OK": { "PPO": true, "HMO": false },
    "OR": { "PPO": true, "HMO": false },
    "PA": { "PPO": true, "HMO": false },
    "TN": { "PPO": true, "HMO": false },
    "TX": { "PPO": true, "HMO": false },
    "UT": { "PPO": true, "HMO": false },
    "VA": { "PPO": true, "HMO": false },
    "WA": { "PPO": true, "HMO": false },
    "WI": { "PPO": true, "HMO": false }
  },
  "IHC": {
    "UT": { "PPO": true, "HMO": true }
  },
  "Independence Blue Cross": {
    "PA": { "PPO": true, "HMO": true }
  },
  "IU Health Plans": {
    "IN": { "PPO": true, "HMO": true }
  },
  "Kaiser Permanente": {
    "CA": { "PPO": true, "HMO": true, "note": "Only LA/IE/OC areas" }
  },
  "LA Care": {
    "CA": { "PPO": true, "HMO": true, "note": "Only Los Angeles/IE+OC" }
  },
  "Loma Linda Inland Empire Health Plan (IEHP)": {
    "CA": { "PPO": true, "HMO": true, "note": "Only Los Angeles/IE" }
  },
  "Medica": {
    "MN": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Medicaid": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Medical Mutual of Ohio": {
    "OH": { "PPO": true, "HMO": true }
  },
  "Medicare": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Medicare Advantage": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Molina Healthcare": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "WA": { "PPO": false, "HMO": false, "note": "Not accepted in WA" },
    "WI": { "PPO": true, "HMO": true }
  },
  "MultiPlan": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Optum Healthcare Partners Medical Group": {
    "CA": { "PPO": true, "HMO": true, "note": "Only Los Angeles/IE+OC" }
  },
  "Oxford Health Plans": {
    "CT": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true }
  },
  "Premera Blue Cross": {
    "WA": { "PPO": true, "HMO": true }
  },
  "Providence Health Plan": {
    "OR": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true }
  },
  "Regence Blue Cross Blue Shield": {
    "OR": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true }
  },
  "Regence BlueShield": {
    "WA": { "PPO": true, "HMO": true }
  },
  "Renown Health Plan": {
    "NV": { "PPO": true, "HMO": true }
  },
  "Rocky Mountain Health Plans": {
    "CO": { "PPO": true, "HMO": true }
  },
  "Scripps Health": {
    "CA": { "PPO": true, "HMO": true, "note": "Only San Diego" }
  },
  "SelectHealth": {
    "UT": { "PPO": true, "HMO": true }
  },
  "Tricare": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "Tufts Health Plan": {
    "MA": { "PPO": true, "HMO": true }
  },
  "UCLA": {
    "CA": { "PPO": true, "HMO": true, "note": "Only Los Angeles/IE" }
  },
  "UMR": {
    "AZ": { "PPO": true, "HMO": true },
    "CA": { "PPO": true, "HMO": true },
    "CO": { "PPO": true, "HMO": true },
    "CT": { "PPO": true, "HMO": true },
    "DC": { "PPO": true, "HMO": true },
    "DE": { "PPO": true, "HMO": true },
    "FL": { "PPO": true, "HMO": true },
    "GA": { "PPO": true, "HMO": true },
    "IL": { "PPO": true, "HMO": true },
    "IN": { "PPO": true, "HMO": true },
    "MA": { "PPO": true, "HMO": true },
    "MD": { "PPO": true, "HMO": true },
    "MI": { "PPO": true, "HMO": true },
    "MN": { "PPO": true, "HMO": true },
    "MO": { "PPO": true, "HMO": true },
    "NC": { "PPO": true, "HMO": true },
    "NV": { "PPO": true, "HMO": true },
    "NY": { "PPO": true, "HMO": true },
    "OH": { "PPO": true, "HMO": true },
    "OK": { "PPO": true, "HMO": true },
    "OR": { "PPO": true, "HMO": true },
    "PA": { "PPO": true, "HMO": true },
    "TN": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": true },
    "UT": { "PPO": true, "HMO": true },
    "VA": { "PPO": true, "HMO": true },
    "WA": { "PPO": true, "HMO": true },
    "WI": { "PPO": true, "HMO": true }
  },
  "United Healthcare": {
    "AZ": { "PPO": true, "HMO": "conditional" },
    "CA": { "PPO": true, "HMO": "conditional" },
    "CO": { "PPO": true, "HMO": "conditional" },
    "CT": { "PPO": true, "HMO": "conditional" },
    "DC": { "PPO": true, "HMO": "conditional" },
    "DE": { "PPO": true, "HMO": "conditional" },
    "FL": { "PPO": true, "HMO": "conditional" },
    "GA": { "PPO": true, "HMO": "conditional" },
    "IL": { "PPO": true, "HMO": "conditional" },
    "IN": { "PPO": true, "HMO": "conditional" },
    "MA": { "PPO": true, "HMO": "conditional" },
    "MD": { "PPO": true, "HMO": "conditional" },
    "MI": { "PPO": true, "HMO": "conditional" },
    "MN": { "PPO": true, "HMO": "conditional" },
    "MO": { "PPO": true, "HMO": "conditional" },
    "NC": { "PPO": true, "HMO": "conditional" },
    "NV": { "PPO": true, "HMO": "conditional" },
    "NY": { "PPO": true, "HMO": "conditional" },
    "OH": { "PPO": true, "HMO": "conditional" },
    "OK": { "PPO": true, "HMO": "conditional" },
    "OR": { "PPO": true, "HMO": "conditional" },
    "PA": { "PPO": true, "HMO": "conditional" },
    "TN": { "PPO": true, "HMO": "conditional" },
    "TX": { "PPO": true, "HMO": "conditional" },
    "UT": { "PPO": true, "HMO": "conditional" },
    "VA": { "PPO": true, "HMO": "conditional" },
    "WA": { "PPO": true, "HMO": "conditional" },
    "WI": { "PPO": true, "HMO": "conditional" }
  },
  "Workers' Comp": {
    "WA": { "PPO": true, "HMO": true, "note": "Only Accepted in WA" }
  }
};

// Function to normalize insurance names (with validation)
function normalizeInsuranceName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const normalizations = {
    'cigna': 'Cigna',
    'aetna': 'Aetna',
    'ambetter': 'Ambetter',
    'united': 'United Healthcare',
    'unitedhealthcare': 'United Healthcare',
    'uhc': 'United Healthcare',
    'blue cross': 'Blue Cross Blue Shield',
    'bcbs': 'Blue Cross Blue Shield',
    'bluecross': 'Blue Cross Blue Shield',
    'blue shield': 'Blue Cross Blue Shield',
    'anthem': 'Anthem',
    'banner': 'Banner Health',
    'banner health': 'Banner Health',
    'blue cross blue shield of arizona': 'Blue Cross Blue Shield of Arizona',
    'blue cross blue shield of florida': 'Blue Cross Blue Shield of Florida',
    'blue cross blue shield of georgia': 'Blue Cross Blue Shield of Georgia',
    'blue cross blue shield of illinois': 'Blue Cross Blue Shield of Illinois',
    'blue cross blue shield of indiana': 'Blue Cross Blue Shield of Indiana',
    'blue cross blue shield of kansas': 'Blue Cross Blue Shield of Kansas',
    'blue cross blue shield of massachusetts': 'Blue Cross Blue Shield of Massachusetts',
    'blue cross blue shield of michigan': 'Blue Cross Blue Shield of Michigan',
    'blue cross blue shield of minnesota': 'Blue Cross Blue Shield of Minnesota',
    'blue cross blue shield of north carolina': 'Blue Cross Blue Shield of North Carolina',
    'blue cross blue shield of oklahoma': 'Blue Cross Blue Shield of Oklahoma',
    'blue cross blue shield of texas': 'Blue Cross Blue Shield of Texas',
    'blue kc': 'Blue KC',
    'blue shield of california': 'Blue Shield of California',
    'bluecross blueshield of tennessee': 'BlueCross BlueShield of Tennessee',
    'boston medical center health plan': 'Boston Medical Center Health Plan',
    'bridgespan health': 'BridgeSpan Health',
    'capital bluecross': 'Capital BlueCross',
    'carefirst': 'CareFirst BlueCross BlueShield',
    'carefirst bluecross blueshield': 'CareFirst BlueCross BlueShield',
    'caresource': 'CareSource',
    'champva': 'CHAMPVA',
    'clear spring health': 'Clear Spring Health',
    'communitycare': 'CommunityCare',
    'connecticare': 'ConnectiCare/EmblemHealth',
    'emblemhealth': 'ConnectiCare/EmblemHealth',
    'coordinated care': 'Coordinated Care',
    'coventry': 'Coventry Healthcare',
    'coventry healthcare': 'Coventry Healthcare',
    'denver health medical plan': 'Denver Health Medical Plan',
    'empire bluecross blueshield': 'Empire BlueCross BlueShield',
    'excellus bluecross blueshield': 'Excellus BlueCross BlueShield',
    'first choice': 'First Choice',
    'first health': 'First Health',
    'geha': 'GEHA',
    'geisinger': 'Geisinger',
    'harvard pilgrim': 'Harvard Pilgrim Health Care',
    'harvard pilgrim health care': 'Harvard Pilgrim Health Care',
    'health net': 'Health Net',
    'healthpartners': 'HealthPartners',
    'healthsmart': 'HealthSmart',
    'highmark': 'Highmark Blue Cross Blue Shield',
    'highmark blue cross blue shield': 'Highmark Blue Cross Blue Shield',
    'highmark blue cross blue shield delaware': 'Highmark Blue Cross Blue Shield Delaware',
    'highmark blue cross blue shield of western new york': 'Highmark Blue Cross Blue Shield of Western New York',
    'humana': 'Humana',
    'ihc': 'IHC',
    'independence blue cross': 'Independence Blue Cross',
    'iu health plans': 'IU Health Plans',
    'kaiser': 'Kaiser Permanente',
    'kaiser permanente': 'Kaiser Permanente',
    'la care': 'LA Care',
    'loma linda': 'Loma Linda Inland Empire Health Plan (IEHP)',
    'iehp': 'Loma Linda Inland Empire Health Plan (IEHP)',
    'medica': 'Medica',
    'medicaid': 'Medicaid',
    'medical mutual of ohio': 'Medical Mutual of Ohio',
    'medicare': 'Medicare',
    'medicare advantage': 'Medicare Advantage',
    'molina': 'Molina Healthcare',
    'molina healthcare': 'Molina Healthcare',
    'multiplan': 'MultiPlan',
    'optum': 'Optum Healthcare Partners Medical Group',
    'optum healthcare partners medical group': 'Optum Healthcare Partners Medical Group',
    'oxford': 'Oxford Health Plans',
    'oxford health plans': 'Oxford Health Plans',
    'premera': 'Premera Blue Cross',
    'premera blue cross': 'Premera Blue Cross',
    'providence': 'Providence Health Plan',
    'providence health plan': 'Providence Health Plan',
    'regence': 'Regence Blue Cross Blue Shield',
    'regence blue cross blue shield': 'Regence Blue Cross Blue Shield',
    'regence blueshield': 'Regence BlueShield',
    'renown': 'Renown Health Plan',
    'renown health plan': 'Renown Health Plan',
    'rocky mountain': 'Rocky Mountain Health Plans',
    'rocky mountain health plans': 'Rocky Mountain Health Plans',
    'scripps': 'Scripps Health',
    'scripps health': 'Scripps Health',
    'selecthealth': 'SelectHealth',
    'tricare': 'Tricare',
    'tufts': 'Tufts Health Plan',
    'tufts health plan': 'Tufts Health Plan',
    'ucla': 'UCLA',
    'umr': 'UMR',
    'workers comp': 'Workers\' Comp',
    'workers\' comp': 'Workers\' Comp'
  };

  const lower = name.toLowerCase().trim();

  // Exact match
  if (normalizations[lower]) {
    return normalizations[lower];
  }

  // Partial match
  for (const [key, value] of Object.entries(normalizations)) {
    if (lower.includes(key)) {
      return value;
    }
  }

  return name;
}

// === MAIN EXECUTION WITH ERROR HANDLING ===
try {
  // n8n AI Agent passes the input as a JSON string in 'query'
  let parsedInput = {};
  const rawQuery = query;

  // Try to parse the query if it's a JSON string
  if (rawQuery) {
    try {
      if (typeof rawQuery === 'string') {
        parsedInput = JSON.parse(rawQuery);
      } else if (typeof rawQuery === 'object') {
        parsedInput = rawQuery;
      }
    } catch (parseError) {
      // If parsing fails, assume it's a simple string query
      parsedInput = { insurance_name: rawQuery };
    }
  }

  // Extract parameters from parsed input
  const insuranceName = parsedInput.insurance_name || '';
  const state = parsedInput.state || '';
  const planType = parsedInput.plan_type || 'UNKNOWN';

  // Validate required inputs
  if (!insuranceName) {
    return JSON.stringify({
      status: 'error',
      message: 'Please specify which insurance company you\'re asking about (e.g., Cigna, Aetna, United Healthcare).',
      accepted: false,
      error: 'missing_insurance_name',
      debug: {
        rawQuery: query,
        typeOfQuery: typeof query,
        parsedInput: parsedInput,
        receivedValues: {
          insuranceName: insuranceName,
          state: state,
          planType: planType
        }
      }
    });
  }

  if (!state) {
    return JSON.stringify({
      status: 'error',
      message: 'I need to know what state you\'re in to check insurance coverage. Could you provide your ZIP code?',
      accepted: false,
      error: 'missing_state',
      debug: {
        rawQuery: query,
        typeOfQuery: typeof query,
        parsedInput: parsedInput,
        receivedValues: {
          insuranceName: insuranceName,
          state: state,
          planType: planType
        }
      }
    });
  }

  // Normalize insurance name
  const normalizedName = normalizeInsuranceName(insuranceName);

  // Check if we have data for this insurance
  if (!insuranceData[normalizedName]) {
    return JSON.stringify({
      status: 'unknown_insurance',
      message: `I don't have specific coverage information for ${insuranceName}. Please call Luna at 855-475-LUNA to verify your coverage, or we can check during the booking process.`,
      accepted: 'unknown',
      needsVerification: true,
      bookingAction: 'proceed_with_verification'
    });
  }

  // Get state-specific coverage
  const stateData = insuranceData[normalizedName][state.toUpperCase()];

  if (!stateData) {
    return JSON.stringify({
      status: 'not_in_state',
      message: `Unfortunately, ${insuranceName} is not accepted in ${state} for Luna Physical Therapy services. However, we offer affordable self-pay options starting at $150 per session. Would you like to learn more about our self-pay rates?`,
      accepted: false,
      offerAlternatives: true,
      bookingAction: 'offer_self_pay'
    });
  }

  const ppoAccepted = stateData.PPO === true;
  const hmoAccepted = stateData.HMO === true;
  const hmoConditional = stateData.HMO === 'conditional';

  // Handle specific plan types when user mentions them
  if (planType === 'PPO' && ppoAccepted) {
    return JSON.stringify({
      status: 'accepted',
      message: `Perfect! Your ${insuranceName} PPO plan is accepted in ${state}. You're all set to book your appointment! Are you ready to start booking?`,
      accepted: true,
      bookingAction: 'proceed_to_booking',
      nextStep: 'ready_to_book'
    });
  }

  if (planType === 'HMO') {
    if (hmoAccepted) {
      return JSON.stringify({
        status: 'accepted',
        message: `Great news! Your ${insuranceName} HMO plan is accepted in ${state}. Let's get you scheduled! Are you ready to start booking?`,
        accepted: true,
        bookingAction: 'proceed_to_booking',
        nextStep: 'ready_to_book'
      });
    }
    if (hmoConditional) {
      return JSON.stringify({
        status: 'conditional',
        message: `${insuranceName} HMO coverage in ${state} depends on your specific plan. Most of our patients with ${insuranceName} HMO are covered. Would you like to start the booking process and we'll verify your specific plan?`,
        accepted: 'conditional',
        bookingAction: 'proceed_with_verification',
        nextStep: 'verify_during_booking'
      });
    }
    return JSON.stringify({
      status: 'not_accepted',
      message: `Unfortunately, ${insuranceName} HMO plans are not accepted in ${state}. However, we offer competitive self-pay options. Our rates are often comparable to high-deductible insurance plans. Would you like to hear about our self-pay pricing?`,
      accepted: false,
      bookingAction: 'offer_self_pay'
    });
  }

  // User didn't specify plan type - provide smart response based on coverage
  if (ppoAccepted && hmoAccepted) {
    return JSON.stringify({
      status: 'both_accepted',
      message: `Excellent! ${insuranceName} is fully accepted in ${state} for both PPO and HMO plans. You're covered regardless of your plan type! Are you ready to start booking your appointment?`,
      accepted: true,
      bookingAction: 'proceed_to_booking',
      nextStep: 'ready_to_book'
    });
  }

  if (ppoAccepted && !hmoAccepted && !hmoConditional) {
    return JSON.stringify({
      status: 'ppo_only',
      message: `Good news! ${insuranceName} is accepted in ${state}, but only for PPO plans. Could you check your insurance card - does it say "PPO" anywhere on it? If yes, you're all set to book!`,
      accepted: 'partial',
      bookingAction: 'ask_plan_type',
      followUp: 'If you have PPO, we can proceed with booking. If it\'s HMO, we\'ll discuss self-pay options.'
    });
  }

  if (ppoAccepted && hmoConditional) {
    return JSON.stringify({
      status: 'mixed',
      message: `${insuranceName} is accepted in ${state}! PPO plans are definitely covered, and many HMO plans are accepted too. Since most of our ${insuranceName} patients are covered, would you like to start booking and we'll verify your specific plan during the process?`,
      accepted: 'mostly',
      bookingAction: 'proceed_with_verification',
      nextStep: 'verify_during_booking'
    });
  }

  // Fallback response
  return JSON.stringify({
    status: 'needs_verification',
    message: `I need to verify your specific ${insuranceName} plan coverage in ${state}. Let's start the booking process and verify your coverage - it only takes a minute and most patients are covered. Are you ready to proceed?`,
    accepted: 'unknown',
    bookingAction: 'proceed_with_verification',
    nextStep: 'verify_during_booking'
  });

} catch (error) {
  return JSON.stringify({
    status: 'error',
    message: 'I\'m having trouble checking your insurance right now. Please call Luna at 855-475-LUNA for immediate assistance with insurance verification.',
    accepted: 'unknown',
    error: error.message,
    bookingAction: 'contact_luna',
    debug: {
      rawQuery: query,
      typeOfQuery: typeof query,
      errorMessage: error.message,
      errorStack: error.stack
    }
  });
}