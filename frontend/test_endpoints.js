const http = require('http');

const endpoints = [
  '/api/dashboard',
  '/api/assignments',
  '/api/tasks',
  '/api/timetable',
  '/api/focus-sessions',
  '/api/study-sessions',
  '/api/resources',
  '/api/courses',
  '/api/habits',
  '/api/goals',
  '/api/profile'
];

async function test() {
  console.log("Testing endpoints...");
  for (const ep of endpoints) {
    await new Promise((resolve) => {
      http.get(`http://localhost:5000${ep}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`${ep} -> Status: ${res.statusCode}, Length: ${data.length}`);
          resolve();
        });
      }).on('error', (err) => {
        console.error(`${ep} -> ERROR: ${err.message}`);
        resolve();
      });
    });
  }
}

test();
