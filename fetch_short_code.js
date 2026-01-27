const mongoose = require('mongoose');

// Define minimal schema
const linkHubSchema = new mongoose.Schema({
    hub_id: String,
    slug: String,
    short_code: String
}, { collection: 'linkhubs' });

const LinkHub = mongoose.model('LinkHub', linkHubSchema);

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/smart-link-hub');
        console.log('Connected to MongoDB');

        const hub = await LinkHub.findOne({ short_code: { $exists: true } });
        
        if (hub) {
            console.log(`FOUND_CODE: ${hub.short_code}`);
            console.log(`EXPECTED_SLUG: ${hub.slug}`);
        } else {
            console.log('NO_HUBS_FOUND');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

run();
