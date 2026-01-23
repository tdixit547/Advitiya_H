module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Documents/GitHub/Advitiya_H/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "checkConnection",
    ()=>checkConnection,
    "default",
    ()=>__TURBOPACK__default__export__,
    "insertOne",
    ()=>insertOne,
    "query",
    ()=>query,
    "queryMany",
    ()=>queryMany,
    "queryOne",
    ()=>queryOne
]);
// ============================================
// SMART LINK HUB - Database Connection
// ============================================
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/Documents/GitHub/Advitiya_H/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Create a connection pool
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL,
    ssl: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('Executed query', {
                text: text.substring(0, 50),
                duration,
                rows: result.rowCount
            });
        }
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}
async function queryOne(text, params) {
    const result = await query(text, params);
    return result.rows[0] || null;
}
async function queryMany(text, params) {
    const result = await query(text, params);
    return result.rows;
}
async function insertOne(text, params) {
    const result = await query(text, params);
    return result.rows[0];
}
async function checkConnection() {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch  {
        return false;
    }
}
const __TURBOPACK__default__export__ = pool;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Documents/GitHub/Advitiya_H/src/app/api/analytics/track/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
// ============================================
// SMART LINK HUB - Analytics Tracking API
// POST /api/analytics/track - PostgreSQL version
// ============================================
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { hub_id, link_id, event_type } = body;
        // Validate required fields
        if (!hub_id || !event_type) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing required fields'
            }, {
                status: 400
            });
        }
        // Validate event type
        if (![
            'VIEW',
            'CLICK'
        ].includes(event_type)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid event type'
            }, {
                status: 400
            });
        }
        // Extract visitor info from headers
        const userAgent = request.headers.get('user-agent') || '';
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
        const referrer = request.headers.get('referer') || null;
        // Detect device from user agent
        const device = detectDevice(userAgent);
        // Get country (simplified - would use geo-ip in production)
        const country = await getCountryFromIP(ip);
        // Insert event into database
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertOne"])(`INSERT INTO events (hub_id, link_id, event_type, visitor_ip, visitor_country, visitor_device, visitor_user_agent, referrer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [
            hub_id,
            link_id || null,
            event_type,
            ip,
            country,
            device,
            userAgent,
            referrer
        ]);
        // Also increment click_count on link if this is a click
        if (event_type === 'CLICK' && link_id) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertOne"])(`UPDATE links SET click_count = click_count + 1 WHERE id = $1 RETURNING *`, [
                link_id
            ]);
        }
        console.log(`[Analytics] ${event_type} recorded for hub ${hub_id}`, {
            link_id,
            device,
            country
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('[Analytics] Error tracking event:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
// Helper function to detect device
function detectDevice(userAgent) {
    const ua = userAgent.toLowerCase();
    if (/ipad|android(?!.*mobile)/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
}
// Helper function to get country from IP
async function getCountryFromIP(ip) {
    if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
        return null;
    }
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
            next: {
                revalidate: 3600
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.countryCode || null;
        }
    } catch  {
        return null;
    }
    return null;
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const hubId = searchParams.get('hub_id');
        if (!hubId) {
            const events = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT * FROM events ORDER BY created_at DESC LIMIT 100`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: events
            });
        }
        const events = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT * FROM events WHERE hub_id = $1 ORDER BY created_at DESC LIMIT 100`, [
            parseInt(hubId)
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('[Analytics] Error fetching events:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch events'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__feaf0862._.js.map