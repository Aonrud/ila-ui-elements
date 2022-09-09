import {applyConfig} from './utils/applyConfig.js';
import {makeButton} from './utils/makeButton.js';

/**
 * The configuration object for the Scroller.
 * @typedef {object} scrollerConfig
 * @property {scrollerButtons} [classes] - Classes to apply to each button
 * @property {string} [classes.left = scroller-left scroller-button]
 * @property {string} [classes.right = scroller-right scroller-button]
 * @property {scrollerButtons} [texts] - Text content of each button
 * @property {string} [texts.left = ⮈]
 * @property {string} [texts.right = ⮊]
 * @property {scrollerButtons} [icons] - Icon classes to apply to a span inside each button
 * @property {scrollerButtons} [titles] - The title attribute for each button
 * @property {number[][]} [breakpoints = [ [0, 4], [768, 4], [992, 6], [1200, 8] ]]
 * An array of number pairs. Each array entry should be an array containing two numbers, the first representing 
 * a screen width in px and the second representing the number of scroller items to fit at that width and above 
 * (up to the width of the next pair).
 */

/**
 * The buttons available for configuration in the Scroller config object.
 * @typedef {object} scrollerButtons
 * @property {string} [left] The left/back button
 * @property {string} [right] The right/forward button
 */

/**
 * The default configuration for the Scroller.
 * @type scrollerConfig
 */
const defaultScrollerConfig = {
	classes: {
		left: 'scroller-left scroller-button',
		right: 'scroller-right scroller-button',
	},
	texts: {
		left: '⮈',
		right:'⮊',
	},
	icons: {
		left: '',
		right: '',
	},
	titles: {
		left: 'Scroll back',
		right: 'Scroll forward'
	},
	breakpoints: [ [0, 4], [768, 4], [992, 6], [1200, 8] ]
}

/**
 * Creates an image scroller from a list of images.
 */
class Scroller {
	
	/**
	 * @public
	 * @param {HTMLElement} el
	 * @param {scrollerConfig} [config = {}]
	 */
	constructor(el, config = {} ) {
		this._container = el;
		this._config = applyConfig(defaultScrollerConfig, config);		
		this._sizes();
		
		this._timerID = undefined;
		
		if(this._contentWidth > this._displayWidth) {
			this.create();
		}
	}
	
	/**
	 * Create the scroller after instantiation.
	 * @public
	 */
	create() {
		if (this._container.parentNode == this._wrapper && this._wrapper.style.overflow == 'hidden') return;		
		
		this._leftBtn = makeButton("left", this._config.classes.left, this._config.texts.left, this._config.titles.left, this._config.icons.left, this);
		this._rightBtn = makeButton("right", this._config.classes.right, this._config.texts.right, this._config.titles.right, this._config.icons.right, this);
		
		this._wrap();
		this._wrapper.style.overflow = "hidden";
		this._leftBtn.disabled = true;
		this._wrapper.append(this._leftBtn, this._rightBtn);
		this._container.style.left = "0px";

		//Recalculate sizes (wrapper changes width)
		this._sizes();
		
		window.addEventListener('resize', this);
	}
	
	/**
	 * @protected
	 * @parameter {Event} e
	 * @todo On resize, check if current scroll position is greater than the new maximum and reduce it.
	 */
	handleEvent(e) {
		if (e.type === "click") this[e.currentTarget.id.replace("btn-","")](e);
		
		if (e.type === "resize") {
			if (this._timerID === undefined) {
				this._timerID = setTimeout(
					() => {
						this._sizes();
						this._timerID = undefined;
					},
					500);
			}
		}
	}

	/**
	 * Destroy the scroller.
	 * @public
	 */
	destroy() {
		this._container.style.left = "0px";
		this._leftBtn.remove();
		this._rightBtn.remove();
		window.removeEventListener("resize", this._resizeHandler);
		this._unwrap();
	}
	
	/**
	 * Scroll to the left.
	 * @public
	 */
	left() {
		this._setBtnStatus(this.scroll(false));
	}
	
