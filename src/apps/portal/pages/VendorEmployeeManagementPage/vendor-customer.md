# CREATE customer (customerSysId is auto-generated, vendorSysId is required)
curl -X POST http://localhost:8081/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "vendorSysId": "your-vendor-sys-id",
    "customerLegalName": "Acme Industries Ltd",
    "customerType": "Corporate",
    "customerStatus": "Active",
    "corporateNameCodeShort": "ACME",
    "website": "https://acme.com",
    "corporateEmail": "contact@acme.com",
    "corporatePhone": "+1234567890",
    "country": "USA",
    "registeredAddress": "123 Business Park, Suite 500",
    "corporateCity": "New York",
    "corporateState": "NY",
    "corporatePin": "10001",
    "region": "North America",
    "pan": "ABCDE1234F",
    "gstinIfCentral": "29ABCDE1234F1Z5",
    "cin": "L12345MH2023PTC123456",
    "msmeStatus": "Registered",
    "ndaRequired": true,
    "qualityAgreementRequired": true,
    "createdBy": "admin",
    "remarks": "Initial customer setup"
  }'

# LIST customers (with pagination)
curl -X GET "http://localhost:8081/api/customers?page=0&size=10&sortBy=customerSysId&sortDir=asc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# GET customer by ID
curl -X GET http://localhost:8081/api/customers/{customerSysId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# GET customers by vendor
curl -X GET "http://localhost:8081/api/customers/by-vendor/{vendorSysId}?page=0&size=10&sortBy=customerSysId&sortDir=asc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# SEARCH customers by name
curl -X GET "http://localhost:8081/api/customers/search?customerLegalName=Acme&page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# UPDATE customer (customerSysId in URL path, not in payload)
curl -X PUT http://localhost:8081/api/customers/{customerSysId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "vendorSysId": "your-vendor-sys-id",
    "customerLegalName": "Acme Industries Ltd Updated",
    "customerType": "Corporate",
    "customerStatus": "Active",
    "corporateNameCodeShort": "ACME",
    "website": "https://acme-updated.com",
    "corporateEmail": "updated@acme.com",
    "corporatePhone": "+9876543210",
    "country": "USA",
    "registeredAddress": "456 New Address, Suite 600",
    "corporateCity": "Los Angeles",
    "corporateState": "CA",
    "corporatePin": "90001",
    "region": "West Coast",
    "pan": "ABCDE1234F",
    "gstinIfCentral": "29ABCDE1234F1Z5",
    "cin": "L12345MH2023PTC123456",
    "msmeStatus": "Registered",
    "ndaRequired": false,
    "qualityAgreementRequired": true,
    "createdBy": "admin",
    "remarks": "Updated customer information"
  }'

# DELETE customer
curl -X DELETE http://localhost:8081/api/customers/{customerSysId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"



  Key notes:

customerSysId is auto-generated (UUID)
vendorSysId is required for creating a customer
customerLegalName is required
All other fields are optional