import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3002;

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
app.post('/api/booker/check-availability', (req, res) => {
  const { zip } = req.body;
  
  console.log(`📍 Checking availability for ZIP: ${zip}`);
  
  if (!validateZip(zip)) {
    console.log(`❌ Invalid ZIP code format: ${zip}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid ZIP code format. Must be exactly 5 digits.'
    });
  }
  
  // Mock coverage check - ZIPs starting with 9 have coverage
  const hasAvailability = zip.startsWith('9');
  
  console.log(`${hasAvailability ? '✅' : '❌'} ZIP ${zip} ${hasAvailability ? 'has' : 'does not have'} coverage`);
  
  res.status(200).json({
    success: true,
    hasAvailability: hasAvailability,
    zip: zip,
    message: hasAvailability ? 'Service available in this area' : 'Service not available in this area'
  });
});

// POST /api/booker/register-email-not-serviceable - Register email when no coverage
app.post('/api/booker/register-email-not-serviceable', (req, res) => {
  const { email, zip } = req.body;
  
  console.log(`📧 Registering email for future notification - ZIP: ${zip}`);
  
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
  
  console.log(`✅ Email registered for notifications: ${email} (ZIP: ${zip})`);
  
  res.status(200).json({
    success: true,
    message: 'Email registered for future service notifications',
    data: {
      email: email,
      zip: zip,
      registeredAt: new Date().toISOString()
    }
  });
});

// POST /api/booker/register-contact - Register contact when coverage is available
app.post('/api/booker/register-contact', (req, res) => {
  const { email, firstname, lastname, phone, zip, phone_number_type } = req.body;
  
  console.log(`👤 Registering contact for ZIP: ${zip}`);
  
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
  
  console.log(`✅ Contact registered successfully: ${firstname} ${lastname}`);
  
  res.status(200).json({
    success: true,
    message: 'Contact registered successfully',
    data: {
      email,
      firstname,
      lastname,
      phone,
      zip,
      phone_number_type,
      registeredAt: new Date().toISOString()
    }
  });
});

// POST /api/booker/batch - Submit complete booking data
app.post('/api/booker/batch', (req, res) => {
  const data = req.body;
  const errors = [];

  console.log(`📋 Processing batch booking data...`);

  // REQUIRED field - email
  if (!validateEmail(data.email)) {
    errors.push('email: required, max 100 chars, valid email format');
  }

  // All other fields are OPTIONAL according to new documentation
  
  // Optional string fields with max length
  if (data.zip !== undefined && !validateZip(data.zip)) {
    errors.push('zip: must be exactly 5 digits if provided');
  }
  
  if (!validateString(data.booker_api_source, 100, false)) {
    errors.push('booker_api_source: max 100 chars if provided');
  }
  
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
  
  if (!validateString(data.other_insurance, 100, false)) {
    errors.push('other_insurance: max 100 chars if provided');
  }
  
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
  
  if (!validateInArray(data.self_pay_opted_on_booker, ['Yes', 'No'], false)) {
    errors.push('self_pay_opted_on_booker: must be "Yes" or "No" if provided');
  }
  
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
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  console.log(`✅ Batch booking data validated successfully`);
  
  res.status(200).json({
    data: {
      message: 'Information was saved'
    }
  });
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