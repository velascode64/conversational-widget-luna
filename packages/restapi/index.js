import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3002;

// Luna API Configuration
const LUNA_API_DOMAIN = process.env.LUNA_API_DOMAIN || 'https://marketing-site.alpha.getluna.com';


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
  const authHeader = req.headers.authorization;
  
  console.log(`📍 Checking availability`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
  
  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/check-availability`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/check-availability`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    console.log(`${response.status === 200 ? '✅' : '❌'} Luna API Response:`, JSON.stringify(data, null, 2));
    
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
  const authHeader = req.headers.authorization;
  
  console.log(`📧 Registering email for future notification`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
  
  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/register-email-not-serviceable`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/register-email-not-serviceable`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
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
  const authHeader = req.headers.authorization;
  
  console.log(`👤 Registering contact`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
  
  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/register-contact`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/register-contact`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
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
  const authHeader = req.headers.authorization;

  console.log(`📋 Processing batch booking data...`);
  console.log(`🔑 Authorization header: ${authHeader ? 'Present' : 'Missing'}`);

  try {
    console.log(`🔄 Proxying to Luna API: ${LUNA_API_DOMAIN}/api/booker/batch`);
    
    const response = await fetch(`${LUNA_API_DOMAIN}/api/booker/batch`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
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