import 'dotenv/config';
import handler from './api/generate-site.ts';

async function test() {
  const req = new Request('http://localhost/api/generate-site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company_name: "Umbulab Test",
      business_type: "service",
      number_of_pages: 1,
      style: "modern",
      description: "A digital agency website"
    })
  });

  console.log("Calling handler...");
  const start = Date.now();
  const res = await handler(req);
  console.log("Handler finished in", Date.now() - start, "ms");
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}

test().catch(console.error);
