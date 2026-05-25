import { App, PluginSettingTab, Setting } from 'obsidian';
import type LocalGraphSyncPlugin from './main';

export interface LocalGraphSyncSettings {
	syncFilters: boolean;
	syncColorGroups: boolean;
	syncDisplay: boolean;
	syncForces: boolean;
}

export const DEFAULT_SETTINGS: LocalGraphSyncSettings = {
	syncFilters: true,
	syncColorGroups: true,
	syncDisplay: true,
	syncForces: true,
};

export class LocalGraphSyncSettingTab extends PluginSettingTab {
	plugin: LocalGraphSyncPlugin;

	constructor(app: App, plugin: LocalGraphSyncPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const groups: Array<{ name: string; desc: string; key: keyof LocalGraphSyncSettings }> = [
			{ name: 'フィルター', desc: 'search・showTags・showAttachments・hideUnresolved・showOrphans', key: 'syncFilters' },
			{ name: 'カラーグループ', desc: 'colorGroups', key: 'syncColorGroups' },
			{ name: '表示', desc: 'showArrow・textFadeMultiplier・nodeSizeMultiplier・lineSizeMultiplier', key: 'syncDisplay' },
			{ name: '物理演算', desc: 'centerStrength・repelStrength・linkStrength・linkDistance', key: 'syncForces' },
		];

		for (const { name, desc, key } of groups) {
			new Setting(containerEl)
				.setName(name)
				.setDesc(desc)
				.addToggle(toggle =>
					toggle
						.setValue(this.plugin.settings[key])
						.onChange(async value => {
							this.plugin.settings[key] = value;
							await this.plugin.saveSettings();
						})
				);
		}
	}
}
