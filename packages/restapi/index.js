import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3002;

// Luna API Configuration
const LUNA_API_DOMAIN = process.env.LUNA_API_DOMAIN || 'https://marketing-site.alpha.getluna.com';

// Validation functions
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 100) return false;
  return /^[^<>]+@[^<>]+\.[^<>]+$/.test(email);
}

function validateString(value, maxLength, required = true) {
  if (required && (!value || typeof value !== 'string')) return false;
  if (!required && value === null) return true;
  if (typeof value !== 'string') return false;
  return value.length <= maxLength;
}

function validateZip(zip) {
  if (!zip || typeof zip !== 'string') return false;
  if (zip.length !== 5) return false;
  return /^\d+$/.test(zip);
}

function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
}

function validateDate(date) {
  if (!date || typeof date !== 'string') return false;
  return /^(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[01])\-[0-9]{4}$/.test(date);
}

function validateInArray(value, validValues, required = true) {
  if (required && !value) return false;
  if (!required && value === null) return true;
  return validValues.includes(value);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// Middleware to log all request details
app.use((req, res, next) => {
  console.log('\n========== REQUEST RECEIVED ==========');
  console.log(`[${new Date().toISOString()}]`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, JSON.stringify(req.body, null, 2));
  }
  console.log('======================================\n');
  next();
});

