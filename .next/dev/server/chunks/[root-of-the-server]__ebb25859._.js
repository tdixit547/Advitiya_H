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
"[project]/Documents/GitHub/Advitiya_H/src/app/api/shorten/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
// ============================================
// SMART LINK HUB - URL Shortener API
// POST /api/shorten - Create short URL
// GET /api/shorten - List short URLs
// ============================================
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
// Generate random short code
function generateShortCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for(let i = 0; i < length; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
async function POST(request) {
    try {
        const body = await request.json();
        const { url, custom_code, hub_id } = body;
        if (!url) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'URL is required'
            }, {
                status: 400
            });
        }
        // Validate URL format
        try {
            new URL(url);
        } catch  {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid URL format'
            }, {
                status: 400
            });
        }
        // Generate or use custom short code
        let shortCode = custom_code || generateShortCode();
        // Check if short code already exists
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryOne"])(`SELECT * FROM short_urls WHERE short_code = $1`, [
            shortCode
        ]);
        if (existing) {
            if (custom_code) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'This short code is already taken'
                }, {
                    status: 409
                });
            }
            // Generate a new code if random one exists
            shortCode = generateShortCode(8);
        }
        // Insert new short URL
        const newUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertOne"])(`INSERT INTO short_urls (short_code, original_url, hub_id, click_count)
       VALUES ($1, $2, $3, 0)
       RETURNING *`, [
            shortCode,
            url,
            hub_id || null
        ]);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                ...newUrl,
                short_url: `${baseUrl}/s/${newUrl.short_code}`
            }
        });
    } catch (error) {
        // Check if it's a "relation does not exist" error (table not created)
        if (error.code === '42P01') {
            // Create the table
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        CREATE TABLE IF NOT EXISTS short_urls (
          id SERIAL PRIMARY KEY,
          short_code VARCHAR(20) UNIQUE NOT NULL,
          original_url TEXT NOT NULL,
          hub_id INT,
          click_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(short_code);
      `);
            // Retry the insert
            return POST(request);
        }
        console.error('[Shorten API] Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create short URL'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const hubId = searchParams.get('hub_id');
    try {
        let urls;
        if (hubId) {
            urls = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT * FROM short_urls WHERE hub_id = $1 ORDER BY created_at DESC`, [
                parseInt(hubId)
            ]);
        } else {
            urls = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queryMany"])(`SELECT * FROM short_urls ORDER BY created_at DESC LIMIT 100`);
        }
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: urls.map((u)=>({
                    ...u,
                    short_url: `${baseUrl}/s/${u.short_code}`
                }))
        });
    } catch (error) {
        if (error.code === '42P01') {
            // Table doesn't exist yet
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: []
            });
        }
        console.error('[Shorten API] Error fetching URLs:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch short URLs'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'ID is required'
        }, {
            status: 400
        });
    }
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`DELETE FROM short_urls WHERE id = $1`, [
            parseInt(id)
        ]);
        if (result.rowCount === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Short URL not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Short URL deleted'
        });
    } catch (error) {
        console.error('[Shorten API] Error deleting:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to delete short URL'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ebb25859._.js.map