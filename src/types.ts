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
	color: { a: number; rgb: number };
}

export const SYNC_KEY_GROUPS = {
	filters: ['search', 'showTags', 'showAttachments', 'hideUnresolved', 'showOrphans'],
	colorGroups: ['colorGroups'],
	display: ['showArrow', 'textFadeMultiplier', 'nodeSizeMultiplier', 'lineSizeMultiplier'],
	forces: ['centerStrength', 'repelStrength', 'linkStrength', 'linkDistance'],
} as const satisfies Record<string, ReadonlyArray<keyof GraphSettings>>;
