// n8n Insurance Coverage Checker Tool - FULLY FIXED VERSION
// Handles natural language insurance questions for Luna Physical Therapy
// ALL RETURNS ARE JSON.stringify() FOR n8n COMPATIBILITY

// Insurance coverage data
const insuranceData = {
  "Aetna": {
    "AZ": { "PPO": true, "HMO": false },
    "CA": { "PPO": true, "HMO": true },
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
  "Cigna": {
    "AZ": { "PPO": true, "HMO": "conditional" },
    "CA": { "PPO": true, "HMO": "conditional" },
    "CO": { "PPO": true, "HMO": "conditional" },
    "CT": { "PPO": true, "HMO": "conditional" },
    "DC": { "PPO": true, "HMO": false },
    "DE": { "PPO": true, "HMO": false },
    "FL": { "PPO": true, "HMO": "conditional" },
    "GA": { "PPO": true, "HMO": false },
    "IL": { "PPO": true, "HMO": "conditional" },
    "IN": { "PPO": true, "HMO": false },
    "MA": { "PPO": true, "HMO": "conditional" },
    "MD": { "PPO": true, "HMO": "conditional" },
    "MI": { "PPO": true, "HMO": false },
    "MN": { "PPO": true, "HMO": false },
    "MO": { "PPO": true, "HMO": false },
    "NC": { "PPO": true, "HMO": false },
    "NV": { "PPO": true, "HMO": false },
    "NY": { "PPO": true, "HMO": "conditional" },
    "OH": { "PPO": true, "HMO": false },
    "OK": { "PPO": true, "HMO": false },
    "OR": { "PPO": true, "HMO": false },
    "PA": { "PPO": true, "HMO": "conditional" },
    "TN": { "PPO": true, "HMO": false },
    "TX": { "PPO": true, "HMO": "conditional" },
    "UT": { "PPO": true, "HMO": false },
    "VA": { "PPO": true, "HMO": "conditional" },
    "WA": { "PPO": true, "HMO": false },
    "WI": { "PPO": true, "HMO": false }
  },
  "United Healthcare": {
    "AZ": { "PPO": true, "HMO": "conditional" },
    "CA": { "PPO": true, "HMO": "conditional" },
    "CO": { "PPO": true, "HMO": "conditional" },
    "CT": { "PPO": true, "HMO": "conditional" },
    "DC": { "PPO": true, "HMO": false },
    "DE": { "PPO": true, "HMO": false },
    "FL": { "PPO": true, "HMO": "conditional" },
    "GA": { "PPO": true, "HMO": false },
    "IL": { "PPO": true, "HMO": "conditional" },
    "IN": { "PPO": true, "HMO": false },
    "MA": { "PPO": true, "HMO": "conditional" },
    "MD": { "PPO": true, "HMO": "conditional" },
    "MI": { "PPO": true, "HMO": false },
    "MN": { "PPO": true, "HMO": false },
    "MO": { "PPO": true, "HMO": false },
    "NC": { "PPO": true, "HMO": false },
    "NV": { "PPO": true, "HMO": false },
    "NY": { "PPO": true, "HMO": "conditional" },
    "OH": { "PPO": true, "HMO": false },
    "OK": { "PPO": true, "HMO": false },
    "OR": { "PPO": true, "HMO": false },
    "PA": { "PPO": true, "HMO": "conditional" },
    "TN": { "PPO": true, "HMO": false },
    "TX": { "PPO": true, "HMO": "conditional" },
    "UT": { "PPO": true, "HMO": false },
    "VA": { "PPO": true, "HMO": "conditional" },
    "WA": { "PPO": true, "HMO": false },
    "WI": { "PPO": true, "HMO": false }
  },
  "Blue Cross Blue Shield": {
    "AZ": { "PPO": true, "HMO": false },
    "FL": { "PPO": true, "HMO": false },
    "GA": { "PPO": true, "HMO": false },
    "IL": { "PPO": true, "HMO": false },
    "MA": { "PPO": true, "HMO": false },
    "MI": { "PPO": true, "HMO": false },
    "MN": { "PPO": true, "HMO": false },
    "NC": { "PPO": true, "HMO": false },
    "OK": { "PPO": true, "HMO": false },
    "TX": { "PPO": true, "HMO": false }
  },
  "Anthem": {
    "CA": { "PPO": true, "HMO": false },
    "CO": { "PPO": true, "HMO": false },
    "CT": { "PPO": true, "HMO": false },
    "IN": { "PPO": true, "HMO": false },
    "MO": { "PPO": true, "HMO": false },
    "NV": { "PPO": true, "HMO": false },
    "NY": { "PPO": true, "HMO": false },
    "OH": { "PPO": true, "HMO": false },
    "VA": { "PPO": true, "HMO": false },
    "WI": { "PPO": true, "HMO": false }
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
  "Kaiser Permanente": {
    "CA": { "PPO": true, "HMO": true, "note": "Only LA/IE/OC areas" }
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
    'united': 'United Healthcare',
    'unitedhealthcare': 'United Healthcare',
    'uhc': 'United Healthcare',
    'blue cross': 'Blue Cross Blue Shield',
    'bcbs': 'Blue Cross Blue Shield',
    'bluecross': 'Blue Cross Blue Shield',
    'blue shield': 'Blue Cross Blue Shield',
    'anthem': 'Anthem',
    'humana': 'Humana',
    'kaiser': 'Kaiser Permanente',
    'molina': 'Molina Healthcare'
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