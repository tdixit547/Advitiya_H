import { NextResponse } from 'next/server';
import { processLinkBatch } from '@/lib/link-checker';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const updates = await processLinkBatch(20); // Check 20 links at a time

        return NextResponse.json({
            success: true,
            processed: updates.length,
            updates
        });
    } catch (error: any) {
        console.error('Link check Cron error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
