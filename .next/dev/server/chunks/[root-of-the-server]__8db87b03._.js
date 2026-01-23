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
"[project]/Documents/GitHub/Advitiya_H/src/app/api/analytics/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// ============================================
// SMART LINK HUB - Analytics Stats API
// GET /api/analytics/stats
// ============================================
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/server.js [app-route] (ecmascript)");
;
// Demo stats data (replace with database queries in production)
const DEMO_STATS = {
    totalViews: 1250,
    totalClicks: 487,
    uniqueVisitors: 892,
    topLinks: [
        {
            id: 1,
            title: '🌐 My Website',
            clicks: 150,
            ctr: 12.0
        },
        {
            id: 2,
            title: '💻 GitHub',
            clicks: 120,
            ctr: 9.6
        },
        {
            id: 3,
            title: '💼 LinkedIn',
            clicks: 100,
            ctr: 8.0
        },
        {
            id: 4,
            title: '📅 Join Meeting',
            clicks: 50,
            ctr: 4.0
        },
        {
            id: 5,
            title: '📱 Download iOS App',
            clicks: 40,
            ctr: 3.2
        }
    ],
    viewsByDay: [
        {
            date: '2026-01-17',
            views: 145,
            clicks: 52
        },
        {
            date: '2026-01-18',
            views: 178,
            clicks: 67
        },
        {
            date: '2026-01-19',
            views: 156,
            clicks: 58
        },
        {
            date: '2026-01-20',
            views: 189,
            clicks: 72
        },
        {
            date: '2026-01-21',
            views: 201,
            clicks: 85
        },
        {
            date: '2026-01-22',
            views: 223,
            clicks: 91
        },
        {
            date: '2026-01-23',
            views: 158,
            clicks: 62
        }
    ],
    viewsByCountry: [
        {
            country: 'IN',
            count: 456
        },
        {
            country: 'US',
            count: 298
        },
        {
            country: 'UK',
            count: 156
        },
        {
            country: 'CA',
            count: 89
        },
        {
            country: 'DE',
            count: 67
        }
    ],
    viewsByDevice: [
        {
            device: 'mobile',
            count: 625
        },
        {
            device: 'desktop',
            count: 512
        },
        {
            device: 'tablet',
            count: 113
        }
    ]
};
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const hubId = searchParams.get('hub_id');
        const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d
        // TODO: In production, query database for actual stats
        // const stats = await getStatsFromDatabase(hubId, period);
        // For demo, return mock data
        console.log(`[Analytics] Fetching stats for hub ${hubId}, period: ${period}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: DEMO_STATS
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8db87b03._.js.map