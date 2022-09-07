/**
 * Takes a config object and a default config object and returns a final config with all config modifications applied.
 * Ensures no unwanted properties are passed in config.
 * @param {object} defaults - The default config object with all allowed properties
 * @param {object} conf - The config object to apply
 * @return {object}
 */
function applyConfig(defaults, conf) {
	let c = {};
	
	for (const prop in defaults) {
		if (conf[prop] && typeof conf[prop] !== typeof defaults[prop]) {
			console.warn(`Config option ${prop} has the wrong type of value. Skipping`);
			continue;
		}
		if (typeof defaults[prop] === "object" && !(defaults[prop] instanceof Array) && conf[prop]) {
			c[prop] = applyConfig(defaults[prop], conf[prop]);
		} else {
			c[prop] = conf[prop] ?? defaults[prop];
		}
	}
	return c;
}

export {applyConfig}
