import {applyConfig} from './util.js';


/**
 * @typedef {Object} scrollerConfig
 * @property {string} [leftButtonClass = "scroller-left btn btn-scroller"]
 * @property {string} [rightButtonClass = "scroller-right btn btn-scroller"]
 * @property {string} [leftButtonContent = "⮈"]
 * @property {string} [rightButtonContent = "⮊"]
 * @property {[number, number][]} [breakpoints = [ [0, 4], [768, 4], [992, 6], [1200, 8] ]]
 */

/**
 * @type scrollerConfig
 */
const defaultScrollerConfig = {
	leftButtonClass: 'scroller-left btn btn-scroller',
	rightButtonClass: 'scroller-right btn btn-scroller',
	leftButtonContent: '⮈',
	rightButtonContent: '⮊',
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
		
		const buttons = '<button class="' + this._config.leftButtonClass + ' disabled">' + this._config.leftButtonContent + '</button><button class="' + this._config.rightButtonClass + '">' + this._config.rightButtonContent + '</button>';
		
		this._wrap();
		
		this._wrapper.style.overflow = "hidden";
		this._wrapper.insertAdjacentHTML('beforeend', buttons);	
		this._wrapper.addEventListener("click", (e) => this._scroll(e));

		window.addEventListener('resize', e => this._resizeHandler());
		
		this._leftBtn = this._wrapper.querySelector(".scroller-left");
		this._rightBtn = this._wrapper.querySelector(".scroller-right");
		
		//Initial state
		this._container.style.left = "0px";
		this._leftBtn.disabled = true;
		this._leftBtn.classList.add("disabled");
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
	
	scrollLeft() {
		const current = parseInt(this._container.style.left);
		let scrollTo = current + this._step;
		
		if (this._rightBtn.classList.contains("disabled")) {
				scrollTo = current + (this._maxScroll % this._step);
		}
		if (scrollTo >= 0) {
			scrollTo = 0;
			this._leftBtn.disabled = true;
			this._leftBtn.classList.add("disabled");
		}
		
		this._container.style.left = scrollTo + "px";
		this._rightBtn.disabled = false;
		this._rightBtn.classList.remove("disabled");
		
		console.log(`Moving from ${current} to ${scrollTo}`);
	}
	
	scrollRight() {
		const current = parseInt(this._container.style.left);
		let scrollTo = current - this._step;
		
		if (scrollTo < -this._maxScroll) {
			scrollTo = -this._maxScroll;
			this._rightBtn.disabled = true;
			this._rightBtn.classList.add("disabled");
		}
		
		this._container.style.left = scrollTo + "px";
		this._leftBtn.disabled = false;
		this._leftBtn.classList.remove("disabled");
		
		console.log(`Moving from ${current} to ${scrollTo}`);
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
		this._perStep = Math.floor(this._displayWidth / this._itemWidth);
		this._step = this._itemWidth * this._perStep;
		this._maxScroll = this._contentWidth - this._displayWidth;
		
		console.log(`Content: ${this._contentWidth}; Display: ${this._displayWidth}.`);
	}
	
	_checkBreakpoint(w, breakpoints) {		
		for (let i = 0; i < breakpoints.length; i++) {
			if(breakpoints[i][0] <= w && (i == breakpoints.length - 1 || breakpoints[i+1][0] > w)) return breakpoints[i][1];
		}
	}
	
	_setFlexBasis(x) {
		if (isNaN(x)) throw new Error(`Invalid number provided for row count: ${x}`);
		
		console.log(`Setting row count to ${x}`)
		const items = this._container.querySelectorAll(".scroller li");
		const basis = 100/x + "%";
		
		for (const item of items) {
			item.style.flexBasis = basis;
		}
	}
	
	_scroll(e) {
		if (e.target.classList.contains("scroller-left")) this.scrollLeft();
		if (e.target.classList.contains("scroller-right")) this.scrollRight();
	}
}

export default Scroller
