import {applyConfig} from './util.js';

/**
 * @typedef {Object} scrollerConfig
 * @property {object} [classes = {}]
 * @property {string} [classes.left = 'scroller-left']
 * @property {string} [classes.right = 'scroller-right']
 * @property {object} [texts = {}]
 * @property {string} [texts.left = '⮈']
 * @property {string} [texts.right = '⮊']
 * @property {object} [icons = {}]
 * @property {string} [icons.left = ''] !TODO: not implemented
 * @property {string} [icons.right = ''] !TODO: not implemented
 * @property {[number, number][]} [breakpoints = [ [0, 4], [768, 4], [992, 6], [1200, 8] ]]
 */

/**
 * @type scrollerConfig
 */
const defaultScrollerConfig = {
	classes: {
		left: 'scroller-left',
		right: 'scroller-right',
	},
	texts: {
		left: '⮈',
		right:'⮊',
	},
	icons: {
		left: "",
		right: "",
	},
	breakpoints: [ [0, 4], [768, 4], [992, 6], [1200, 8] ]
}

class Scroller {
	
	/**
	 * @param {HTMLElement} el
	 * @param {scrollerConfig} [config = {}]
	 */
	constructor(el, config = {} ) {
		this._container = el;
		this._config = applyConfig(defaultScrollerConfig, config);
		
		this._sizes();
		this._timer = null;
		
		if(this._contentWidth > this._displayWidth) {
			this.create();
		}
	}
	
	create() {
		if (this._container.parentNode == this._wrapper && this._wrapper.style.overflow == 'hidden') return;		
		
		const left = document.createElement("button");
		left.className = this._config.classes.left;
		left.textContent = this._config.texts.left;
		left.disabled = true;
		left.addEventListener("click", () => this.left())
		
		const right = document.createElement("button");
		right.className = this._config.classes.right;
		right.textContent = this._config.texts.right;
		right.addEventListener("click", () => this.right())
		
		this._wrap();
		
		this._wrapper.style.overflow = "hidden";
		this._wrapper.append(left, right);

		window.addEventListener('resize', e => this._resizeHandler());
		
		this._leftBtn = left;
		this._rightBtn = right;
		
		this._container.style.left = "0px";
	}
	
	_resizeHandler() {
		clearTimeout(this._timer);
		this._timer = setTimeout(this._sizes(), 1000);
	}
	
	destroy() {
		this._container.style.left = "0px";
		this._leftBtn.remove();
		this._rightBtn.remove();
		window.removeEventListener("resize", this._resizeHandler);
		this._unwrap();
	}
	
	left() {
		this._setBtnStatus(this.scroll(false));
	}
	
	right() {
		this._setBtnStatus(this.scroll(true));
	}
	
	/**
	 * Set the active/disabled status of the scroller buttons depending on the scroll position.
	 * @param {number} pos
	 */
	_setBtnStatus(pos) {
		this._leftBtn.disabled = pos === 0;
		this._rightBtn.disabled = pos === -this._maxScroll;
	}
	
	/**
	 * @param {boolean} [forward = true] Whether to scroll forward or not (i.e., if false, scroll back)
	 * @return {number}
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
	
	_wrap() {
		const parent = document.createElement("div");
		parent.classList.add("scroller-wrapper");
		this._container.parentNode.insertBefore(parent, this._container);
		parent.append(this._container);
		this._wrapper = parent;
		
		//Recalculate sizes (wrapper changes width)
		this._sizes();
	}
	
	_unwrap() {
		this._wrapper.parentNode.insertBefore(this._container, this._wrapper.previousSibling);
		this._wrapper.remove();
	}
	
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
	
	_checkBreakpoint(w, breakpoints) {		
		for (let i = 0; i < breakpoints.length; i++) {
			if(breakpoints[i][0] <= w && (i == breakpoints.length - 1 || breakpoints[i+1][0] > w)) return breakpoints[i][1];
		}
	}
	
	_setFlexBasis(x) {
		if (isNaN(x)) throw new Error(`Invalid number provided for row count: ${x}`);
		
		const items = this._container.querySelectorAll(".scroller li");
		const basis = Math.round(10000 * 100/(x+0.5) / 10000);
		
		for (const item of items) {
			item.style.flexBasis = basis + "%";
		}
	}
}

export default Scroller
