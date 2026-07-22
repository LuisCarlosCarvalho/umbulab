const fs = require('fs');
let env = '';
try {
  env = fs.readFileSync('.env.local', 'utf8');
} catch(e) {
  env = fs.readFileSync('.env', 'utf8');
}
const keyMatch = env.match(/GEMINI_API_KEY=(.*)/);
if (!keyMatch) {
  console.log("No GEMINI_API_KEY found.");
  process.exit(1);
}
const key = keyMatch[1].trim();

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.log("Error:", data.error);
    } else {
      console.log(data.models.map(m => m.name).join('\n'));
    }
  }).catch(console.error);
