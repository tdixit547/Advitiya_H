(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorldMapLeaflet
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
// World GeoJSON source URL (Natural Earth countries)
const WORLD_GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
function WorldMapLeaflet({ selectedCountry, onCountrySelect }) {
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const leafletMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const geoJsonLayer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hoveredCountry, setHoveredCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldMapLeaflet.useEffect": ()=>{
            if (!mapRef.current || leafletMap.current) return;
            // Initialize map - world view
            const map = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(mapRef.current, {
                center: [
                    20,
                    0
                ],
                zoom: 2,
                minZoom: 1,
                maxZoom: 6,
                zoomControl: true,
                attributionControl: false,
                worldCopyJump: true
            });
            // Dark tile layer
            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap, © CARTO',
                noWrap: false
            }).addTo(map);
            leafletMap.current = map;
            // Load GeoJSON
            fetch(WORLD_GEOJSON_URL).then({
                "WorldMapLeaflet.useEffect": (res)=>res.json()
            }["WorldMapLeaflet.useEffect"]).then({
                "WorldMapLeaflet.useEffect": (data)=>{
                    const geoJson = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].geoJSON(data, {
                        style: {
                            "WorldMapLeaflet.useEffect.geoJson": (feature)=>{
                                const countryCode = feature?.properties?.ISO_A2 || '';
                                const isSelected = countryCode === selectedCountry;
                                return {
                                    fillColor: isSelected ? '#00C853' : '#1a1a1a',
                                    fillOpacity: isSelected ? 0.6 : 0.7,
                                    color: isSelected ? '#00C853' : '#333',
                                    weight: isSelected ? 2 : 0.5
                                };
                            }
                        }["WorldMapLeaflet.useEffect.geoJson"],
                        onEachFeature: {
                            "WorldMapLeaflet.useEffect.geoJson": (feature, layer)=>{
                                const countryName = feature?.properties?.ADMIN || feature?.properties?.name || 'Unknown';
                                const countryCode = feature?.properties?.ISO_A2 || '';
                                layer.on({
                                    mouseover: {
                                        "WorldMapLeaflet.useEffect.geoJson": (e)=>{
                                            const target = e.target;
                                            if (countryCode !== selectedCountry) {
                                                target.setStyle({
                                                    fillColor: '#00C853',
                                                    fillOpacity: 0.3,
                                                    color: '#00C853',
                                                    weight: 1.5
                                                });
                                            }
                                            setHoveredCountry(countryName);
                                            target.bringToFront();
                                        }
                                    }["WorldMapLeaflet.useEffect.geoJson"],
                                    mouseout: {
                                        "WorldMapLeaflet.useEffect.geoJson": (e)=>{
                                            if (geoJsonLayer.current) {
                                                geoJsonLayer.current.resetStyle(e.target);
                                            }
                                            setHoveredCountry(null);
                                        }
                                    }["WorldMapLeaflet.useEffect.geoJson"],
                                    click: {
                                        "WorldMapLeaflet.useEffect.geoJson": ()=>{
                                            if (countryCode && countryCode !== '-99') {
                                                onCountrySelect(countryCode);
                                            }
                                        }
                                    }["WorldMapLeaflet.useEffect.geoJson"]
                                });
                                // Bind tooltip
                                layer.bindTooltip(countryName, {
                                    permanent: false,
                                    direction: 'center',
                                    className: 'country-tooltip'
                                });
                            }
                        }["WorldMapLeaflet.useEffect.geoJson"]
                    }).addTo(map);
                    geoJsonLayer.current = geoJson;
                    setIsLoading(false);
                }
            }["WorldMapLeaflet.useEffect"]).catch({
                "WorldMapLeaflet.useEffect": (err)=>{
                    console.error('Failed to load World GeoJSON:', err);
                    setError('Failed to load map data');
                    setIsLoading(false);
                }
            }["WorldMapLeaflet.useEffect"]);
            return ({
                "WorldMapLeaflet.useEffect": ()=>{
                    if (leafletMap.current) {
                        leafletMap.current.remove();
                        leafletMap.current = null;
                    }
                }
            })["WorldMapLeaflet.useEffect"];
        }
    }["WorldMapLeaflet.useEffect"], []);
    // Update styles when selection changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldMapLeaflet.useEffect": ()=>{
            if (geoJsonLayer.current) {
                geoJsonLayer.current.eachLayer({
                    "WorldMapLeaflet.useEffect": (layer)=>{
                        const feature = layer.feature;
                        if (!feature) return;
                        const countryCode = feature?.properties?.ISO_A2 || '';
                        const isSelected = countryCode === selectedCountry;
                        layer.setStyle({
                            fillColor: isSelected ? '#00C853' : '#1a1a1a',
                            fillOpacity: isSelected ? 0.6 : 0.7,
                            color: isSelected ? '#00C853' : '#333',
                            weight: isSelected ? 2 : 0.5
                        });
                    }
                }["WorldMapLeaflet.useEffect"]);
            }
        }
    }["WorldMapLeaflet.useEffect"], [
        selectedCountry
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-399c88849d1acb33" + " " + "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mapRef,
                style: {
                    cursor: 'pointer'
                },
                className: "jsx-399c88849d1acb33" + " " + "w-full h-[400px] bg-[#0a1a2a]"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                lineNumber: 141,
                columnNumber: 13
            }, this),
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-399c88849d1acb33" + " " + "absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-399c88849d1acb33" + " " + "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-399c88849d1acb33" + " " + "animate-spin w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full mx-auto mb-2"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                            lineNumber: 151,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-399c88849d1acb33" + " " + "text-[#666] text-sm",
                            children: "Loading world map..."
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                            lineNumber: 152,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                    lineNumber: 150,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                lineNumber: 149,
                columnNumber: 17
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-399c88849d1acb33" + " " + "absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "jsx-399c88849d1acb33" + " " + "text-red-400 text-sm",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                    lineNumber: 160,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                lineNumber: 159,
                columnNumber: 17
            }, this),
            hoveredCountry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-399c88849d1acb33" + " " + "absolute top-4 left-4 bg-[#111] border border-[#00C853] rounded-lg px-3 py-2 text-sm z-[1000]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "jsx-399c88849d1acb33" + " " + "text-white font-medium",
                    children: hoveredCountry
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                    lineNumber: 167,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                lineNumber: 166,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-399c88849d1acb33" + " " + "absolute bottom-4 right-4 text-xs text-[#666] bg-[#111]/80 px-2 py-1 rounded z-[1000]",
                children: "Scroll to zoom • Drag to pan"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
                lineNumber: 172,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$Advitiya_H$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "399c88849d1acb33",
                children: ".country-tooltip{font-weight:500;box-shadow:0 4px 12px #00000080;color:#fff!important;background:#111!important;border:1px solid #00c853!important;border-radius:4px!important;padding:4px 8px!important}.country-tooltip:before{display:none!important}.leaflet-control-zoom{border:none!important}.leaflet-control-zoom a{color:#00c853!important;background:#111!important;border:1px solid #333!important}.leaflet-control-zoom a:hover{background:#222!important}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx",
        lineNumber: 140,
        columnNumber: 9
    }, this);
}
_s(WorldMapLeaflet, "rNSMQ3zGRxft0J+79h0aXOOEU/4=");
_c = WorldMapLeaflet;
var _c;
__turbopack_context__.k.register(_c, "WorldMapLeaflet");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Documents/GitHub/Advitiya_H/src/components/WorldMapLeaflet.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=Documents_GitHub_Advitiya_H_src_components_WorldMapLeaflet_tsx_76c82cb0._.js.map