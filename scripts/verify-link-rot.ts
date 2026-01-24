import mongoose from 'mongoose';
import Link from '../src/models/Link';
import User from '../src/models/User';
import Hub from '../src/models/Hub';
import { processLinkBatch } from '../src/lib/link-checker';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
    console.error("Please set MONGODB_URI in .env.local");
    process.exit(1);
}

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to MongoDB.");

        // 1. Clear existing test data (optional, be careful)
        // await Link.deleteMany({});

        // 2. Create a dummy user/hub if needed (mock IDs)
        const userId = new mongoose.Types.ObjectId();
        const hubId = new mongoose.Types.ObjectId();

        // 3. Create links
        console.log("Seeding links...");
        const goodLink = await Link.create({
            title: "Good Link",
            url: "https://www.google.com",
            hubId: hubId as any,
            priority: 1,
            isActive: true
        });

        const badLink = await Link.create({
            title: "Bad Link",
            url: "https://www.google.com/this-link-does-not-exist-12345",
            hubId: hubId as any,
            priority: 0,
            isActive: true
        });

        console.log(`Created Good Link: ${goodLink._id}`);
        console.log(`Created Bad Link: ${badLink._id}`);

        // 4. Run Checker
        console.log("Running link checker batch...");
        const updates = await processLinkBatch(10);
        console.log("Updates:", JSON.stringify(updates, null, 2));

        // 5. Verify
        const updatedGood = await Link.findById(goodLink._id);
        const updatedBad = await Link.findById(badLink._id);

        console.log("--- Verification Results ---");
        console.log(`Good Link Status: ${updatedGood?.statusCode} (Expected: 200)`);
        console.log(`Good Link Healthy: ${updatedGood?.isHealthy}`);

        console.log(`Bad Link Status: ${updatedBad?.statusCode} (Expected: 404)`);
        console.log(`Bad Link Healthy: ${updatedBad?.isHealthy} (Expected: false)`);
        console.log(`Bad Link Archive: ${updatedBad?.archiveUrl ? 'Found' : 'Not Found'}`);

        if (updatedGood?.isHealthy && !updatedBad?.isHealthy && updatedBad?.statusCode === 404) {
            console.log("✅ SUCCESS: Link Rot logic verified.");
        } else {
            console.error("❌ FAILURE: Verification failed.");
        }

    } catch (error) {
        console.error("Verification Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
