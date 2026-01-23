module.exports = [
"[project]/Documents/GitHub/Advitiya_H/src/app/favicon.ico.mjs { IMAGE => \"[project]/Documents/GitHub/Advitiya_H/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/app/favicon.ico.mjs { IMAGE => \"[project]/Documents/GitHub/Advitiya_H/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/Documents/GitHub/Advitiya_H/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Documents/GitHub/Advitiya_H/src/lib/rule-engine.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// SMART LINK HUB - Rule Engine
// The core "Smart" routing logic
// ============================================
__turbopack_context__.s([
    "detectDevice",
    ()=>detectDevice,
    "detectOS",
    ()=>detectOS,
    "evaluateRules",
    ()=>evaluateRules,
    "getCurrentDay",
    ()=>getCurrentDay,
    "getCurrentHour",
    ()=>getCurrentHour
]);
function evaluateRules(links, context) {
    // Filter only active links
    const activeLinks = links.filter((link)=>link.is_active);
    // Apply rules to each link
    const filteredLinks = activeLinks.filter((link)=>{
        return shouldShowLink(link, context);
    });
    // Sort by priority (higher first) and click_count (performance-based)
    const sortedLinks = filteredLinks.sort((a, b)=>{
        // Primary: priority (descending)
        if (b.priority !== a.priority) {
            return b.priority - a.priority;
        }
        // Secondary: click_count for performance-based sorting (descending)
        return b.click_count - a.click_count;
    });
    // Return links without the rules property (clean response)
    return sortedLinks.map(({ rules, ...link })=>link);
}
/**
 * Determines if a link should be shown based on its rules and visitor context.
 */ function shouldShowLink(link, context) {
    // If no rules, always show
    if (!link.rules || link.rules.length === 0) {
        return true;
    }
    // Get only active rules
    const activeRules = link.rules.filter((rule)=>rule.is_active);
    // If no active rules, always show
    if (activeRules.length === 0) {
        return true;
    }
    // Check each rule - if ANY rule says HIDE, hide the link
    // If a SHOW rule's condition is NOT met, also hide the link
    for (const rule of activeRules){
        const conditionMet = evaluateRule(rule, context);
        if (rule.action === 'SHOW' && !conditionMet) {
            // SHOW rule condition not met = hide
            return false;
        }
        if (rule.action === 'HIDE' && conditionMet) {
            // HIDE rule condition met = hide
            return false;
        }
    }
    return true;
}
/**
 * Evaluates a single rule against the visitor context.
 * Returns true if the condition is satisfied.
 */ function evaluateRule(rule, context) {
    switch(rule.rule_type){
        case 'TIME':
            return evaluateTimeRule(rule.conditions, context);
        case 'DEVICE':
            return evaluateDeviceRule(rule.conditions, context);
        case 'LOCATION':
            return evaluateLocationRule(rule.conditions, context);
        default:
            console.warn(`Unknown rule type: ${rule.rule_type}`);
            return true; // Unknown rules are ignored
    }
}
/**
 * Evaluates TIME-based rules.
 * Checks if current time is within the specified hours/days.
 */ function evaluateTimeRule(conditions, context) {
    const { startHour, endHour, days } = conditions;
    const { currentHour, currentDay } = context;
    // Check day of week if specified
    if (days && days.length > 0) {
        if (!days.includes(currentDay)) {
            return false;
        }
    }
    // Handle time ranges (handles overnight ranges like 22:00 - 06:00)
    if (startHour <= endHour) {
        // Normal range (e.g., 9 to 17)
        return currentHour >= startHour && currentHour < endHour;
    } else {
        // Overnight range (e.g., 22 to 6)
        return currentHour >= startHour || currentHour < endHour;
    }
}
/**
 * Evaluates DEVICE-based rules.
 * Checks device type and optionally OS.
 */ function evaluateDeviceRule(conditions, context) {
    const { device, os } = conditions;
    // Check device type
    if (device && device !== context.device) {
        return false;
    }
    // Check OS if specified
    if (os && os !== context.os) {
        return false;
    }
    return true;
}
/**
 * Evaluates LOCATION-based rules.
 * Checks if visitor's country matches.
 */ function evaluateLocationRule(conditions, context) {
    const { country, countries } = conditions;
    // If visitor country is unknown, don't apply location rules
    if (!context.country) {
        return true; // Show by default if we can't determine location
    }
    // Single country match
    if (country) {
        return context.country.toUpperCase() === country.toUpperCase();
    }
    // Multiple countries match
    if (countries && countries.length > 0) {
        return countries.map((c)=>c.toUpperCase()).includes(context.country.toUpperCase());
    }
    return true;
}
function detectDevice(userAgent) {
    const ua = userAgent.toLowerCase();
    // Check for tablets first (iPads, Android tablets)
    if (/ipad|android(?!.*mobile)/i.test(ua)) {
        return 'tablet';
    }
    // Check for mobile devices
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}
function detectOS(userAgent) {
    const ua = userAgent.toLowerCase();
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/android/i.test(ua)) return 'android';
    if (/windows/i.test(ua)) return 'windows';
    if (/macintosh|mac os/i.test(ua)) return 'macos';
    if (/linux/i.test(ua)) return 'linux';
    return 'unknown';
}
function getCurrentHour(timezone = 'UTC') {
    try {
        const now = new Date();
        const options = {
            hour: 'numeric',
            hour12: false,
            timeZone: timezone
        };
        const hour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now));
        return hour === 24 ? 0 : hour;
    } catch  {
        return new Date().getHours();
    }
}
function getCurrentDay(timezone = 'UTC') {
    try {
        const now = new Date();
        const options = {
            weekday: 'short',
            timeZone: timezone
        };
        const dayStr = new Intl.DateTimeFormat('en-US', options).format(now);
        const dayMap = {
            Sun: 0,
            Mon: 1,
            Tue: 2,
            Wed: 3,
            Thu: 4,
            Fri: 5,
            Sat: 6
        };
        return dayMap[dayStr] ?? new Date().getDay();
    } catch  {
        return new Date().getDay();
    }
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/lib/visitor-context.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// SMART LINK HUB - Visitor Context Utilities
// ============================================
__turbopack_context__.s([
    "getVisitorContext",
    ()=>getVisitorContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$rule$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/rule-engine.ts [app-rsc] (ecmascript)");
;
async function getVisitorContext(headers) {
    // Get User-Agent
    const userAgent = headers.get('user-agent') || '';
    // Get IP address
    const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || '127.0.0.1';
    // Detect device and OS from User-Agent
    const device = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$rule$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectDevice"])(userAgent);
    const os = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$rule$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectOS"])(userAgent);
    // Get country from IP (using free geo-ip services)
    const country = await getCountryFromIP(ip);
    // Get timezone (default to UTC, can be improved with client-side detection)
    const timezone = headers.get('x-timezone') || 'UTC';
    // Get current time in visitor's timezone
    const currentHour = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$rule$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentHour"])(timezone);
    const currentDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$rule$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentDay"])(timezone);
    // Get referrer
    const referrer = headers.get('referer') || null;
    return {
        ip,
        userAgent,
        device,
        os,
        country,
        currentHour,
        currentDay,
        timezone,
        referrer
    };
}
/**
 * Gets country code from IP address using free geo-ip services.
 * Falls back gracefully if services are unavailable.
 */ async function getCountryFromIP(ip) {
    // Skip for localhost/private IPs
    if (isPrivateIP(ip)) {
        return null;
    }
    try {
        // Using ip-api.com (free, no API key required, 45 req/min limit)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
            next: {
                revalidate: 3600
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.countryCode || null;
        }
    } catch (error) {
        console.warn('Failed to get country from IP:', error);
    }
    // Fallback: Try ipapi.co
    try {
        const response = await fetch(`https://ipapi.co/${ip}/country/`, {
            next: {
                revalidate: 3600
            }
        });
        if (response.ok) {
            const country = await response.text();
            return country.trim() || null;
        }
    } catch (error) {
        console.warn('Fallback geo-ip failed:', error);
    }
    return null;
}
/**
 * Checks if an IP address is private/local.
 */ function isPrivateIP(ip) {
    // IPv4 private ranges
    if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('10.') || ip.startsWith('172.16.') || ip.startsWith('172.17.') || ip.startsWith('172.18.') || ip.startsWith('172.19.') || ip.startsWith('172.20.') || ip.startsWith('172.21.') || ip.startsWith('172.22.') || ip.startsWith('172.23.') || ip.startsWith('172.24.') || ip.startsWith('172.25.') || ip.startsWith('172.26.') || ip.startsWith('172.27.') || ip.startsWith('172.28.') || ip.startsWith('172.29.') || ip.startsWith('172.30.') || ip.startsWith('172.31.') || ip.startsWith('192.168.')) {
        return true;
    }
    // IPv6 localhost
    if (ip === '::1') {
        return true;
    }
    return false;
}
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[project]/Documents/GitHub/Advitiya_H/src/lib/storage.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLinksWithRules",
    ()=>getLinksWithRules,
    "readLinks",
    ()=>readLinks,
    "readRules",
    ()=>readRules,
    "writeLinks",
    ()=>writeLinks,
    "writeRules",
    ()=>writeRules
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/os [external] (os, cjs)");
;
;
;
// Store data in OS temp directory to avoid triggering HMR
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["default"].tmpdir(), 'smart-link-hub-data');
const LINKS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'links.json');
const RULES_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'rules.json');
// Initial demo data (Split into Links and Rules)
const DEMO_LINKS = [
    {
        id: 1,
        hub_id: 1,
        title: '🌐 My Website',
        url: 'https://example.com',
        icon: null,
        priority: 100,
        click_count: 150,
        is_active: true,
        created_at: new Date('2024-01-01T00:00:00.000Z'),
        updated_at: new Date('2024-01-01T00:00:00.000Z')
    },
    {
        id: 2,
        hub_id: 1,
        title: '💻 GitHub',
        url: 'https://github.com',
        icon: null,
        priority: 90,
        click_count: 120,
        is_active: true,
        created_at: new Date('2024-01-01T00:00:00.000Z'),
        updated_at: new Date('2024-01-01T00:00:00.000Z')
    },
    {
        id: 3,
        hub_id: 1,
        title: '💼 LinkedIn',
        url: 'https://linkedin.com',
        icon: null,
        priority: 80,
        click_count: 100,
        is_active: true,
        created_at: new Date('2024-01-01T00:00:00.000Z'),
        updated_at: new Date('2024-01-01T00:00:00.000Z')
    },
    {
        id: 4,
        hub_id: 1,
        title: '📅 Join Meeting (9AM-5PM)',
        url: 'https://meet.google.com',
        icon: null,
        priority: 70,
        click_count: 50,
        is_active: true,
        created_at: new Date('2024-01-01T00:00:00.000Z'),
        updated_at: new Date('2024-01-01T00:00:00.000Z')
    }
];
const DEMO_RULES = [
    {
        id: 1,
        link_id: 4,
        rule_type: 'TIME',
        conditions: {
            startHour: 9,
            endHour: 17
        },
        action: 'SHOW',
        is_active: true,
        created_at: new Date('2024-01-01T00:00:00.000Z')
    }
];
// Helper to revive dates from JSON
const dateReviver = (key, value)=>{
    if (key === 'created_at' || key === 'updated_at') {
        return new Date(value);
    }
    return value;
};
// Helper to ensure data directory exists
async function ensureDataDir() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].access(DATA_DIR);
    } catch  {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].mkdir(DATA_DIR, {
            recursive: true
        });
    }
}
async function readLinks() {
    await ensureDataDir();
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(LINKS_FILE, 'utf-8');
        return JSON.parse(data, dateReviver);
    } catch (error) {
        await writeLinks(DEMO_LINKS);
        return DEMO_LINKS;
    }
}
async function writeLinks(links) {
    await ensureDataDir();
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(LINKS_FILE, JSON.stringify(links, null, 2));
}
async function readRules() {
    await ensureDataDir();
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(RULES_FILE, 'utf-8');
        return JSON.parse(data, dateReviver);
    } catch (error) {
        await writeRules(DEMO_RULES);
        return DEMO_RULES;
    }
}
async function writeRules(rules) {
    await ensureDataDir();
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(RULES_FILE, JSON.stringify(rules, null, 2));
}
async function getLinksWithRules() {
    const links = await readLinks();
    const rules = await readRules();
    return links.map((link)=>({
            ...link,
            rules: rules.filter((r)=>r.link_id === link.id)
        }));
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx <module evaluation>", "default");
}),
"[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx", "default");
}),
"[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$LinkButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$LinkButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$LinkButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HubPage,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
// ============================================
// SMART LINK HUB - Public Hub Page
// Dynamic route: /[slug]
// ============================================
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$rule$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/rule-engine.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$visitor$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/visitor-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/lib/storage.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$LinkButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/LinkButton.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
// Demo data for initial testing (replace with DB queries later)
const DEMO_HUB = {
    id: 1,
    user_id: 1,
    slug: 'demo',
    title: 'Demo Hub',
    bio: 'Welcome to my Smart Link Hub! 🚀',
    avatar_url: null,
    theme_config: {
        bg: '#000000',
        accent: '#00FF00',
        textColor: '#FFFFFF'
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
};
async function generateMetadata({ params }) {
    const { slug } = await params;
    const hub = await getHub(slug);
    if (!hub) {
        return {
            title: 'Hub Not Found'
        };
    }
    return {
        title: `${hub.title} | Smart Link Hub`,
        description: hub.bio || `Check out ${hub.title}'s links`,
        openGraph: {
            title: hub.title,
            description: hub.bio || undefined,
            type: 'profile'
        }
    };
}
// Fetch hub data (demo implementation)
async function getHub(slug) {
    // Allow accessing the demo hub via 'demo' or '1'
    if (slug === 'demo' || slug === '1') {
        return DEMO_HUB;
    }
    return null;
}
// Fetch links with rules (using file storage)
async function getLinksWithRules(hubId) {
    try {
        const allLinks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLinksWithRules"])();
        return allLinks.filter((l)=>l.hub_id === hubId).sort((a, b)=>b.priority - a.priority);
    } catch (error) {
        console.error('Error fetching links:', error);
        return [];
    }
}
// Track page view (demo implementation)
async function trackPageView(hubId, visitorCountry, visitorDevice, userAgent, referrer) {
// TODO: Replace with actual database insert
// console.log('Page View:', { hubId, visitorCountry, ... }); 
}
async function HubPage({ params }) {
    const { slug } = await params;
    // Fetch hub data
    const hub = await getHub(slug);
    if (!hub) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    // Get visitor context from headers
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    const context = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$visitor$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVisitorContext"])(headersList);
    // Fetch links with their rules
    const linksWithRules = await getLinksWithRules(hub.id);
    // Apply smart rules to filter links
    const filteredLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$lib$2f$rule$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateRules"])(linksWithRules, context);
    // Track page view (async, don't wait)
    trackPageView(hub.id, context.country, context.device, context.userAgent, context.referrer);
    const { bg, accent, textColor } = hub.theme_config;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen flex flex-col items-center px-4 py-12",
        style: {
            backgroundColor: bg,
            color: textColor
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-8 animate-fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold",
                        style: {
                            backgroundColor: `${accent}20`,
                            border: `3px solid ${accent}`,
                            boxShadow: `0 0 20px ${accent}40`
                        },
                        children: hub.title.charAt(0).toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold mb-2",
                        style: {
                            color: accent
                        },
                        children: hub.title
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    hub.bio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 max-w-md mx-auto",
                        children: hub.bio
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md space-y-4",
                children: filteredLinks.length > 0 ? filteredLinks.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$LinkButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        link: link,
                        accent: accent,
                        index: index
                    }, link.id, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-gray-500",
                    children: "No links available"
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                    lineNumber: 170,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "mt-12 text-center text-gray-600 text-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "Powered by",
                        ' ',
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: accent
                            },
                            className: "font-semibold",
                            children: "Smart Link Hub"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 p-4 rounded-lg text-xs font-mono",
                style: {
                    backgroundColor: '#111'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 mb-2",
                        children: "Debug Info:"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Device: ",
                            context.device
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "OS: ",
                            context.os
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Country: ",
                            context.country || 'Unknown'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Hour: ",
                            context.currentHour
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Day: ",
                            context.currentDay
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Total Links: ",
                            linksWithRules.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Filtered Links: ",
                            filteredLinks.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
                lineNumber: 186,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/app/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f6ff0291._.js.map