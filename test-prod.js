fetch('https://www.umbulab.com/api/ai/generate-site', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Teste',
    email: 'teste@teste.com',
    business_type: 'portfolio',
    description: 'teste de api'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
