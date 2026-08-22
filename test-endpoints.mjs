async function testRoutes() {
  const endpoints = [
    "http://localhost:3001/",
    "http://localhost:3001/projects",
    "http://localhost:3001/projects/recon-flow-security-scanner",
    "http://localhost:3001/writeups",
    "http://localhost:3001/writeups/understanding-and-exploiting-idor-deep-dive",
    "http://localhost:3001/certifications",
    "http://localhost:3001/resume",
    "http://localhost:3001/contact",
    "http://localhost:3001/admin/login",
    "http://localhost:3001/api/search?q=recon",
    "http://localhost:3001/sitemap.xml",
    "http://localhost:3001/robots.txt"
  ];

  console.log("=== Testing wwww82 Platform Endpoints ===");
  let passed = 0;

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`✓ [PASS] ${res.status} - ${url}`);
        passed++;
      } else {
        console.log(`✗ [FAIL] ${res.status} - ${url}`);
      }
    } catch (e) {
      console.log(`✗ [ERR] ${url} - ${e.message}`);
    }
  }

  console.log(`\nResult: ${passed}/${endpoints.length} endpoints passed.`);
}

testRoutes();
