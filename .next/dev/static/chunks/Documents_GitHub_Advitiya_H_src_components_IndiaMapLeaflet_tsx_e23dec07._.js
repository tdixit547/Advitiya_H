(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IndiaMapLeaflet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// India GeoJSON source URL
const INDIA_GEOJSON_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';
// Map state names to codes
const stateNameToCode = {
    'andaman and nicobar islands': 'AN',
    'andaman & nicobar': 'AN',
    'andhra pradesh': 'AP',
    'arunachal pradesh': 'AR',
    'assam': 'AS',
    'bihar': 'BR',
    'chandigarh': 'CH',
    'chhattisgarh': 'CT',
    'dadra and nagar haveli': 'DN',
    'dadra & nagar haveli': 'DN',
    'daman and diu': 'DD',
    'daman & diu': 'DD',
    'delhi': 'DL',
    'nct of delhi': 'DL',
    'goa': 'GA',
    'gujarat': 'GJ',
    'haryana': 'HR',
    'himachal pradesh': 'HP',
    'jammu and kashmir': 'JK',
    'jammu & kashmir': 'JK',
    'jharkhand': 'JH',
    'karnataka': 'KA',
    'kerala': 'KL',
    'ladakh': 'LA',
    'lakshadweep': 'LD',
    'madhya pradesh': 'MP',
    'maharashtra': 'MH',
    'manipur': 'MN',
    'meghalaya': 'ML',
    'mizoram': 'MZ',
    'nagaland': 'NL',
    'odisha': 'OR',
    'orissa': 'OR',
    'puducherry': 'PY',
    'pondicherry': 'PY',
    'punjab': 'PB',
    'rajasthan': 'RJ',
    'sikkim': 'SK',
    'tamil nadu': 'TN',
    'telangana': 'TG',
    'tripura': 'TR',
    'uttar pradesh': 'UP',
    'uttarakhand': 'UK',
    'uttaranchal': 'UK',
    'west bengal': 'WB'
};
const getStateCode = (name)=>{
    const normalized = name.toLowerCase().trim();
    return stateNameToCode[normalized] || '';
};
function IndiaMapLeaflet({ selectedState, onStateSelect }) {
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const leafletMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const geoJsonLayer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hoveredState, setHoveredState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndiaMapLeaflet.useEffect": ()=>{
            if (!mapRef.current || leafletMap.current) return;
            // Initialize map centered on India
            const map = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(mapRef.current, {
                center: [
                    22.5937,
                    78.9629
                ],
                zoom: 4,
                minZoom: 3,
                maxZoom: 8,
                zoomControl: true,
                attributionControl: false
            });
            // Dark tile layer
            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap, © CARTO'
            }).addTo(map);
            leafletMap.current = map;
            // Load GeoJSON
            fetch(INDIA_GEOJSON_URL).then({
                "IndiaMapLeaflet.useEffect": (res)=>res.json()
            }["IndiaMapLeaflet.useEffect"]).then({
                "IndiaMapLeaflet.useEffect": (data)=>{
                    const geoJson = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].geoJSON(data, {
                        style: {
                            "IndiaMapLeaflet.useEffect.geoJson": (feature)=>{
                                const stateName = feature?.properties?.NAME_1 || feature?.properties?.name || '';
                                const code = getStateCode(stateName);
                                const isSelected = code === selectedState;
                                return {
                                    fillColor: isSelected ? '#00C853' : '#1a1a1a',
                                    fillOpacity: isSelected ? 0.6 : 0.8,
                                    color: isSelected ? '#00C853' : '#444',
                                    weight: isSelected ? 3 : 1
                                };
                            }
                        }["IndiaMapLeaflet.useEffect.geoJson"],
                        onEachFeature: {
                            "IndiaMapLeaflet.useEffect.geoJson": (feature, layer)=>{
                                const stateName = feature?.properties?.NAME_1 || feature?.properties?.name || 'Unknown';
                                const code = getStateCode(stateName);
                                layer.on({
                                    mouseover: {
                                        "IndiaMapLeaflet.useEffect.geoJson": (e)=>{
                                            const target = e.target;
                                            if (code !== selectedState) {
                                                target.setStyle({
                                                    fillColor: '#00C853',
                                                    fillOpacity: 0.3,
                                                    color: '#00C853',
                                                    weight: 2
                                                });
                                            }
                                            setHoveredState(stateName);
                                        }
                                    }["IndiaMapLeaflet.useEffect.geoJson"],
                                    mouseout: {
                                        "IndiaMapLeaflet.useEffect.geoJson": (e)=>{
                                            if (geoJsonLayer.current) {
                                                geoJsonLayer.current.resetStyle(e.target);
                                            }
                                            setHoveredState(null);
                                        }
                                    }["IndiaMapLeaflet.useEffect.geoJson"],
                                    click: {
                                        "IndiaMapLeaflet.useEffect.geoJson": ()=>{
                                            if (code) {
                                                onStateSelect(code);
                                            }
                                        }
                                    }["IndiaMapLeaflet.useEffect.geoJson"]
                                });
                                // Bind tooltip
                                layer.bindTooltip(stateName, {
                                    permanent: false,
                                    direction: 'center',
                                    className: 'india-state-tooltip'
                                });
                            }
                        }["IndiaMapLeaflet.useEffect.geoJson"]
                    }).addTo(map);
                    geoJsonLayer.current = geoJson;
                    setIsLoading(false);
                }
            }["IndiaMapLeaflet.useEffect"]).catch({
                "IndiaMapLeaflet.useEffect": (err)=>{
                    console.error('Failed to load India GeoJSON:', err);
                    setError('Failed to load map data');
                    setIsLoading(false);
                }
            }["IndiaMapLeaflet.useEffect"]);
            return ({
                "IndiaMapLeaflet.useEffect": ()=>{
                    if (leafletMap.current) {
                        leafletMap.current.remove();
                        leafletMap.current = null;
                    }
                }
            })["IndiaMapLeaflet.useEffect"];
        }
    }["IndiaMapLeaflet.useEffect"], []);
    // Update styles when selection changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndiaMapLeaflet.useEffect": ()=>{
            if (geoJsonLayer.current) {
                geoJsonLayer.current.eachLayer({
                    "IndiaMapLeaflet.useEffect": (layer)=>{
                        const geoLayer = layer;
                        const feature = geoLayer.feature;
                        if (!feature) return;
                        const stateName = feature?.properties?.NAME_1 || feature?.properties?.name || '';
                        const code = getStateCode(stateName);
                        const isSelected = code === selectedState;
                        layer.setStyle({
                            fillColor: isSelected ? '#00C853' : '#1a1a1a',
                            fillOpacity: isSelected ? 0.6 : 0.8,
                            color: isSelected ? '#00C853' : '#444',
                            weight: isSelected ? 3 : 1
                        });
                    }
                }["IndiaMapLeaflet.useEffect"]);
            }
        }
    }["IndiaMapLeaflet.useEffect"], [
        selectedState
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-6ffc505475c9938e" + " " + "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mapRef,
                style: {
                    cursor: 'pointer'
                },
                className: "jsx-6ffc505475c9938e" + " " + "w-full h-[400px] bg-[#0a1a2a]"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                lineNumber: 195,
                columnNumber: 13
            }, this),
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6ffc505475c9938e" + " " + "absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-6ffc505475c9938e" + " " + "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6ffc505475c9938e" + " " + "animate-spin w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full mx-auto mb-2"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                            lineNumber: 205,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-6ffc505475c9938e" + " " + "text-[#666] text-sm",
                            children: "Loading map..."
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                            lineNumber: 206,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                    lineNumber: 204,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                lineNumber: 203,
                columnNumber: 17
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6ffc505475c9938e" + " " + "absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "jsx-6ffc505475c9938e" + " " + "text-red-400 text-sm",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                    lineNumber: 214,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                lineNumber: 213,
                columnNumber: 17
            }, this),
            hoveredState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6ffc505475c9938e" + " " + "absolute top-4 left-4 bg-[#111] border border-[#00C853] rounded-lg px-3 py-2 text-sm z-[1000]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "jsx-6ffc505475c9938e" + " " + "text-white font-medium",
                    children: hoveredState
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                    lineNumber: 221,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                lineNumber: 220,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6ffc505475c9938e" + " " + "absolute bottom-4 right-4 text-xs text-[#666] bg-[#111]/80 px-2 py-1 rounded z-[1000]",
                children: "Scroll to zoom • Drag to pan"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
                lineNumber: 226,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "6ffc505475c9938e",
                children: ".india-state-tooltip{font-weight:500;box-shadow:0 4px 12px #00000080;color:#fff!important;background:#111!important;border:1px solid #00c853!important;border-radius:4px!important;padding:4px 8px!important}.india-state-tooltip:before{display:none!important}.leaflet-control-zoom{border:none!important}.leaflet-control-zoom a{color:#00c853!important;background:#111!important;border:1px solid #333!important}.leaflet-control-zoom a:hover{background:#222!important}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx",
        lineNumber: 194,
        columnNumber: 9
    }, this);
}
_s(IndiaMapLeaflet, "AaZJ8bGMB1OykdJp9tH4oZx88/M=");
_c = IndiaMapLeaflet;
var _c;
__turbopack_context__.k.register(_c, "IndiaMapLeaflet");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/IndiaMapLeaflet.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=Documents_GitHub_Advitiya_H_src_components_IndiaMapLeaflet_tsx_e23dec07._.js.map