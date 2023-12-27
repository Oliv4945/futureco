const style = (key) => ({
	version: 8,
	id: 'basic-v2',
	name: 'Basic',
	sources: {
		maptiler_planet: {
			url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=' + key,
			type: 'vector',
		},
		maptiler_attribution: {
			attribution:
				'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
			type: 'vector',
		},
		'raster-tiles': {
			type: 'raster',
			tiles: ['https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png'],
			tileSize: 256,
			attribution:
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>',
		},
	},
	layers: [
		{
			id: 'Background',
			type: 'background',
			layout: { visibility: 'visible' },
			paint: {
				'background-color': {
					stops: [
						[6, 'hsl(60,20%,85%)'],
						[20, 'hsl(60,24%,90%)'],
					],
				},
			},
		},
		{
			id: 'Residential',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'landuse',
			maxzoom: 14,
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': {
					stops: [
						[2, 'hsl(60,23%,81%)'],
						[14, 'hsl(60,21%,85%)'],
					],
				},
			},
			filter: ['in', 'class', 'neighbourhood', 'residential', 'suburb'],
		},
		{
			id: 'Glacier',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'globallandcover',
			maxzoom: 8,
			layout: { visibility: 'visible' },
			paint: { 'fill-color': 'hsla(0, 0%, 100%, 0.7)' },
			filter: ['all', ['in', 'class', 'snow']],
		},
		{
			id: 'Forest',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'globallandcover',
			maxzoom: 8,
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': {
					stops: [
						[1, 'hsla(91,40%,70%,0.25)'],
						[7, 'hsla(91,40%,70%,0.6)'],
					],
				},
			},
			filter: ['in', 'class', 'forest', 'tree'],
		},
		{
			id: 'Sand',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'landcover',
			minzoom: 8,
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': 'hsla(54,81%,53%,0.3)',
				'fill-opacity': {
					stops: [
						[7, 0.7],
						[12, 1],
					],
				},
				'fill-antialias': false,
			},
			filter: ['==', 'class', 'sand'],
		},
		{
			id: 'Grass',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'landcover',
			minzoom: 8,
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': 'hsla(89,40%,78%,0.8)',
				'fill-opacity': {
					stops: [
						[7, 0.7],
						[12, 1],
					],
				},
				'fill-antialias': false,
			},
			filter: ['==', 'class', 'grass'],
		},
		{
			id: 'Wood',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'landcover',
			minzoom: 8,
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': 'hsla(91,40%,70%,0.8)',
				'fill-opacity': {
					stops: [
						[7, 0.7],
						[12, 1],
					],
				},
				'fill-antialias': false,
			},
			filter: ['==', 'class', 'wood'],
		},
		{
			id: 'Water',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'water',
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': 'hsl(205,56%,73%)',
				'fill-opacity': ['match', ['get', 'intermittent'], 1, 0.7, 1],
			},
			filter: ['all', ['!=', 'brunnel', 'tunnel']],
		},
		{
			id: 'River',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'waterway',
			layout: { visibility: 'visible' },
			paint: {
				'line-color': 'hsl(205,56%,73%)',
				'line-width': {
					stops: [
						[9, 1],
						[18, 3],
					],
				},
				'line-opacity': ['match', ['get', 'brunnel'], 'tunnel', 0.7, 1],
			},
			filter: ['all', ['!=', 'intermittent', 1]],
		},
		{
			id: 'River intermittent',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'waterway',
			layout: { visibility: 'visible' },
			paint: {
				'line-color': 'hsl(205,56%,73%)',
				'line-width': {
					stops: [
						[9, 1],
						[18, 3],
					],
				},
				'line-opacity': 1,
				'line-dasharray': [2, 1],
			},
			filter: ['==', 'intermittent', 1],
		},
		{
			id: 'Transit tunnel',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'transportation',
			minzoom: 4,
			layout: {
				'line-cap': 'butt',
				'line-join': 'miter',
				visibility: 'visible',
			},
			paint: {
				'line-color': 'hsl(34, 12%, 66%)',
				'line-width': {
					stops: [
						[14, 0.5],
						[16, 1.2],
						[18, 2],
					],
				},
				'line-opacity': 0.5,
				'line-dasharray': [3, 3],
			},
			filter: ['all', ['==', 'brunnel', 'tunnel'], ['==', 'class', 'transit']],
		},
		{
			id: 'Bridge',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'transportation',
			layout: { visibility: 'visible' },
			paint: { 'fill-color': 'hsl(47, 26%, 88%)', 'fill-opacity': 0.7 },
			filter: ['all', ['==', '$type', 'Polygon'], ['==', 'brunnel', 'bridge']],
		},
		{
			id: 'Pier',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'transportation',
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': 'hsl(60,24%,88%)',
				'fill-opacity': 1,
				'fill-antialias': true,
			},
			metadata: {},
			filter: ['==', 'class', 'pier'],
		},
		{
			id: 'Road network',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'transportation',
			minzoom: 4,
			layout: {
				'line-cap': 'round',
				'line-join': 'round',
				visibility: 'visible',
			},
			paint: {
				'line-color': 'hsl(0, 0%, 100%)',
				'line-width': [
					'interpolate',
					['linear', 2],
					['zoom'],
					4,
					0.5,
					5,
					0.75,
					6,
					1,
					10,
					[
						'match',
						['get', 'class'],
						['motorway'],
						['match', ['get', 'brunnel'], ['bridge'], 0, 2.5],
						['trunk'],
						1.5,
						1,
					],
					12,
					[
						'match',
						['get', 'class'],
						['motorway'],
						['match', ['get', 'ramp'], 1, 1, 4],
						['trunk'],
						2,
						['primary'],
						2.5,
						['secondary', 'tertiary'],
						2,
						['minor'],
						1,
						['pier', 'service', 'track'],
						0.5,
						0.5,
					],
					14,
					[
						'match',
						['get', 'class'],
						['motorway'],
						['match', ['get', 'ramp'], 1, 5, 6],
						['trunk'],
						3,
						['primary'],
						5,
						['secondary'],
						4,
						['tertiary'],
						3,
						['minor'],
						2,
						['pier', 'service', 'track'],
						1,
						2,
					],
					16,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						8,
						['secondary'],
						7,
						['tertiary'],
						6,
						['minor'],
						4,
						['pier', 'service', 'track'],
						2,
						4,
					],
					20,
					[
						'match',
						['get', 'class'],
						['motorway', 'trunk', 'primary'],
						28,
						['secondary'],
						24,
						['tertiary'],
						20,
						['minor', 'service', 'track', 'pier'],
						16,
						16,
					],
				],
				'line-offset': 0,
				'line-opacity': ['match', ['get', 'brunnel'], 'tunnel', 0.5, 1],
			},
			filter: [
				'any',
				['!has', 'class'],
				[
					'in',
					'class',
					'aerialway',
					'bus_guideway',
					'busway',
					'courtyard',
					'minor',
					'minor_construction',
					'motorway',
					'motorway_construction',
					'path_construction',
					'pier',
					'primary',
					'primary_construction',
					'raceway',
					'raceway_construction',
					'secondary',
					'secondary_construction',
					'service',
					'service_construction',
					'storage_tank',
					'tertiary',
					'tertiary_construction',
					'track',
					'track_construction',
					'trunk',
					'trunk_construction',
				],
			],
		},
		{
			id: 'Path',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'transportation',
			minzoom: 15,
			layout: {
				'line-cap': 'square',
				'line-join': 'bevel',
				visibility: 'visible',
			},
			paint: {
				'line-color': 'hsl(0, 0%, 100%)',
				'line-width': {
					base: 1.55,
					stops: [
						[15, 0.5],
						[16, 1],
						[18, 2],
						[20, 3],
						[22, 4],
					],
				},
				'line-dasharray': [1, 1],
			},
			filter: ['==', 'class', 'path'],
		},
		{
			id: 'Building',
			type: 'fill',
			source: 'maptiler_planet',
			'source-layer': 'building',
			layout: { visibility: 'visible' },
			paint: {
				'fill-color': {
					stops: [
						[13, 'hsl(48,25%,73%)'],
						[16, 'hsl(47,32%,77%)'],
					],
				},
				'fill-opacity': 1,
				'fill-antialias': true,
			},
		},
		{
			id: 'Railway',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'transportation',
			minzoom: 9,
			layout: { visibility: 'visible' },
			paint: {
				'line-color': 'hsla(33,12%,67%,0.8)',
				'line-width': [
					'interpolate',
					['linear', 1],
					['zoom'],
					9,
					['match', ['get', 'service'], ['yard', 'spur'], 0, 0.5],
					12,
					['match', ['get', 'service'], ['yard', 'spur'], 0, 0.6],
					16,
					['match', ['get', 'service'], ['yard', 'spur'], 0.75, 2],
					22,
					['match', ['get', 'service'], ['yard', 'spur'], 1.5, 3],
				],
				'line-opacity': ['match', ['get', 'brunnel'], 'tunnel', 0.25, 1],
			},
			filter: ['==', 'class', 'rail'],
		},
		{
			id: 'Transit',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'transportation',
			layout: { visibility: 'visible' },
			paint: {
				'line-color': 'hsl(34, 12%, 66%)',
				'line-width': {
					stops: [
						[14, 0.5],
						[16, 1.2],
						[18, 2],
					],
				},
				'line-opacity': 0.5,
			},
			filter: [
				'all',
				['==', 'class', 'transit'],
				['any', ['!has', 'brunnel'], ['in', 'brunnel', 'bridge', 'ford']],
			],
		},
		{
			id: 'Aeroway',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'aeroway',
			minzoom: 10,
			layout: {
				'line-cap': 'round',
				'line-join': 'round',
				visibility: 'visible',
			},
			paint: {
				'line-color': 'hsl(0, 0%, 100%)',
				'line-width': [
					'interpolate',
					['linear', 2],
					['zoom'],
					10,
					['match', ['get', 'class'], ['runway'], 1, ['taxiway'], 0.5, 0],
					14,
					['match', ['get', 'class'], ['runway'], 3, ['taxiway'], 2, 0],
					16,
					['match', ['get', 'class'], ['runway'], 10, ['taxiway'], 6, 0],
				],
				'line-opacity': 1,
			},
			metadata: { 'mapbox:group': '1444849345966.4436' },
		},
		{
			id: 'Airport labels',
			type: 'symbol',
			source: 'maptiler_planet',
			'source-layer': 'aerodrome_label',
			minzoom: 10,
			layout: {
				'text-font': ['Noto Sans Regular'],
				'text-size': {
					stops: [
						[10, 10],
						[14, 12],
						[16, 14],
					],
				},
				'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
				visibility: 'visible',
				'text-anchor': 'top',
				'text-offset': [0, 0.5],
				'text-max-width': 8,
			},
			paint: {
				'text-color': 'hsl(0,0%,12%)',
				'text-halo-blur': 1,
				'text-halo-color': 'hsl(0, 0%, 100%)',
				'text-halo-width': 1.4,
			},
			filter: ['has', 'iata'],
		},
		{
			id: 'Station labels',
			type: 'symbol',
			source: 'maptiler_planet',
			'source-layer': 'poi',
			minzoom: 12,
			layout: {
				'text-font': ['Noto Sans Regular'],
				'text-size': {
					stops: [
						[10, 10],
						[14, 12],
						[16, 14],
					],
				},
				'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
				visibility: 'visible',
				'text-anchor': 'top',
				'text-offset': [0, 0.5],
				'text-max-width': 8,
			},
			paint: {
				'text-color': 'hsl(0,0%,12%)',
				'text-halo-blur': 1,
				'text-halo-color': 'hsl(0, 0%, 100%)',
				'text-halo-width': 1.4,
			},
			filter: [
				'all',
				['==', 'class', 'railway'],
				[
					'any',
					['!has', 'subclass'],
					[
						'any',
						['in', 'subclass', 'station'],
						['!in', 'subclass', 'station'],
					],
				],
			],
		},
		{
			id: 'Road labels',
			type: 'symbol',
			source: 'maptiler_planet',
			'source-layer': 'transportation_name',
			minzoom: 14,
			layout: {
				'text-font': ['Noto Sans Regular'],
				'text-size': {
					base: 1.4,
					stops: [
						[14, 8],
						[17, 10],
						[20, 12],
					],
				},
				'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
				visibility: 'visible',
				'symbol-spacing': {
					stops: [
						[13, 250],
						[20, 350],
						[22, 600],
					],
				},
				'text-transform': 'uppercase',
				'symbol-placement': 'line',
				'text-letter-spacing': 0.1,
				'text-rotation-alignment': 'map',
			},
			paint: {
				'text-color': 'hsl(0,0%,5%)',
				'text-halo-color': 'hsl(0, 100%, 100%)',
				'text-halo-width': 1,
			},
			filter: [
				'all',
				[
					'any',
					['!has', 'subclass'],
					[
						'in',
						'subclass',
						'bridge',
						'bridleway',
						'busway',
						'cable_car',
						'chair_lift',
						'construction',
						'corridor',
						'cycleway',
						'drag_lift',
						'footway',
						'gondola',
						'highway',
						'industrial',
						'j-bar',
						'junction',
						'living_street',
						'minor',
						'mixed_lift',
						'motorway',
						'motorway_link',
						'motoway',
						'no',
						'path',
						'pedestrian',
						'platform',
						'platter',
						'primary',
						'primary_link',
						'proposed',
						'rail',
						'residential',
						'rest_area',
						'road',
						'secondary',
						'secondary_link',
						'service',
						'services',
						'steps',
						't-bar',
						'tertiary',
						'tertiary_link',
						'track',
						'trunk',
						'trunk_link',
						'unclassified',
						'widening',
						'yes',
					],
				],
				[
					'any',
					['!has', 'class'],
					[
						'in',
						'class',
						'bus_guideway',
						'busway',
						'ferry',
						'minor',
						'minor_construction',
						'motorway',
						'motorway_construction',
						'motorway_junction',
						'path_construction',
						'primary',
						'primary_construction',
						'raceway',
						'raceway_construction',
						'secondary',
						'secondary_construction',
						'service_construction',
						'tertiary',
						'tertiary_construction',
						'track',
						'track_construction',
						'trunk',
						'trunk_construction',
					],
				],
			],
		},
		{
			id: 'Other border',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'boundary',
			minzoom: 3,
			maxzoom: 22,
			layout: { visibility: 'visible' },
			paint: {
				'line-color': 'hsla(0,0%,60%,0.65)',
				'line-width': {
					stops: [
						[4, 0.8],
						[11, 1.75],
						[18, 2.5],
					],
				},
				'line-dasharray': [2, 1],
			},
			filter: [
				'all',
				['in', 'admin_level', 3, 4, 5, 6, 7, 8, 9, 10],
				['==', 'maritime', 0],
			],
		},
		{
			id: 'Disputed border',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'boundary',
			minzoom: 0,
			layout: {
				'line-cap': 'round',
				'line-join': 'round',
				visibility: 'visible',
			},
			paint: {
				'line-color': 'hsl(0,0%,64%)',
				'line-width': {
					stops: [
						[1, 1],
						[5, 1.5],
						[10, 2],
					],
				},
				'line-dasharray': [2, 2],
			},
			filter: [
				'all',
				['==', 'admin_level', 2],
				['==', 'maritime', 0],
				['==', 'disputed', 1],
			],
		},
		{
			id: 'Country border',
			type: 'line',
			source: 'maptiler_planet',
			'source-layer': 'boundary',
			minzoom: 0,
			layout: {
				'line-cap': 'round',
				'line-join': 'round',
				visibility: 'visible',
			},
			paint: {
				'line-blur': {
					stops: [
						[4, 0.5],
						[10, 0],
					],
				},
				'line-color': 'hsl(0,0%,64%)',
				'line-width': {
					stops: [
						[1, 1],
						[5, 1.5],
						[10, 2],
					],
				},
			},
			filter: [
				'all',
				['==', 'admin_level', 2],
				['==', 'disputed', 0],
				['==', 'maritime', 0],
			],
		},
		{
			id: 'simple-tiles',
			type: 'raster',
			source: 'raster-tiles',
			minzoom: 0,
			maxzoom: 22,
		},
		{
			id: 'Place labels',
			type: 'symbol',
			source: 'maptiler_planet',
			'source-layer': 'place',
			minzoom: 0,
			maxzoom: 16,
			layout: {
				'text-font': ['Noto Sans Regular'],
				'text-size': [
					'interpolate',
					['linear', 1],
					['zoom'],
					3,
					11,
					8,
					['match', ['get', 'class'], 'city', 15, 13],
					11,
					[
						'match',
						['get', 'class'],
						'city',
						16,
						[
							'suburb',
							'neighbourhood',
							'quarter',
							'hamlet',
							'isolated_dwelling',
						],
						10,
						13,
					],
					16,
					[
						'match',
						['get', 'class'],
						'city',
						21,
						[
							'suburb',
							'neighbourhood',
							'quarter',
							'hamlet',
							'isolated_dwelling',
						],
						14,
						16,
					],
				],
				'text-field': '{name}',
				visibility: 'visible',
				'text-max-width': 10,
			},
			paint: {
				'text-color': 'hsl(0, 0%, 0%)',
				'text-halo-blur': 0,
				'text-halo-color': 'hsla(0, 0%, 100%, 0.75)',
				'text-halo-width': 2,
			},
			filter: [
				'any',
				['!has', 'class'],
				[
					'in',
					'class',
					'hamlet',
					'isolated_dwelling',
					'neighbourhood',
					'province',
					'quarter',
					'suburb',
					'town',
					'village',
				],
			],
		},
		{
			id: 'City labels',
			type: 'symbol',
			source: 'maptiler_planet',
			'source-layer': 'place',
			maxzoom: 16,
			layout: {
				'text-font': ['Noto Sans Regular'],
				'text-size': [
					'interpolate',
					['linear', 1],
					['zoom'],
					3,
					11,
					8,
					15,
					11,
					16,
					16,
					21,
				],
				'text-field': '{name:en}',
				visibility: 'visible',
				'text-max-width': 10,
			},
			paint: {
				'text-color': 'hsl(0, 0%, 0%)',
				'text-halo-blur': 0,
				'text-halo-color': 'hsla(0, 0%, 100%, 0.75)',
				'text-halo-width': 2,
			},
			filter: ['==', 'class', 'city'],
		},
		{
			id: 'Country labels',
			type: 'symbol',
			source: 'maptiler_planet',
			'source-layer': 'place',
			minzoom: 1,
			maxzoom: 12,
			layout: {
				'text-font': ['Noto Sans Bold'],
				'text-size': [
					'interpolate',
					['linear', 1],
					['zoom'],
					0,
					8,
					1,
					10,
					4,
					['case', ['>', ['get', 'rank'], 2], 13, 15],
					8,
					['case', ['>', ['get', 'rank'], 2], 18, 22],
				],
				'text-field': '{name:en}',
				visibility: 'visible',
				'text-padding': {
					stops: [
						[1, 0],
						[4, 2],
					],
				},
				'text-max-width': 8,
			},
			paint: {
				'text-color': 'hsl(0, 0%, 13%)',
				'text-halo-blur': 1,
				'text-halo-color': 'hsla(0, 0%, 100%, 0.75)',
				'text-halo-width': 2,
			},
			filter: ['==', 'class', 'country'],
		},
		{
			id: 'Continent labels',
			type: 'symbol',
			source: 'maptiler_planet',
			'source-layer': 'place',
			maxzoom: 1,
			layout: {
				'text-font': ['Noto Sans Bold'],
				'text-size': {
					stops: [
						[0, 12],
						[2, 13],
					],
				},
				'text-field': '{name}',
				visibility: 'visible',
				'text-justify': 'center',
				'text-transform': 'uppercase',
			},
			paint: {
				'text-color': 'hsl(0, 0%, 13%)',
				'text-halo-blur': 1,
				'text-halo-color': 'hsla(0, 0%, 100%, 0.75)',
				'text-halo-width': 2,
			},
			metadata: {},
			filter: ['==', 'class', 'continent'],
		},
	],
	glyphs: 'https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=' + key,
	bearing: 0,
	pitch: 0,
	center: [0, 0],
	zoom: 1,
})

export default style
