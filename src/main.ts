import { Events, Plugin } from 'obsidian';
import { applyToLocalGraphs, readGlobalGraphSettings } from './sync';

export default class LocalGraphSyncPlugin extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
				this.syncAll();
			})
		);

		// 'config-changed' is an unofficial event not typed in obsidian.d.ts
		this.registerEvent(
			(this.app.vault as unknown as Events).on('config-changed', () => {
				this.syncAll();
			})
		);
	}

	onunload() {}

	private async syncAll() {
		const settings = await readGlobalGraphSettings(this.app);
		if (!settings) return;
		await applyToLocalGraphs(this.app, settings);
	}
}
