import { App, WorkspaceLeaf } from 'obsidian';
import { GraphSettings } from './types';

export async function readGlobalGraphSettings(app: App): Promise<GraphSettings | null> {
	try {
		// readConfigJson is unofficial and not typed in obsidian.d.ts
		const readConfig = (app.vault as unknown as Record<string, unknown>)['readConfigJson'] as
			| ((name: string) => Promise<unknown>)
			| undefined;
		if (!readConfig) throw new Error('readConfigJson not available');
		return (await readConfig.call(app.vault, 'graph')) as GraphSettings;
	} catch (e) {
		console.error('[LocalGraphSync] Failed to read graph.json:', e);
		return null;
	}
}

export async function applyToLocalGraphs(app: App, settings: GraphSettings): Promise<void> {
	const leaves = app.workspace.getLeavesOfType('localgraph');
	for (const leaf of leaves) {
		await applyToLeaf(leaf, settings);
	}
}

async function applyToLeaf(leaf: WorkspaceLeaf, settings: GraphSettings): Promise<void> {
	// Apply physical/display params via official setViewState
	const current = leaf.getViewState();
	const state = current.state ?? {};

	await leaf.setViewState({
		...current,
		state: {
			...state,
			linksStrength: settings.linksStrength,
			repelStrength: settings.repelStrength,
			centerStrength: settings.centerStrength,
			linkDistance: settings.linkDistance,
			nodeSize: settings.nodeSize,
			linkThickness: settings.linkThickness,
			textFadeThreshold: settings.textFadeThreshold,
			nodeSizeMode: settings.nodeSizeMode,
			showTags: settings.showTags,
			showAttachments: settings.showAttachments,
			hideUnresolved: settings.hideUnresolved,
			showOrphans: settings.showOrphans,
		},
	});

	// Apply unofficial API params (search / colorGroups)
	try {
		const view = leaf.view as unknown as Record<string, unknown>;
		if (typeof view['setOptions'] === 'function') {
			(view['setOptions'] as (o: unknown) => void)({
				search: settings.search,
				colorGroups: settings.colorGroups,
			});
		}
	} catch (e) {
		console.warn('[LocalGraphSync] Unofficial API failed, skipping search/colorGroups:', e);
	}
}
