import { App, WorkspaceLeaf } from 'obsidian';
import { LocalGraphSyncSettings } from './settings';
import { GraphSettings, SYNC_KEY_GROUPS } from './types';

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
		const raw = await readConfig.call(app.vault, 'graph');
		if (raw === null || typeof raw !== 'object') {
			console.warn('[LocalGraphSync] graph.json returned unexpected value:', raw);
			return null;
		}
		return raw as Partial<GraphSettings>;
	} catch (e) {
		console.error('[LocalGraphSync] Failed to read graph.json:', e);
		return null;
	}
}

export function applyToLocalGraphs(
	app: App,
	settings: Partial<GraphSettings>,
	syncSettings: LocalGraphSyncSettings
): void {
	const keys = buildSyncKeys(syncSettings);
	if (keys.length === 0) return;

	const leaves = app.workspace.getLeavesOfType('localgraph');
	for (const leaf of leaves) {
		applyToLeaf(leaf, settings, keys);
	}
}

function buildSyncKeys(syncSettings: LocalGraphSyncSettings): ReadonlyArray<keyof GraphSettings> {
	return [
		...(syncSettings.syncFilters ? SYNC_KEY_GROUPS.filters : []),
		...(syncSettings.syncColorGroups ? SYNC_KEY_GROUPS.colorGroups : []),
		...(syncSettings.syncDisplay ? SYNC_KEY_GROUPS.display : []),
		...(syncSettings.syncForces ? SYNC_KEY_GROUPS.forces : []),
	];
}

function applyToLeaf(
	leaf: WorkspaceLeaf,
	settings: Partial<GraphSettings>,
	keys: ReadonlyArray<keyof GraphSettings>
): void {
	try {
		const engine = (leaf.view as unknown as { engine?: GraphEngine }).engine;
		if (!engine) {
			console.warn('[LocalGraphSync] engine not found on leaf:', leaf);
			return;
		}
		const current = engine.getOptions();

		// Merge only selected keys, preserving local-graph-specific settings
		// (localJumps, localFile, localBacklinks, localForelinks, localInterlinks)
		const merged: Record<string, unknown> = { ...current };
		for (const key of keys) {
			if (settings[key] !== undefined) {
				merged[key] = settings[key];
			}
		}

		engine.setOptions(merged);
	} catch (e) {
		console.warn('[LocalGraphSync] Failed to apply to leaf:', e);
	}
}
