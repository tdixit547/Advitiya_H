(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RuleConfigurator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// ============================================
// SMART LINK HUB - Rule Configurator Component
// No-code UI for setting up smart rules
// ============================================
'use client';
;
function RuleConfigurator({ link, onAddRule, onDeleteRule }) {
    _s();
    const [isAddingRule, setIsAddingRule] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ruleType, setRuleType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('TIME');
    const [action, setAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('SHOW');
    // Time rule state
    const [startHour, setStartHour] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(9);
    const [endHour, setEndHour] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(17);
    // Device rule state
    const [device, setDevice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('mobile');
    const [os, setOs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Location rule state
    const [country, setCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('IN');
    const handleAddRule = ()=>{
        let conditions = {};
        switch(ruleType){
            case 'TIME':
                conditions = {
                    startHour,
                    endHour
                };
                break;
            case 'DEVICE':
                conditions = {
                    device
                };
                if (os) conditions.os = os;
                break;
            case 'LOCATION':
                conditions = {
                    country
                };
                break;
        }
        onAddRule({
            rule_type: ruleType,
            conditions,
            action,
            is_active: true
        });
        setIsAddingRule(false);
        // Reset form
        setStartHour(9);
        setEndHour(17);
        setDevice('mobile');
        setOs('');
        setCountry('IN');
    };
    const getRuleDescription = (rule)=>{
        const conditions = rule.conditions;
        switch(rule.rule_type){
            case 'TIME':
                return `${rule.action} between ${conditions.startHour}:00 - ${conditions.endHour}:00`;
            case 'DEVICE':
                return `${rule.action} on ${conditions.device}${conditions.os ? ` (${conditions.os})` : ''}`;
            case 'LOCATION':
                return `${rule.action} in ${conditions.country}`;
            default:
                return 'Unknown rule';
        }
    };
    const getRuleIcon = (type)=>{
        switch(type){
            case 'TIME':
                return '⏰';
            case 'DEVICE':
                return '📱';
            case 'LOCATION':
                return '🌍';
            default:
                return '⚙️';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "dashboard-card p-6 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-[#00FF00] mb-1",
                        children: [
                            'Smart Rules for "',
                            link.title,
                            '"'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-sm",
                        children: "Configure when this link should appear based on visitor context"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    link.rules.map((rule)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-3 bg-black/50 rounded-lg border border-gray-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-2xl",
                                            children: getRuleIcon(rule.rule_type)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-[#00FF00] uppercase font-medium",
                                                    children: rule.rule_type
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-white",
                                                    children: getRuleDescription(rule)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                            lineNumber: 116,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onDeleteRule(rule.id),
                                    className: "text-red-500 hover:text-red-400 p-2",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, rule.id, true, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this)),
                    link.rules.length === 0 && !isAddingRule && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-center py-4",
                        children: "No rules configured. This link is always visible."
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            isAddingRule ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 p-4 bg-black/50 rounded-lg border border-[#00FF00]/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-medium text-white",
                        children: "Add New Rule"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-gray-400 text-sm mb-2",
                                children: "Rule Type"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    'TIME',
                                    'DEVICE',
                                    'LOCATION'
                                ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setRuleType(type),
                                        className: `px-4 py-2 rounded-lg border transition-all ${ruleType === type ? 'bg-[#00FF00] text-black border-[#00FF00]' : 'border-gray-600 text-gray-400 hover:border-[#00FF00]'}`,
                                        children: [
                                            getRuleIcon(type),
                                            " ",
                                            type
                                        ]
                                    }, type, true, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 149,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-gray-400 text-sm mb-2",
                                children: "Action"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setAction('SHOW'),
                                        className: `px-4 py-2 rounded-lg border transition-all ${action === 'SHOW' ? 'bg-[#00FF00] text-black border-[#00FF00]' : 'border-gray-600 text-gray-400 hover:border-[#00FF00]'}`,
                                        children: "SHOW only when"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setAction('HIDE'),
                                        className: `px-4 py-2 rounded-lg border transition-all ${action === 'HIDE' ? 'bg-red-500 text-white border-red-500' : 'border-gray-600 text-gray-400 hover:border-red-500'}`,
                                        children: "HIDE when"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2",
                        children: [
                            ruleType === 'TIME' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-400 text-sm mb-1",
                                                children: "Start Hour"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: startHour,
                                                onChange: (e)=>setStartHour(parseInt(e.target.value)),
                                                className: "w-24",
                                                children: Array.from({
                                                    length: 24
                                                }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: i,
                                                        children: [
                                                            i.toString().padStart(2, '0'),
                                                            ":00"
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 197,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 195,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 mt-6",
                                        children: "to"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 209,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-400 text-sm mb-1",
                                                children: "End Hour"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 211,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: endHour,
                                                onChange: (e)=>setEndHour(parseInt(e.target.value)),
                                                className: "w-24",
                                                children: Array.from({
                                                    length: 24
                                                }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: i,
                                                        children: [
                                                            i.toString().padStart(2, '0'),
                                                            ":00"
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 194,
                                columnNumber: 15
                            }, this),
                            ruleType === 'DEVICE' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-400 text-sm mb-1",
                                                children: "Device"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 230,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: device,
                                                onChange: (e)=>setDevice(e.target.value),
                                                className: "w-32",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "mobile",
                                                        children: "Mobile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "desktop",
                                                        children: "Desktop"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "tablet",
                                                        children: "Tablet"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 231,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 229,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-400 text-sm mb-1",
                                                children: "OS (Optional)"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 242,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: os,
                                                onChange: (e)=>setOs(e.target.value),
                                                className: "w-32",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Any"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 250,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "ios",
                                                        children: "iOS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "android",
                                                        children: "Android"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "windows",
                                                        children: "Windows"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 253,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "macos",
                                                        children: "macOS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 245,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 241,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this),
                            ruleType === 'LOCATION' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-gray-400 text-sm mb-1",
                                        children: "Country"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 262,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: country,
                                        onChange: (e)=>setCountry(e.target.value),
                                        className: "w-48",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "IN",
                                                children: "🇮🇳 India"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 268,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "US",
                                                children: "🇺🇸 United States"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 269,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "UK",
                                                children: "🇬🇧 United Kingdom"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 270,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "CA",
                                                children: "🇨🇦 Canada"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 271,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "DE",
                                                children: "🇩🇪 Germany"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 272,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "AU",
                                                children: "🇦🇺 Australia"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 273,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "FR",
                                                children: "🇫🇷 France"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 274,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "JP",
                                                children: "🇯🇵 Japan"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                                lineNumber: 275,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                        lineNumber: 263,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 261,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 pt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAddRule,
                                className: "btn btn-primary",
                                children: "Add Rule"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsAddingRule(false),
                                className: "btn btn-secondary",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsAddingRule(true),
                className: "w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-[#00FF00] hover:text-[#00FF00] transition-all",
                children: "+ Add Smart Rule"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
                lineNumber: 295,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(RuleConfigurator, "18r4znZSsS1cmvlUFxqHoj/46UQ=");
_c = RuleConfigurator;
var _c;
__turbopack_context__.k.register(_c, "RuleConfigurator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LinkListReorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/@dnd-kit/core/dist/core.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function LinkListReorder({ links, onReorder, onEdit, onDelete, onSelect, selectedId }) {
    _s();
    const sensors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointerSensor"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardSensor"], {
        coordinateGetter: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortableKeyboardCoordinates"]
    }));
    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = links.findIndex((item)=>item.id === active.id);
            const newIndex = links.findIndex((item)=>item.id === over?.id);
            onReorder((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayMove"])(links, oldIndex, newIndex));
        }
    }
    if (links.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-8 text-[#666]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm",
                    children: "No links yet"
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs mt-1",
                    children: 'Click "Add Link" to create one'
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DndContext"], {
        sensors: sensors,
        collisionDetection: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closestCenter"],
        onDragEnd: handleDragEnd,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
            items: links.map((l)=>l.id),
            strategy: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verticalListSortingStrategy"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                role: "list",
                children: links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableLinkItem, {
                        link: link,
                        onEdit: ()=>onEdit(link),
                        onDelete: ()=>onDelete(link.id),
                        onSelect: ()=>onSelect(link),
                        isSelected: selectedId === link.id
                    }, link.id, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(LinkListReorder, "H6JV9DRwuHm/UEUj038pRxJnNmw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"]
    ];
});
_c = LinkListReorder;
function SortableLinkItem({ link, onEdit, onDelete, onSelect, isSelected }) {
    _s1();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
        id: link.id
    });
    const style = {
        transform: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.8 : 1
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: setNodeRef,
        style: style,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("bg-[#0a0a0a] border rounded-lg p-3 flex items-center gap-3 group transition-all cursor-pointer", isSelected ? "border-[#00C853] ring-1 ring-[#00C853]/30 bg-[#00C853]/5" : "border-[#222] hover:border-[#333] hover:bg-[#111]"),
        onClick: onSelect,
        role: "listitem",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ...attributes,
                ...listeners,
                className: "cursor-grab active:cursor-grabbing p-1 text-[#444] hover:text-[#666] focus:outline-none shrink-0",
                "aria-label": "Drag to reorder",
                onClick: (e)=>e.stopPropagation(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 16 16",
                    fill: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M4 5h8v1.5H4zM4 9.5h8V11H4z"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("font-medium text-sm truncate", link.is_active ? "text-[#E6E6E6]" : "text-[#666] line-through"),
                        children: link.title
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-[#666] truncate",
                        children: link.url
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 shrink-0",
                children: [
                    link.rules.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-1.5 py-0.5 text-[10px] bg-[#00C853]/20 text-[#00C853] rounded border border-[#00C853]/30 uppercase font-medium",
                        children: [
                            link.rules.length,
                            " ",
                            link.rules.length === 1 ? 'rule' : 'rules'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: (e)=>{
                            e.stopPropagation();
                            onDelete();
                        },
                        className: "p-1.5 text-[#666] hover:text-red-400 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity",
                        "aria-label": "Delete link",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s1(SortableLinkItem, "9J/a3p2iAf7PAeqkD/B/H2PQwgk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
    ];
});
_c1 = SortableLinkItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "LinkListReorder");
__turbopack_context__.k.register(_c1, "SortableLinkItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddLinkModal",
    ()=>AddLinkModal,
    "Modal",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
function Modal({ isOpen, onClose, title, children }) {
    _s();
    // Close on Escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            const handleEscape = {
                "Modal.useEffect.handleEscape": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["Modal.useEffect.handleEscape"];
            if (isOpen) {
                document.addEventListener('keydown', handleEscape);
                document.body.style.overflow = 'hidden';
            }
            return ({
                "Modal.useEffect": ()=>{
                    document.removeEventListener('keydown', handleEscape);
                    document.body.style.overflow = 'unset';
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen,
        onClose
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "modal-title",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/80 backdrop-blur-sm",
                onClick: onClose,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 w-full max-w-md mx-4 bg-[#111] border border-[#333] rounded-2xl shadow-2xl animate-modal-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between p-6 border-b border-[#222]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                id: "modal-title",
                                className: "text-xl font-bold text-white",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                                lineNumber: 48,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-2 rounded-lg hover:bg-[#222] text-[#9A9A9A] hover:text-white transition-colors",
                                "aria-label": "Close modal",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                                        lineNumber: 55,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                                    lineNumber: 54,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                                lineNumber: 49,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                        lineNumber: 47,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                        lineNumber: 61,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
        lineNumber: 31,
        columnNumber: 9
    }, this);
}
_s(Modal, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Modal;
function AddLinkModal({ isOpen, onClose, onAdd }) {
    _s1();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [url, setUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!title.trim() || !url.trim()) return;
        setIsSubmitting(true);
        try {
            await onAdd(title, url);
            setTitle('');
            setUrl('');
            onClose();
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AddLinkModal.useCallback[handleClose]": ()=>{
            setTitle('');
            setUrl('');
            onClose();
        }
    }["AddLinkModal.useCallback[handleClose]"], [
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Modal, {
        isOpen: isOpen,
        onClose: handleClose,
        title: "Add New Link",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "link-title",
                            className: "block text-sm font-medium text-[#9A9A9A] mb-2",
                            children: "Title"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                            lineNumber: 105,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "link-title",
                            type: "text",
                            value: title,
                            onChange: (e)=>setTitle(e.target.value),
                            placeholder: "My Awesome Link",
                            className: "w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none transition-colors",
                            autoFocus: true,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                            lineNumber: 108,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                    lineNumber: 104,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "link-url",
                            className: "block text-sm font-medium text-[#9A9A9A] mb-2",
                            children: "URL"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                            lineNumber: 121,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "link-url",
                            type: "url",
                            value: url,
                            onChange: (e)=>setUrl(e.target.value),
                            placeholder: "https://example.com",
                            className: "w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none transition-colors",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                            lineNumber: 124,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                    lineNumber: 120,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleClose,
                            className: "flex-1 px-4 py-3 bg-[#222] hover:bg-[#333] text-white rounded-xl font-medium transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                            lineNumber: 136,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isSubmitting || !title.trim() || !url.trim(),
                            className: "flex-1 px-4 py-3 bg-[#00C853] hover:bg-[#00E676] disabled:bg-[#00C853]/50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-colors",
                            children: isSubmitting ? 'Adding...' : 'Add Link'
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                            lineNumber: 143,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
                    lineNumber: 135,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
            lineNumber: 103,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx",
        lineNumber: 102,
        columnNumber: 9
    }, this);
}
_s1(AddLinkModal, "0gcUU1FF5EHh2gtq35+tfwrSf/A=");
_c1 = AddLinkModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "Modal");
__turbopack_context__.k.register(_c1, "AddLinkModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LinksPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$RuleConfigurator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/RuleConfigurator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$LinkListReorder$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/LinkListReorder.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/Modal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function LinksPage() {
    _s();
    const [links, setLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedLink, setSelectedLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAddModalOpen, setIsAddModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const hasFetched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const fetchLinks = async ()=>{
        try {
            const res = await fetch('/api/links?hub_id=1');
            if (!res.ok) throw new Error('Failed to fetch links');
            const data = await res.json();
            if (data.success) setLinks(data.data);
        } catch (err) {
            console.error(err);
        } finally{
            setIsLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LinksPage.useEffect": ()=>{
            if (hasFetched.current) return;
            hasFetched.current = true;
            fetchLinks();
        }
    }["LinksPage.useEffect"], []);
    const handleAddLink = async (title, url)=>{
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        const res = await fetch('/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hub_id: 1,
                title,
                url: formattedUrl
            })
        });
        const data = await res.json();
        if (data.success) {
            setLinks([
                ...links,
                data.data
            ]);
        } else {
            throw new Error(data.error);
        }
    };
    const handleDeleteLink = async (id)=>{
        if (!confirm('Delete this link?')) return;
        try {
            await fetch(`/api/links?id=${id}`, {
                method: 'DELETE'
            });
            setLinks((prev)=>prev.filter((l)=>l.id !== id));
            if (selectedLink?.id === id) setSelectedLink(null);
        } catch (e) {
            alert('Error deleting link');
        }
    };
    const handleAddRule = async (linkId, rule)=>{
        try {
            const res = await fetch('/api/rules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link_id: linkId,
                    ...rule
                })
            });
            const data = await res.json();
            if (data.success) {
                setLinks(links.map((l)=>l.id === linkId ? {
                        ...l,
                        rules: [
                            ...l.rules,
                            data.data
                        ]
                    } : l));
                if (selectedLink?.id === linkId) {
                    setSelectedLink((prev)=>prev ? {
                            ...prev,
                            rules: [
                                ...prev.rules,
                                data.data
                            ]
                        } : null);
                }
            }
        } catch (err) {
            alert('Failed to add rule');
        }
    };
    const handleDeleteRule = async (linkId, ruleId)=>{
        try {
            await fetch(`/api/rules?id=${ruleId}`, {
                method: 'DELETE'
            });
            setLinks(links.map((l)=>l.id === linkId ? {
                    ...l,
                    rules: l.rules.filter((r)=>r.id !== ruleId)
                } : l));
            if (selectedLink?.id === linkId) {
                setSelectedLink((prev)=>prev ? {
                        ...prev,
                        rules: prev.rules.filter((r)=>r.id !== ruleId)
                    } : null);
            }
        } catch (err) {
            alert('Failed to delete rule');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "lg:col-span-4 xl:col-span-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#111] rounded-xl border border-[#222] p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-sm font-bold text-[#9A9A9A] uppercase tracking-wider",
                                    children: "Your Links"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsAddModalOpen(true),
                                    className: "px-3 py-1.5 bg-[#00C853] hover:bg-[#00E676] text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M12 4v16m8-8H4"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                                                lineNumber: 107,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this),
                                        "Add"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin w-6 h-6 border-2 border-[#00C853] border-t-transparent rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$LinkListReorder$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            links: links,
                            onReorder: setLinks,
                            onEdit: (l)=>setSelectedLink(l),
                            onDelete: handleDeleteLink,
                            onSelect: (l)=>setSelectedLink(l),
                            selectedId: selectedLink?.id
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lg:col-span-8 xl:col-span-9",
                children: selectedLink ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$RuleConfigurator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    link: selectedLink,
                    onAddRule: (r)=>handleAddRule(selectedLink.id, r),
                    onDeleteRule: (rid)=>handleDeleteRule(selectedLink.id, rid)
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#111] rounded-xl border border-[#222] p-12 text-center flex flex-col items-center justify-center min-h-[400px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-5xl mb-4 opacity-20",
                            children: "⚡"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-bold text-[#E6E6E6] mb-2",
                            children: "Select a link to configure"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-[#666] max-w-xs",
                            children: "Add smart rules to control when and how your links appear based on time, device, or location."
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                    lineNumber: 139,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$src$2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddLinkModal"], {
                isOpen: isAddModalOpen,
                onClose: ()=>setIsAddModalOpen(false),
                onAdd: handleAddLink
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/app/dashboard/page.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(LinksPage, "1oTBL6JajGpNeN6NkUoQNqb9Gf0=");
_c = LinksPage;
var _c;
__turbopack_context__.k.register(_c, "LinksPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_GitHub_Advitiya_H_src_57310d91._.js.map