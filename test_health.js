// Native fetch in Node 18+

async function testHealth() {
    try {
        const response = await fetch('http://localhost:3001/health', {
            method: 'GET',
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Body:', text);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testHealth();
