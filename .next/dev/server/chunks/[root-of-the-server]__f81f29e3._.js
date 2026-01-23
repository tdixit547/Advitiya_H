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
"[project]/Documents/GitHub/Advitiya_H/src/app/api/health/db/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// ============================================
// SMART LINK HUB - Database Health Check API
// GET /api/health/db - PostgreSQL health check
// ============================================
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET() {
    try {
        // 1. Check connection
        const isConnected = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkConnection"])();
        if (!isConnected) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Database connection failed',
                checks: {
                    connection: false
                }
            }, {
                status: 503
            });
        }
        // 2. Check required tables exist
        const requiredTables = [
            'users',
            'hubs',
            'links',
            'link_rules',
            'events'
        ];
        const tableResults = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`);
        const existingTables = tableResults.rows.map((r)=>r.table_name);
        const tableChecks = requiredTables.map((t)=>({
                table_name: t,
                exists: existingTables.includes(t)
            }));
        const allTablesExist = tableChecks.every((t)=>t.exists);
        // 3. Check required indexes exist
        const indexResults = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public'`);
        const requiredIndexes = [
            {
                table: 'hubs',
                column: 'slug'
            },
            {
                table: 'links',
                column: 'hub_id'
            },
            {
                table: 'link_rules',
                column: 'link_id'
            },
            {
                table: 'events',
                column: 'hub_id'
            },
            {
                table: 'events',
                column: 'event_type'
            }
        ];
        const existingIndexNames = indexResults.rows.map((r)=>r.indexname);
        const indexChecks = requiredIndexes.map((idx)=>({
                index: `idx_${idx.table}_${idx.column}`,
                table: idx.table,
                column: idx.column,
                exists: existingIndexNames.some((name)=>name.includes(idx.table) && name.includes(idx.column))
            }));
        // 4. Summary
        const allHealthy = isConnected && allTablesExist;
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: allHealthy,
            database_url: process.env.DATABASE_URL ? 'configured' : 'missing',
            checks: {
                connection: isConnected,
                tables: tableChecks,
                indexes: indexChecks,
                all_tables_exist: allTablesExist
            },
            message: allHealthy ? 'Database ready' : 'Database issues detected'
        }, {
            status: allHealthy ? 200 : 503
        });
    } catch (error) {
        console.error('[Health] Database check failed:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || 'Unknown error',
            checks: {
                connection: false
            }
        }, {
            status: 503
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f81f29e3._.js.map