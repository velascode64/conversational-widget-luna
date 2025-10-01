// Test script for insurance checker - CUSTOMIZABLE
// Edit the testCases array to test different scenarios

// Mock n8n's $ function
let currentTestData = {};
function $(paramName) {
  return currentTestData[paramName];
}

// Your insurance data (copy from your tool)
const insuranceData = {
  "Aetna": {
    "AZ": { "PPO": true, "HMO": false },
    "CA": { "PPO": true, "HMO": true },
    "TX": { "PPO": true, "HMO": false },
    "FL": { "PPO": true, "HMO": false }
  },
  "Cigna": {
    "CA": { "PPO": true, "HMO": "conditional" },
    "TX": { "PPO": true, "HMO": "conditional" },
    "FL": { "PPO": true, "HMO": "conditional" }
  },
  "United Healthcare": {
    "CA": { "PPO": true, "HMO": "conditional" },
    "TX": { "PPO": true, "HMO": "conditional" }
  },
  "Blue Cross Blue Shield": {
    "TX": { "PPO": true, "HMO": false }
  }
};

function normalizeInsuranceName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const normalizations = {
    'cigna': 'Cigna',
    'aetna': 'Aetna',
    'united': 'United Healthcare',
    'unitedhealthcare': 'United Healthcare',
    'uhc': 'United Healthcare',
    'blue cross': 'Blue Cross Blue Shield',
    'bcbs': 'Blue Cross Blue Shield',
    'bluecross': 'Blue Cross Blue Shield',
    'blue shield': 'Blue Cross Blue Shield'
  };

  const lower = name.toLowerCase().trim();

  if (normalizations[lower]) {
    return normalizations[lower];
  }

  for (const [key, value] of Object.entries(normalizations)) {
    if (lower.includes(key)) {
      return value;
    }
  }

  return name;
}

// Main function (simplified version of your tool)
function testInsuranceChecker() {
  try {
    const insuranceName = $('insurance_name') || '';
    const state = $('state') || '';
    const planType = $('plan_type') || 'UNKNOWN';

    if (!insuranceName) {
      return { status: 'error', message: 'Missing insurance name', accepted: false };
    }

    if (!state) {
      return { status: 'error', message: 'Missing state', accepted: false };
    }

    const normalizedName = normalizeInsuranceName(insuranceName);

    if (!insuranceData[normalizedName]) {
      return { status: 'unknown_insurance', message: `Unknown insurance: ${insuranceName}`, accepted: 'unknown' };
    }

    const stateData = insuranceData[normalizedName][state.toUpperCase()];

    if (!stateData) {
      return { status: 'not_in_state', message: `${insuranceName} not accepted in ${state}`, accepted: false };
    }

    const ppoAccepted = stateData.PPO === true;
    const hmoAccepted = stateData.HMO === true;
    const hmoConditional = stateData.HMO === 'conditional';

    // Specific plan type
    if (planType === 'PPO' && ppoAccepted) {
      return { status: 'accepted', message: `${insuranceName} PPO accepted in ${state}`, accepted: true };
    }

    if (planType === 'HMO') {
      if (hmoAccepted) {
        return { status: 'accepted', message: `${insuranceName} HMO accepted in ${state}`, accepted: true };
      }
      if (hmoConditional) {
        return { status: 'conditional', message: `${insuranceName} HMO conditional in ${state}`, accepted: 'conditional' };
      }
      return { status: 'not_accepted', message: `${insuranceName} HMO not accepted in ${state}`, accepted: false };
    }

    // Unknown plan type
    if (ppoAccepted && hmoAccepted) {
      return { status: 'both_accepted', message: `${insuranceName} fully accepted in ${state}`, accepted: true };
    }

    if (ppoAccepted && !hmoAccepted && !hmoConditional) {
      return { status: 'ppo_only', message: `${insuranceName} PPO only in ${state}`, accepted: 'partial' };
    }

    if (ppoAccepted && hmoConditional) {
      return { status: 'mixed', message: `${insuranceName} PPO + conditional HMO in ${state}`, accepted: 'mostly' };
    }

    return { status: 'needs_verification', message: `Need to verify ${insuranceName} in ${state}`, accepted: 'unknown' };

  } catch (error) {
    return { status: 'error', message: `Error: ${error.message}`, accepted: 'unknown' };
  }
}

// ========================================
// EDIT THESE TEST CASES TO TEST DIFFERENT SCENARIOS
// ========================================
const testCases = [
  {
    name: "Aetna CA - Unknown Plan",
    data: { insurance_name: "Aetna", state: "CA", plan_type: "UNKNOWN" }
  },
  {
    name: "Cigna TX - PPO",
    data: { insurance_name: "Cigna", state: "TX", plan_type: "PPO" }
  },
  {
    name: "Cigna TX - HMO",
    data: { insurance_name: "Cigna", state: "TX", plan_type: "HMO" }
  },
  {
    name: "United Healthcare CA",
    data: { insurance_name: "United Healthcare", state: "CA", plan_type: "UNKNOWN" }
  },
  {
    name: "Blue Cross TX",
    data: { insurance_name: "Blue Cross", state: "TX", plan_type: "UNKNOWN" }
  },
  {
    name: "Missing Insurance",
    data: { insurance_name: "", state: "CA", plan_type: "UNKNOWN" }
  },
  {
    name: "Missing State",
    data: { insurance_name: "Aetna", state: "", plan_type: "UNKNOWN" }
  },
  {
    name: "Unknown Insurance",
    data: { insurance_name: "FakeInsurance", state: "CA", plan_type: "UNKNOWN" }
  },
  {
    name: "Insurance Not in State",
    data: { insurance_name: "Aetna", state: "WY", plan_type: "UNKNOWN" }
  }
];

// Run all tests
console.log('🧪 RUNNING INSURANCE CHECKER TESTS\n');
console.log('=' .repeat(60));

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   Input: ${JSON.stringify(testCase.data)}`);

  // Set the test data
  currentTestData = testCase.data;

  // Run the test
  const result = testInsuranceChecker();

  console.log(`   Result: ${result.status} | ${result.accepted} | ${result.message}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ ALL TESTS COMPLETED');
console.log('\n📝 TO ADD YOUR OWN TEST:');
console.log('Edit the testCases array and add:');
console.log('{');
console.log('  name: "Your Test Name",');
console.log('  data: { insurance_name: "YourInsurance", state: "YourState", plan_type: "YourType" }');
console.log('}');