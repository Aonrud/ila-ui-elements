/**
 * Takes a config object and a default config object and returns a final config with all config modifications applied.
 * Ensures no unwanted properties are passed in config.
 * @protected
 * @param {object} defaults - The default config object with all allowed properties
 * @param {object} conf - The config object to apply
 * @return {object}
 */
function applyConfig(defaults, conf) {
	let c = {};
	
	for (const prop in defaults) {
		
		if (typeof defaults[prop] === "object" && !(defaults[prop] instanceof Array) && conf[prop] && typeof conf[prop] !== "function") {
			c[prop] = applyConfig(defaults[prop], conf[prop]);
		} else {
			c[prop] = conf[prop] ?? defaults[prop];
		}
	}
	return c;
}

export {applyConfig}
