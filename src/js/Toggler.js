/** 
 * A simple animated visibility toggler.
 * @public
 * @param {HTMLElement} source The element which triggers the toggle, e.g. a `<button>`
 * @param {HTMLElement|null} [target = null] The element of which to toggle the visibility.
 * 						If omitted, the `data-toggle-target` attribute of the source will be checked for an ID.
 * 						If neither is provided, an error is thrown.
 * @param {string} [toggleText = ''] The replacement text for the source when its state is toggled.
 * 						If omitted, the `data-toggle-text` attribute of the source will be used.
 * 						If neither is provided, the source text remains static.
 */
class Toggler {
	
	constructor(source, target = null, toggleText = null) {
		this._source = source;
		try {
			this._target = ( target instanceof HTMLElement ? target : document.getElementById(source.dataset.toggleTarget) );
		} catch {
			throw new Error(`Invalid target set. The target element must be provided either directly or with a data attribute`);
		}
		this._target.classList.add('toggle-view');
		
		try {
			this._toggleText = ( toggleText ? toggleText : source.dataset.toggleText );
		} catch {
			console.log("No toggle text");
		}
		this._sourceTextTarget = ( this._source.querySelector(".toggle-text") ? this._source.querySelector(".toggle-text") : this._source );
		this._origText = this._sourceTextTarget.textContent;
		
		this._source.addEventListener("click", () => this.toggle() );
	}
	
	/**
	 * Toggle the state of the target.
	 * @public
	 */
	toggle() {
		if (this._target.classList.contains('visible')) {
			this.hide();
			return;
		}
		this.show();
	}
	
	/**
	 * Show the target.
	 * @public
	 */
	show() {
		const target = this._target;
		const height = this._checkHeight(target);
		
		if (this._toggleText) this._sourceTextTarget.textContent = this._toggleText;
		
		target.classList.add("visible");
		target.style.height = height;
		
		setTimeout( () => target.style.height = '', 250);
	}
	
	/**
	 * Hide the target.
	 * @public
	 */
	hide() {
		const target = this._target;
		
		if (this._toggleText) this._sourceTextTarget.textContent = this._origText;
		
		target.style.height = target.scrollHeight + "px";
		setTimeout( () => target.style.height = 0, 1);
		setTimeout( () => target.classList.remove("visible"), 250);
	}
	
	/**
	 * Check the auto height of an element.
	 * @protected
	 * @param {HTMLElement} el
	 */
	_checkHeight(el) {
		el.style.display = 'block';
		const h = el.scrollHeight + "px";
		el.style.display = '';
		return h;
	}
}

export default Toggler
