const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/r/D1Yn0V',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`LOCATION: ${res.headers.location}`);
  
  if (res.statusCode === 302 && res.headers.location === '/smart-hub') {
      console.log('SUCCESS: Redirecting to internal path (Profile Page)');
  } else {
      console.log('FAILURE: Unexpected redirect target');
  }
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
