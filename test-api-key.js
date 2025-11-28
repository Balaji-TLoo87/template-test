// Test script to verify Gemini API key
// Run with: node test-api-key.js YOUR_API_KEY

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Usage: node test-api-key.js YOUR_API_KEY');
  process.exit(1);
}

const fetch = require('node-fetch');

const testKey = async () => {
  try {
    console.log('Testing API key:', apiKey.substring(0, 10) + '...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ API Key is VALID!');
      console.log('Available models:', data.models?.length || 0);
      console.log('\nSome models:', data.models?.slice(0, 3).map(m => m.name));
    } else {
      console.error('❌ API Key is INVALID');
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('❌ Error testing API key:', error.message);
  }
};

testKey();
