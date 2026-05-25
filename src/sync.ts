import { App, WorkspaceLeaf } from 'obsidian';
import { GraphSettings, SYNC_KEYS } from './types';

type GraphEngine = {
	getOptions(): Record<string, unknown>;
	setOptions(options: Record<string, unknown>): void;
};

export async function readGlobalGraphSettings(app: App): Promise<Partial<GraphSettings> | null> {
	try {
		// readConfigJson is unofficial and not typed in obsidian.d.ts
		const readConfig = (app.vault as unknown as Record<string, unknown>)['readConfigJson'] as
			| ((name: string) => Promise<unknown>)
			| undefined;
		if (!readConfig) throw new Error('readConfigJson not available');
		return (await readConfig.call(app.vault, 'graph')) as Partial<GraphSettings>;
	} catch (e) {
		console.error('[LocalGraphSync] Failed to read graph.json:', e);
		return null;
	}
}

export function applyToLocalGraphs(app: App, settings: Partial<GraphSettings>): void {
	const leaves = app.workspace.getLeavesOfType('localgraph');
	for (const leaf of leaves) {
		applyToLeaf(leaf, settings);
	}
}

function applyToLeaf(leaf: WorkspaceLeaf, settings: Partial<GraphSettings>): void {
	try {
		const engine = (leaf.view as unknown as { engine: GraphEngine }).engine;
		const current = engine.getOptions();

		// Merge only SYNC_KEYS, preserving local-graph-specific settings
		// (localJumps, localFile, localBacklinks, localForelinks, localInterlinks)
		const merged: Record<string, unknown> = { ...current };
		for (const key of SYNC_KEYS) {
			if (settings[key] !== undefined) {
				merged[key] = settings[key];
			}
		}

		engine.setOptions(merged);
	} catch (e) {
		console.warn('[LocalGraphSync] Failed to apply to leaf:', e);
	}
}
