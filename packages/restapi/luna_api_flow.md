# ================================================
# 🌐 SMART API CONFIGURATION - LUNA BOOKER API
# For use with DoubleO "Smart Configure from cURL"
# ================================================

# ----------------------------------------
# ✅ STEP 1: ZIP CODE COVERAGE CHECK
# ----------------------------------------
# Endpoint: POST /api/booker/check-availability
# Description: Verifica si el ZIP ingresado tiene cobertura. Este paso SIEMPRE debe ejecutarse primero.
# Auth: Bearer Token required

curl -X POST https://www.getluna.com/api/booker/check-availability \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "zip": "90210"
}'


# ----------------------------------------
# ✅ STEP 2A: REGISTER EMAIL (NO COVERAGE)
# ----------------------------------------
# Endpoint: POST /api/booker/register-email-not-serviceable
# Description: Si el ZIP NO tiene cobertura, registra el email para notificación futura.
# Auth: Bearer Token required

curl -X POST https://www.getluna.com/api/booker/register-email-not-serviceable \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "zip": "90210"
}'


# ----------------------------------------
# ✅ STEP 2B: REGISTER CONTACT (COVERAGE OK)
# ----------------------------------------
# Endpoint: POST /api/booker/register-contact
# Description: Si el ZIP TIENE cobertura, registra email, nombre, teléfono y ZIP.
# ⚠️ Este paso NO puede omitirse ni ser reemplazado por /batch.
# Auth: Bearer Token required

curl -X POST https://www.getluna.com/api/booker/register-contact \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "(555) 123-4567",
    "zip": "90210",
    "phone_number_type": "mobile"
}'


# ----------------------------------------
# ✅ STEP 3: REGISTER FULL DATA VIA /BATCH
# ----------------------------------------
# Endpoint: POST /api/booker/batch
# Description: Solo puede ejecutarse después de los pasos 1 y 2. Envia todos los datos del flujo.
# Auth: Bearer Token required

curl -X POST https://www.getluna.com/api/booker/batch \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "zip": "90210",
    "phone": "(555) 123-4567",
    "phone_number_type": "mobile",
    "address": "123 Main Street",
    "apt_ste": "Apt 4B",
    "date_of_birth": "01-15-1985",
    "currently_receiving_home_health_services": "No",
    "home_health_discharge_date": null,
    "patient_injury": "Back pain",
    "patient_injury_other_details": null,
    "use_insurance_for_visit": "Yes",
    "insurance": "Blue Cross Blue Shield",
    "insurance_plan": "Gold PPO",
    "insurance_member_id": "1234567A",
    "supplemental_insurance": "No"
}'


# ================================================
# ✅ DOUBLEO SMART CONFIG TIPS
# ================================================
# ✅ Use Bearer token authentication
# ✅ Set Content-Type to application/json
# ✅ Mark “JSON format” in API Endpoint config
# ✅ Use variables like {{zip}}, {{email}}, etc., from previous steps if dynamic
# ✅ Show API response to user for confirmation
# ✅ Validate all required and conditional fields before calling /batch
# ✅ For invalid API responses (400/422), show user a clear explanation and retry

# Example Bad JSON to avoid:
# - Invalid email, phone or zip formats
# - Enums like "YES" instead of "Yes"
# - Missing conditional fields like `other_insurance` or `patient_injury_other_details`

# ----------------------------------------
# End of Smart API Setup for Luna Booker
# ----------------------------------------