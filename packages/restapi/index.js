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

// POST /api/check - Validate form data
app.post('/api/check', (req, res) => {
  const data = req.body;
  const errors = [];

  console.log(`📋 Validating form data...`);

  // Required string fields with max length
  if (!validateEmail(data.email)) {
    errors.push('email: required, max 100 chars, valid email format');
  }
  if (!validateString(data.insurance, 100)) {
    errors.push('insurance: required, max 100 chars');
  }
  if (!validateString(data.firstname, 100)) {
    errors.push('firstname: required, max 100 chars');
  }
  if (!validateString(data.lastname, 100)) {
    errors.push('lastname: required, max 100 chars');
  }
  if (!validateString(data.address, 255)) {
    errors.push('address: required, max 255 chars');
  }
  if (!validateString(data.patient_injury, 100)) {
    errors.push('patient_injury: required, max 100 chars');
  }

  // Nullable string fields
  if (!validateString(data.other_insurance, 100, false)) {
    errors.push('other_insurance: max 100 chars if provided');
  }
  if (!validateString(data.insurance_plan, 100, false)) {
    errors.push('insurance_plan: max 100 chars if provided');
  }
  if (!validateString(data.insurance_member_id, 50, false)) {
    errors.push('insurance_member_id: max 50 chars if provided');
  }
  if (!validateString(data.apt_ste, 50, false)) {
    errors.push('apt_ste: max 50 chars if provided');
  }
  if (!validateString(data.patient_injury_other_details, 150, false)) {
    errors.push('patient_injury_other_details: max 150 chars if provided');
  }

  // Required_if validations
  if (data.insurance === 'Other' && !validateString(data.other_insurance, 100)) {
    errors.push('other_insurance: required when insurance is "Other"');
  }
  if (data.patient_injury === 'Other' && !validateString(data.patient_injury_other_details, 150)) {
    errors.push('patient_injury_other_details: required when patient_injury is "Other"');
  }

  // Zip validation
  if (!validateZip(data.zip)) {
    errors.push('zip: required, exactly 5 digits');
  }

  // Phone validation
  if (!validatePhone(data.phone)) {
    errors.push('phone: required, format (XXX) XXX-XXXX');
  }

  // Date validations
  if (!validateDate(data.date_of_birth)) {
    errors.push('date_of_birth: required, format MM-DD-YYYY');
  }
  if (!validateDate(data.home_health_discharge_date)) {
    errors.push('home_health_discharge_date: required, format MM-DD-YYYY');
  }

  // Enum validations
  if (!validateInArray(data.supplemental_insurance, ['Yes', 'No'], false)) {
    errors.push('supplemental_insurance: must be "Yes" or "No" if provided');
  }
  if (!validateInArray(data.use_insurance_for_visit, ['Yes', 'No'])) {
    errors.push('use_insurance_for_visit: required, must be "Yes" or "No"');
  }
  if (!validateInArray(data.currently_receiving_home_health_services, ['Yes', 'No'])) {
    errors.push('currently_receiving_home_health_services: required, must be "Yes" or "No"');
  }

  // Phone number type validation
  const validPhoneTypes = ['mobile', 'landline', 'fixed VoIP', 'non-fixed VoIP', 'toll-free'];
  if (!validateString(data.phone_number_type, 20) || !validPhoneTypes.includes(data.phone_number_type)) {
    errors.push('phone_number_type: required, must be one of: mobile, landline, fixed VoIP, non-fixed VoIP, toll-free');
  }

  if (errors.length > 0) {
    console.log(`❌ Validation failed with ${errors.length} errors:`);
    errors.forEach(error => console.log(`   - ${error}`));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  console.log(`✅ All validations passed successfully`);
  
  res.status(200).json({
    success: true,
    message: 'All validations passed',
    data: data
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