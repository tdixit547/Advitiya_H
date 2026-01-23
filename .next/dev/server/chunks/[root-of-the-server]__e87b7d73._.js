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
"[project]/Documents/GitHub/Advitiya_H/src/app/api/analytics/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// ============================================
// SMART LINK HUB - Analytics Stats API
// GET /api/analytics/stats - PostgreSQL version
// ============================================
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const hubId = searchParams.get('hub_id');
        const period = searchParams.get('period') || '7d';
        // Calculate date range
        let days = 7;
        if (period === '30d') days = 30;
        if (period === '90d') days = 90;
        const hubIdNum = hubId ? parseInt(hubId) : 1;
        // Get totals
        const totals = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryOne"])(`SELECT 
        COUNT(*) FILTER (WHERE event_type = 'VIEW') as total_views,
        COUNT(*) FILTER (WHERE event_type = 'CLICK') as total_clicks,
        COUNT(DISTINCT visitor_ip) as unique_visitors
       FROM events 
       WHERE hub_id = $1 
       AND created_at >= NOW() - INTERVAL '${days} days'`, [
            hubIdNum
        ]);
        // Get top links
        const topLinks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT 
        l.id,
        l.title,
        COUNT(e.id) FILTER (WHERE e.event_type = 'CLICK') as clicks,
        CASE 
          WHEN COUNT(e.id) FILTER (WHERE e.event_type = 'VIEW') > 0 
          THEN ROUND(
            COUNT(e.id) FILTER (WHERE e.event_type = 'CLICK')::numeric / 
            COUNT(e.id) FILTER (WHERE e.event_type = 'VIEW')::numeric * 100, 1
          )
          ELSE 0
        END as ctr
       FROM links l
       LEFT JOIN events e ON e.link_id = l.id AND e.created_at >= NOW() - INTERVAL '${days} days'
       WHERE l.hub_id = $1
       GROUP BY l.id, l.title
       ORDER BY clicks DESC
       LIMIT 5`, [
            hubIdNum
        ]);
        // Get views by day
        const viewsByDay = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT 
        DATE(created_at) as date,
        COUNT(*) FILTER (WHERE event_type = 'VIEW') as views,
        COUNT(*) FILTER (WHERE event_type = 'CLICK') as clicks
       FROM events
       WHERE hub_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date`, [
            hubIdNum
        ]);
        // Get views by country
        const viewsByCountry = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT 
        COALESCE(visitor_country, 'Unknown') as country,
        COUNT(*) as count
       FROM events
       WHERE hub_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY visitor_country
       ORDER BY count DESC
       LIMIT 10`, [
            hubIdNum
        ]);
        // Get views by device
        const viewsByDevice = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT 
        COALESCE(visitor_device, 'unknown') as device,
        COUNT(*) as count
       FROM events
       WHERE hub_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY visitor_device
       ORDER BY count DESC`, [
            hubIdNum
        ]);
        const stats = {
            totalViews: Number(totals?.total_views || 0),
            totalClicks: Number(totals?.total_clicks || 0),
            uniqueVisitors: Number(totals?.unique_visitors || 0),
            topLinks: topLinks.map((l)=>({
                    id: l.id,
                    title: l.title,
                    clicks: Number(l.clicks),
                    ctr: Number(l.ctr)
                })),
            viewsByDay: viewsByDay.map((v)=>({
                    date: String(v.date),
                    views: Number(v.views),
                    clicks: Number(v.clicks)
                })),
            viewsByCountry: viewsByCountry.map((v)=>({
                    country: v.country,
                    count: Number(v.count)
                })),
            viewsByDevice: viewsByDevice.map((v)=>({
                    device: v.device,
                    count: Number(v.count)
                }))
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('[Analytics] Error fetching stats:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch analytics'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e87b7d73._.js.map