// Use native fetch instead of http

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
  const baseUrl = process.env.API_URL || 'https://schedulex-1.onrender.com';
  
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${ep}`);
      const text = await res.text();
      console.log(`${ep} -> Status: ${res.status}, Length: ${text.length}`);
    } catch (err) {
      console.error(`${ep} -> ERROR: ${err.message}`);
    }
  }
}

test();
