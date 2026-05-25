import { Events, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, LocalGraphSyncSettings, LocalGraphSyncSettingTab } from './settings';
import { applyToLocalGraphs, readGlobalGraphSettings } from './sync';

export default class LocalGraphSyncPlugin extends Plugin {
	settings: LocalGraphSyncSettings;
	private syncTimer: number | null = null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new LocalGraphSyncSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
				this.syncAll();
			})
		);

		// 'config-changed' is unofficial and not typed in obsidian.d.ts
		this.registerEvent(
			(this.app.vault as unknown as Events).on('config-changed', () => {
				this.syncAll();
			})
		);

		this.app.workspace.onLayoutReady(() => {
			this.syncAll();
		});
	}

	onunload() {
		if (this.syncTimer !== null) window.clearTimeout(this.syncTimer);
	}

	async loadSettings() {
		const saved = await this.loadData() as Partial<LocalGraphSyncSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, saved ?? {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.syncAll();
	}

	private syncAll(): void {
		if (this.syncTimer !== null) window.clearTimeout(this.syncTimer);
		this.syncTimer = window.setTimeout(() => {
			this.syncTimer = null;
			void readGlobalGraphSettings(this.app).then(graphSettings => {
				if (!graphSettings) return;
				applyToLocalGraphs(this.app, graphSettings, this.settings);
			});
		}, 50);
	}
}
