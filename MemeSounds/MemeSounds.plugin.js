/**
 * @name MemeSoundsV2
 * @version 0.1.2
 * @description Plays Memetastic sounds depending on what is being sent in chat. This Plugin is remake of Lonk's MemeSounds plugin so go check him out!
 * @author 🎀 Hamza#7777
 * @authorId 665294422749085696
 * @authorLink https://github.com/hamzadevcat/
 * @source https://github.com/hamzadevcat/MemeSoundsV2/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/hamzadevcat/MemeSoundsV2/main/MemeSounds/MemeSounds.plugin.js
 */

 module.exports = (() => {
	
	/* Configuration */
	const config = {
		info: {
			name: "Meme Sounds V2", 
			authors: [{
		name: "🎀 Hamza#7777", 
		discord_id: "665294422749085696", 
		github_username: "hamzadevcat", 
		twitter_username: "hamzadevcat"}],
		 version: "0.1.2",
		 description: "Plays Memetastic sounds depending on what is being sent in chat. This Plugin is remake of Lonk's MemeSounds plugin so go check him out!",
		  github: "https://github.com/hamzadevcat/MemeSoundsV2/blob/main/MemeSounds/MemeSounds.plugin.js",
		  github_raw: "https://raw.githubusercontent.com/hamzadevcat/MemeSoundsV2/main/MemeSounds/MemeSounds.plugin.js"}, 
		  defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, 
		  settings: [{
			  id: "LimitChan", 
			  name: "Limit to the current channel only.", 
			  note: "When enabled, sound effects will only play within the currently selected channel.", 
			  type: "switch", value: true}, 
			  {
				  id: "delay", 
				  name: "Sound effect delay.", 
				  note: "The delay in miliseconds between each sound effect.", 
				  type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, 
				  {
					  id: "volume", 
					  name: "Sound effect volume.", 
					  note: "How loud the sound effects will be.", 
					  type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], 
					  changelog: [{
						  title: "New Stuff", 
						  items: ["meow"]
						}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /no?ice/gmi, file: "noice.mp3", duration: 600},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof.mp3", duration: 250},
				{re: /bruh/gmi, file: "bruh.mp3", duration: 470},
				{re: /amogus/gmi, file: "amogus.mp3", duration: 7000},
				{re: /owo/gmi, file: "owo.mp3", duration: 2000},
				{re: /shit/gmi, file: "fart.mp3", duration: 2000},
				{re: /ok/gmi, file: "ok.mp3", duration: 1000},
				{re: /lets go/gmi, file: "letsgo.mp3", duration: 1500},
			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/hamzadevcat/MemeSoundsV2/raw/main/MemeSounds/Sounds/"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
