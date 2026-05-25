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

		new Setting(containerEl)
			.setName('フィルター')
			.setDesc('search・showTags・showAttachments・hideUnresolved・showOrphans')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.syncFilters)
					.onChange(async value => {
						this.plugin.settings.syncFilters = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('カラーグループ')
			.setDesc('colorGroups')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.syncColorGroups)
					.onChange(async value => {
						this.plugin.settings.syncColorGroups = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('表示')
			.setDesc('showArrow・textFadeMultiplier・nodeSizeMultiplier・lineSizeMultiplier')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.syncDisplay)
					.onChange(async value => {
						this.plugin.settings.syncDisplay = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('物理演算')
			.setDesc('centerStrength・repelStrength・linkStrength・linkDistance')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.syncForces)
					.onChange(async value => {
						this.plugin.settings.syncForces = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
