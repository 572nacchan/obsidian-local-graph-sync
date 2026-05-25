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
		return (await readConfig.call(app.vault, 'graph')) as Partial<GraphSettings>;
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
	const keys: (keyof GraphSettings)[] = [];
	if (syncSettings.syncFilters) keys.push(...SYNC_KEY_GROUPS.filters);
	if (syncSettings.syncColorGroups) keys.push(...SYNC_KEY_GROUPS.colorGroups);
	if (syncSettings.syncDisplay) keys.push(...SYNC_KEY_GROUPS.display);
	if (syncSettings.syncForces) keys.push(...SYNC_KEY_GROUPS.forces);
	return keys;
}

function applyToLeaf(
	leaf: WorkspaceLeaf,
	settings: Partial<GraphSettings>,
	keys: ReadonlyArray<keyof GraphSettings>
): void {
	try {
		const engine = (leaf.view as unknown as { engine: GraphEngine }).engine;
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