// POST /api/booker/check-availability - Check ZIP code coverage
app.post('/api/booker/check-availability', async (req, res) => {
  const { zip } = req.body;
  const authHeader = req.headers.authorization;
  
  console.log(`📍 Checking availability for ZIP: ${zip}`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(`❌ Missing or invalid Authorization header`);
    return res.status(401).json({
      success: false,
      message: 'Authorization header with Bearer token required'
    });
  }
  
  if (!validateZip(zip)) {
    console.log(`❌ Invalid ZIP code format: ${zip}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid ZIP code format. Must be exactly 5 digits.'
    });
  }
  
  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/check-availability`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/check-availability`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ zip })
    });

    const data = await response.json();
    
    console.log(`${response.status === 200 ? '✅' : '❌'} Luna API Response:`, data);
    
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('❌ Error calling Luna API:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
});

// POST /api/booker/register-email-not-serviceable - Register email when no coverage
app.post('/api/booker/register-email-not-serviceable', async (req, res) => {
  const { email, zip } = req.body;
  const authHeader = req.headers.authorization;
  
  console.log(`📧 Registering email for future notification - ZIP: ${zip}`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(`❌ Missing or invalid Authorization header`);
    return res.status(401).json({
      success: false,
      message: 'Authorization header with Bearer token required'
    });
  }
  
  const errors = [];
  
  if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }
  
  if (!validateZip(zip)) {
    errors.push('Invalid ZIP code format. Must be exactly 5 digits.');
  }
  
  if (errors.length > 0) {
    console.log(`❌ Registration failed:`, errors);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  
  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/register-email-not-serviceable`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/register-email-not-serviceable`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, zip })
    });

    const data = await response.json();
    
    console.log(`${response.status === 200 ? '✅' : '❌'} Luna API Response:`, data);
    
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('❌ Error calling Luna API:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering email',
      error: error.message
    });
  }
});

// POST /api/booker/register-contact - Register contact when coverage is available
app.post('/api/booker/register-contact', async (req, res) => {
  const { email, firstname, lastname, phone, zip, phone_number_type } = req.body;
  const authHeader = req.headers.authorization;
  
  console.log(`👤 Registering contact for ZIP: ${zip}`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(`❌ Missing or invalid Authorization header`);
    return res.status(401).json({
      success: false,
      message: 'Authorization header with Bearer token required'
    });
  }
  
  const errors = [];
  
  if (!validateEmail(email)) {
    errors.push('email: required, valid email format');
  }
  
  if (!validateString(firstname, 100)) {
    errors.push('firstname: required, max 100 chars');
  }
  
  if (!validateString(lastname, 100)) {
    errors.push('lastname: required, max 100 chars');
  }
  
  if (!validatePhone(phone)) {
    errors.push('phone: required, format (XXX) XXX-XXXX');
  }
  
  if (!validateZip(zip)) {
    errors.push('zip: required, exactly 5 digits');
  }
  
  const validPhoneTypes = ['mobile', 'landline', 'fixed VoIP', 'non-fixed VoIP', 'toll-free'];
  if (!phone_number_type || !validPhoneTypes.includes(phone_number_type)) {
    errors.push('phone_number_type: required, must be one of: mobile, landline, fixed VoIP, non-fixed VoIP, toll-free');
  }
  
  if (errors.length > 0) {
    console.log(`❌ Contact registration failed:`, errors);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  
  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/register-contact`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/register-contact`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, firstname, lastname, phone, zip, phone_number_type })
    });

    const data = await response.json();
    
    console.log(`${response.status === 200 ? '✅' : '❌'} Luna API Response:`, data);
    
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('❌ Error calling Luna API:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering contact',
      error: error.message
    });
  }
});

// POST /api/booker/batch - Submit complete booking data
app.post('/api/booker/batch', async (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  const errors = [];

  console.log(`📋 Processing batch booking data...`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(`❌ Missing or invalid Authorization header`);
    return res.status(401).json({
      success: false,
      message: 'Authorization header with Bearer token required'
    });
  }

  // REQUIRED field - email
  if (!validateEmail(data.email)) {
    errors.push('email: required, max 100 chars, valid email format');
  }

  // All other fields are OPTIONAL according to new documentation
  
  // Optional string fields with max length
  if (data.zip !== undefined && !validateZip(data.zip)) {
    errors.push('zip: must be exactly 5 digits if provided');
  }
  
  // booker_api_source validation - skip validation, API handles it
  
  if (!validateString(data.firstname, 100, false)) {
    errors.push('firstname: max 100 chars if provided');
  }
  
  if (!validateString(data.lastname, 100, false)) {
    errors.push('lastname: max 100 chars if provided');
  }
  
  if (data.phone !== undefined && data.phone !== null && !validatePhone(data.phone)) {
    errors.push('phone: must match format (XXX) XXX-XXXX if provided');
  }
  
  if (!validateString(data.address, 255, false)) {
    errors.push('address: max 255 chars if provided');
  }
  
  if (!validateString(data.apt_ste, 50, false)) {
    errors.push('apt_ste: max 50 chars if provided');
  }
  
  if (!validateString(data.patient_injury, 100, false)) {
    errors.push('patient_injury: max 100 chars if provided');
  }
  
  if (!validateString(data.patient_injury_other_details, 150, false)) {
    errors.push('patient_injury_other_details: max 150 chars if provided');
  }
  
  if (!validateString(data.insurance, 100, false)) {
    errors.push('insurance: max 100 chars if provided');
  }
  
  // other_insurance validation - skip validation, API handles it
  
  if (!validateString(data.insurance_plan, 100, false)) {
    errors.push('insurance_plan: max 100 chars if provided');
  }
  
  if (!validateString(data.insurance_member_id, 50, false)) {
    errors.push('insurance_member_id: max 50 chars if provided');
  }

  // Date validations (optional)
  if (data.date_of_birth !== undefined && data.date_of_birth !== null && !validateDate(data.date_of_birth)) {
    errors.push('date_of_birth: must follow format MM-DD-YYYY if provided');
  }
  
  if (data.home_health_discharge_date !== undefined && data.home_health_discharge_date !== null && !validateDate(data.home_health_discharge_date)) {
    errors.push('home_health_discharge_date: must follow format MM-DD-YYYY if provided');
  }

  // Enum validations (optional)
  if (!validateInArray(data.currently_receiving_home_health_services, ['Yes', 'No'], false)) {
    errors.push('currently_receiving_home_health_services: must be "Yes" or "No" if provided');
  }
  
  if (!validateInArray(data.use_insurance_for_visit, ['Yes', 'No'], false)) {
    errors.push('use_insurance_for_visit: must be "Yes" or "No" if provided');
  }
  
  // self_pay_opted_on_booker validation - skip validation, API handles it
  
  if (!validateInArray(data.supplemental_insurance, ['Yes', 'No'], false)) {
    errors.push('supplemental_insurance: must be "Yes" or "No" if provided');
  }

  // Phone number type validation (optional)
  const validPhoneTypes = ['mobile', 'landline', 'fixed VoIP', 'non-fixed VoIP', 'toll-free'];
  if (data.phone_number_type !== undefined && data.phone_number_type !== null) {
    if (!validPhoneTypes.includes(data.phone_number_type)) {
      errors.push('phone_number_type: must be one of: mobile, landline, fixed VoIP, non-fixed VoIP, toll-free');
    }
  }
  
  // pending_booker_action validation (optional)
  if (data.pending_booker_action !== undefined && data.pending_booker_action !== null) {
    if (data.pending_booker_action !== 'Requested Immediate Callback via Booker') {
      errors.push('pending_booker_action: must be "Requested Immediate Callback via Booker" if provided');
    }
  }

  // CONDITIONAL VALIDATIONS
  
  // If currently_receiving_home_health_services is "Yes", home_health_discharge_date is prohibited
  if (data.currently_receiving_home_health_services === 'Yes' && data.home_health_discharge_date) {
    errors.push('home_health_discharge_date: prohibited when currently_receiving_home_health_services is "Yes"');
  }
  
  // If use_insurance_for_visit is "No", all insurance fields are prohibited
  if (data.use_insurance_for_visit === 'No') {
    if (data.insurance) errors.push('insurance: prohibited when use_insurance_for_visit is "No"');
    if (data.other_insurance) errors.push('other_insurance: prohibited when use_insurance_for_visit is "No"');
    if (data.insurance_plan) errors.push('insurance_plan: prohibited when use_insurance_for_visit is "No"');
    if (data.insurance_member_id) errors.push('insurance_member_id: prohibited when use_insurance_for_visit is "No"');
    if (data.supplemental_insurance) errors.push('supplemental_insurance: prohibited when use_insurance_for_visit is "No"');
  }
  
  // Required_if validations
  if (data.insurance === 'Other' && !data.other_insurance) {
    errors.push('other_insurance: required when insurance is "Other"');
  }
  
  if (data.patient_injury === 'Other' && !data.patient_injury_other_details) {
    errors.push('patient_injury_other_details: required when patient_injury is "Other"');
  }

  if (errors.length > 0) {
    console.log(`❌ Batch validation failed with ${errors.length} errors:`);
    errors.forEach(error => console.log(`   - ${error}`));
    
    // Log the problematic fields for debugging
    console.log('🔍 Debugging validation errors:')
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/batch`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/batch`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    
    console.log(`${response.status === 200 ? '✅' : '❌'} Luna API Response:`, responseData);
    
    res.status(response.status).json(responseData);
    
  } catch (error) {
    console.error('❌ Error calling Luna API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing batch booking',
      error: error.message
    });
  }
});

// Catch all other endpoints
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled route: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Endpoint not found",
    method: req.method,
    path: req.url
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock REST API Server running on http://localhost:${PORT}`);
  console.log(`📝 Test page available at http://localhost:${PORT}/test.html`);
  console.log(`\n💡 To expose via ngrok, run: ngrok http ${PORT}`);
  console.log(`\n📊 All requests will be logged to the console`);
});