	/**
	 * Scroll to the right.
	 * @public
	 */
	right() {
		this._setBtnStatus(this.scroll(true));
	}
	
	/**
	 * Set the active/disabled status of the scroller buttons depending on the scroll position.
	 * @protected
	 * @param {number} pos
	 */
	_setBtnStatus(pos) {
		this._leftBtn.disabled = pos === 0;
		this._rightBtn.disabled = pos === -this._maxScroll;
	}
	
	/**
	 * Scroll in the provided direction and return the pixel offset from origin after scrolling.
	 * @public
	 * @param {boolean} [forward = true] Scroll forward (true) or back (false)
	 * @return {number} The pixel offset
	 */
	scroll(forward = true) {
		const current = parseInt(this._container.style.left);
		const change = forward ? -this._step : this._step;
		let scrollTo = current + change;
		
		//We're back at the start.
		if (scrollTo > 0) scrollTo = 0;
		
		//We're at the end.
		if (scrollTo < -this._maxScroll) scrollTo = -this._maxScroll;
		
		//If stepping back from the end and the scroller has a partial-length last step,
		//only step back by that partial step.
		if (!forward && this._rightBtn.disabled) scrollTo = current + (this._maxScroll % this._step);
		
		this._container.style.left = scrollTo + "px";
		
		console.log(`Scrolling. Starting position: ${current}; New position: ${scrollTo}; Step size: ${this._step}; Display width: ${this._displayWidth}; Content width: ${this._contentWidth}; Max scroll: ${this._maxScroll}`);
		return scrollTo;
	}
	
	/**
	 * Add the wrapper element around the scroller.
	 * @protected
	 */
	_wrap() {
		const parent = document.createElement("div");
		parent.classList.add("scroller-wrapper");
		this._container.parentNode.insertBefore(parent, this._container);
		parent.append(this._container);
		this._wrapper = parent;
	}
	
	/**
	 * Remove the wrapper element around the scroller.
	 * @protected
	 */
	_unwrap() {
		this._wrapper.parentNode.insertBefore(this._container, this._wrapper.previousSibling);
		this._wrapper.remove();
	}
	
	/**
	 * Set the size properties and number of scroller items shown depending on screen size.
	 * @protected
	 */
	_sizes() {
		//Set number per row based on screen width
		const w = window.innerWidth;
		const count = this._checkBreakpoint(w, this._config.breakpoints);
		this._setFlexBasis(count);
		
		let comp = window.getComputedStyle(this._container);		
		const padding = parseInt(comp.getPropertyValue('padding-left')) + parseInt(comp.getPropertyValue('padding-right'));

		this._contentWidth = this._container.scrollWidth - padding;
		this._displayWidth = this._container.offsetWidth - padding;
		this._itemWidth = this._container.querySelector("li").offsetWidth;
		this._maxScroll = this._contentWidth - this._displayWidth;
		this._perStep = Math.floor(this._displayWidth / this._itemWidth);
		this._step = this._itemWidth * this._perStep;
	}
	
	/**
	 * Check which breakpoint applies to the given width
	 * @protected
	 * @param {number} w - The width in pixels to check
	 * @param {number[][]} breakpoints - The array of breakpoint configurations
	 * @return {number} The number of items to show at the given width
	 */
	_checkBreakpoint(w, breakpoints) {		
		for (let i = 0; i < breakpoints.length; i++) {
			if(breakpoints[i][0] <= w && (i == breakpoints.length - 1 || breakpoints[i+1][0] > w)) return breakpoints[i][1];
		}
	}
	
	/**
	 * Set the flex basis of the scroller items to show the given number.
	 * @protected
	 * @param {number} x - The number of items to show per width
	 */
	_setFlexBasis(x) {
		if (isNaN(x)) throw new Error(`Invalid number provided for row count: ${x}`);
		
		const items = this._container.querySelectorAll(".scroller li");
		const basis = Math.round(10000 * 100/(x+0.25) / 10000);
		
		for (const item of items) {
			item.style.flexBasis = basis + "%";
		}
	}
}

export default Scroller
