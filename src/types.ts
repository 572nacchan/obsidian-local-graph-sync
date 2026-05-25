export interface GraphSettings {
	// Filter (graph.json keys)
	search: string;
	showTags: boolean;
	showAttachments: boolean;
	hideUnresolved: boolean;
	showOrphans: boolean;
	// Color groups
	colorGroups: ColorGroup[];
	// Display
	showArrow: boolean;
	textFadeMultiplier: number;
	nodeSizeMultiplier: number;
	lineSizeMultiplier: number;
	// Forces
	centerStrength: number;
	repelStrength: number;
	linkStrength: number;
	linkDistance: number;
}

export interface ColorGroup {
	query: string;
	color: { a: 1; rgb: number };
}

// Keys synced from global to local (excludes localJumps/localFile/local*links/scale/close)
export const SYNC_KEYS: ReadonlyArray<keyof GraphSettings> = [
	'search',
	'showTags',
	'showAttachments',
	'hideUnresolved',
	'showOrphans',
	'colorGroups',
	'showArrow',
	'textFadeMultiplier',
	'nodeSizeMultiplier',
	'lineSizeMultiplier',
	'centerStrength',
	'repelStrength',
	'linkStrength',
	'linkDistance',
];
