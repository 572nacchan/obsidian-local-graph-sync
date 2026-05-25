export interface GraphSettings {
	// Physical / display params (applied via setViewState)
	linksStrength: number;
	repelStrength: number;
	centerStrength: number;
	linkDistance: number;
	nodeSize: number;
	linkThickness: number;
	textFadeThreshold: number;
	nodeSizeMode: string;
	showTags: boolean;
	showAttachments: boolean;
	hideUnresolved: boolean;
	showOrphans: boolean;

	// Unofficial API params
	search: string;
	colorGroups: ColorGroup[];
}

export interface ColorGroup {
	query: string;
	color: { a: 1; rgb: number };
}
