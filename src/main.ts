import { Events, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, LocalGraphSyncSettings, LocalGraphSyncSettingTab } from './settings';
import { applyToLocalGraphs, readGlobalGraphSettings } from './sync';

export default class LocalGraphSyncPlugin extends Plugin {
	settings: LocalGraphSyncSettings;

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
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<LocalGraphSyncSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.syncAll();
	}

	private async syncAll() {
		const graphSettings = await readGlobalGraphSettings(this.app);
		if (!graphSettings) return;
		applyToLocalGraphs(this.app, graphSettings, this.settings);
	}
}
