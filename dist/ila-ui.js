/*! ILA UI Elements
 *Copyright (C) 2021-2022 Aonghus Storey
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ila = {}));
})(this, (function (exports) { 'use strict';

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
			c[prop] = conf[prop] ?? defaults[prop];
		}
		return c;
	}

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
	};

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
			
			console.log(`Setting row count to ${x}`);
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

	/**
	 * @typedef imageViewerConfig
	 * @property {string} [targetClass = "viewer"]
	 * @property {boolean} [panzoom = false]
	 * @property {boolean} [showDownload = false]
	 * @property {boolean} [showLink = true]
	 * @property {string} [btnCueText = "⨁"]
	 * @property {string} [btnHideText = "ⓧ"]
	 * @property {string} [btnDownloadText = "⮋"]
	 * @property {string} [btnPrevText = "⮈"]
	 * @property {string} [btnNextText = "⮊"]
	 * @property {string} [btnLinkText = "⛓"]
	 * @property {string} [btnZoomText = "🞕"]
	 * @property {string} [btnZoomTextActive = "🞔"]
	 * @property {string} [btnCueIcon = ""]
	 * @property {string} [btnHideIcon = ""]
	 * @property {string} [btnDownloadIcon = ""]
	 * @property {string} [btnPrevIcon = ""]
	 * @property {string} [btnNextIcon = ""]
	 * @property {string} [btnLinkIcon = ""]
	 * @property {string} [btnZoomIcon = ""]
	 * @property {string} [btnZoomIconActive = ""]
	 */

	/**
	 * @type imageViewerConfig
	 */
	const defaultImageViewerConfig = {
		targetClass: "viewer",
		panzoom: false,
		showDownload: false,
		showLink: true,
		btnCueText: "⨁",
		btnHideText: "ⓧ",
		btnDownloadText: "⮋",
		btnPrevText: "⮈",
		btnNextText: "⮊",
		btnLinkText: "⛓",
		btnZoomText: "🞕",
		btnZoomTextActive: "🞔",
		btnCueIcon: "",
		btnHideIcon: "",
		btnDownloadIcon: "",
		btnPrevIcon: "",
		btnNextIcon: "",
		btnLinkIcon: "",
		btnZoomIcon: "",
		btnZoomIconActive: ""
	};

	class ImageViewer {
		
		strings = {
			titleHide: "Close",
			titlePrev: "Previous image",
			titleNext: "Next image",
			titleZoom: "Enlarge image (drag to move the image around)",
			titleZoomActive: "Reset image to fit screen",
			titleZoomDisabled: "Zoom disabled (the image is already full size)",
			titleDownload: "Download this image",
			titleLink: "More information"
		}
		
		/**
		 * @param {imageViewerConfig} [config = defaultImageViewerConfig]
		 */
		constructor(config = {}) {
			this._config = applyConfig(defaultImageViewerConfig, config);
			this._images = document.querySelectorAll('img.' + this._config.targetClass);
		}
		
		create() {
			this._setupImages();
			this._createOverlay();
		}
		
		next() {
			const n = this._activeIndex === this._images.length - 1 ? 0 : this._activeIndex + 1;
			this.show(n);
		}
		
		prev() {
			const n = this._activeIndex === 0 ? this._images.length - 1 : this._activeIndex - 1;
			this.show(n);
		}
			
		hide() {
			if (this._active) {
				this._overlay.style.display = "none";
				document.body.style.overflow = "visible";
				this._overlay.blur();
				this._active = false;
			}
		}
		
		/**
		 * @param {number} [n = 0] Index of image to show
		 */
		show(n = 0) {
			if (!this._active) {
				this._overlay.style.display = "block";
				document.body.style.overflow = "hidden";
				this._overlay.focus();
				this._active = true;
			}
			
			if (Number.isInteger(n)) this._showImage(n);
		}
		
		/**
		 * @param {number} n The index number of the image to display
		 */
		_showImage(n) {
			const img = this._images[n];
			this._activeIndex = n;
			
			//If panzoom is still on for last image, switch it off
			if (this._config.panzoom && this._imgDisplay.classList.contains("pan")) { 
				this.btnToggle(document.getElementById("btnZoom"), false);
				this.zoomToggle(false);
			}
			
			this._imgDisplay.src = img.dataset.full ?? img.src;
			this._imgDisplay.setAttribute("alt", img.getAttribute("alt"));
			
			const caption = this._overlay.querySelector(".caption");
			const nextEl = this._images[n].parentElement.nextElementSibling;
			if (nextEl && (nextEl.tagName === "FIGCAPTION" || nextEl.classList.contains("caption"))){
				caption.textContent = nextEl.textContent;
				caption.style.display = "block";
			} else {
				caption.style.display = "none";
			}
		}
		
		/** 
		 * @param {HTMLElement} e The click event
		 */
		zoom(e) {
			const state = !this._imgDisplay.classList.contains("pan");
			
			this.zoomToggle(state);
			this.btnToggle(e.currentTarget, state);		
			e.currentTarget.classList.toggle("zoomed");
		}
		
		/**
		 * @param {boolean} [switchOn = true]
		 */
		btnToggle(btn, switchOn = true) {
			const btnTextNode = [...btn.childNodes].filter( n => n.nodeType === Node.TEXT_NODE)[0];
			const txt = switchOn ? this._config[`${btn.id}TextActive`] : this._config[`${btn.id}Text`];
			const icon = switchOn ? this._config[`${btn.id}IconActive`] : this._config[`${btn.id}Icon`];
			const title = switchOn ? this.strings[`${btn.id.replace("btn", "title")}Active`] : this.strings[btn.id.replace("btn", "title")];
			
			if (txt) {
				if(!btnTextNode) {
					btnTextNode = document.createTextNode();
					btn.append(btnTextNode);
				}
				btnTextNode.textContent = txt;
			}
			
			if (icon) btn.querySelector("span").className = icon;
			btn.setAttribute("title", title);
		}
		
		/**
		 * @param {boolean} [switchOn = true]
		 */
		zoomToggle(switchOn = true) {
			const pz = this._pzInstance;
			
			if (switchOn) {
				this._imgDisplay.classList.add("pan");
				pz.bind();
				pz.setStyle("cursor", "move");
				return;
			}
			this._imgDisplay.classList.remove("pan");
			pz.reset({ animate: false });
			pz.setStyle("cursor", "auto");
			pz.destroy();
		}

		/**
		 * Create the overlay, but don't insert in document
		 */
		_createOverlay() {
			const imgWrap = document.createElement("div");
			imgWrap.classList.add("image-wrap");
			
			const activeImg = document.createElement("img");
			activeImg.addEventListener("load", () => this._updateControls());
			imgWrap.append(activeImg);
			
			
			const caption = document.createElement("div");
			caption.classList.add("caption");
			
			const overlay = document.createElement("div");
			overlay.id = "overlay";
			overlay.style.display = "none";
			overlay.setAttribute("tabindex", -1);
			overlay.append(imgWrap);
			overlay.append(caption);
			overlay.append(this._createControls());
			overlay.addEventListener("keydown", (e) => this._shortcutsEventListener(e));
			
			this._overlay = overlay;
			this._imgDisplay = activeImg;
			this._active = false;
					
			document.body.append(this._overlay);
			
			//Instantiate panzoom if needed
			if (this._config.panzoom) {
				this._pzInstance = this._pzInstance ?? Panzoom(this._imgDisplay, { disableZoom: true, noBind: true });
				//Even though only instantiated, the classes are set so we do a full switch off for the initial state
				this.zoomToggle(false);
			}
		}
		
		_setupImages() {
			for (const [i, img] of this._images.entries()) {
				
				let wrap = img.parentElement;
				
				if (wrap.tagName !== "A") {
					wrap = document.createElement("a");
					img.parentElement.insertBefore(wrap, img);
					wrap.append(img);
				}
				
				wrap.classList.add("viewer-wrap");
				
				const cue = document.createElement("div");
				cue.classList.add("cue");
				cue.textContent = this._config.btnCueText;
				if (this._config.btnCueIcon) {
					this._insertIcon(this._config.btnCueIcon, cue);
				}
				wrap.append(cue);
				
				wrap.addEventListener("click",
									  e => {
										  e.preventDefault();
										  this.show(i);
									  }
				);
			}
		}
		
		/**
		 * @return {Node}
		 */
		_createControls() {
			const controls = document.createElement("nav");
			controls.classList.add("image-viewer-controls");
			controls.setAttribute("aria-label", "Image Viewer Controls");
			
			const btns = [ "Hide", "Prev", "Next" ];
			const anchors = [ "Download", "Link" ];
			
			for (const b of btns) {
				controls.append(this._makeButton(b));
			}
			
			if (this._config.panzoom) controls.append(this._makeButton("Zoom"));
			
			for (const a of anchors) {
				if (this._config[`show${a}`]) {
					let el = document.createElement("a");
					el.id = `btn${a}`;
					controls.append(el);
				}
			}
			
			for (const el of controls.children) {
				el.textContent = this._config[`${el.id}Text`];
				if (this._config[`${el.id}Icon`]) {
					this._insertIcon(this._config[`${el.id}Icon`], el);
				}
				if (this.strings[`title${el.id.replace("btn", "")}`]) {
					el.setAttribute("title", this.strings[`title${el.id.replace("btn", "")}`]);
				}
			}
			
			return controls;
		}
		
		_updateControls() {
			const img = this._imgDisplay;
			const i = this._activeIndex;
			
			if (this._config.showDownload) {
				const dl = document.getElementById("btnDownload");
				dl.href = img.src;
				dl.setAttribute("download", "");
			}
			
			if (this._config.showLink) {
				const btnLink = document.getElementById("btnLink");
				const link = this._images[i].dataset.link ? this._images[i].dataset.link : this._images[i].parentElement.href;
				console.log(link);
				if (link) {
					btnLink.href = link;
					btnLink.style.display = "block";
				} else {
					btnLink.removeAttribute("href");
					btnLink.style.display = "none";
				}
			}
			
			if (this._config.panzoom) {
				const btnZoom = document.getElementById("btnZoom");
				if(img.width < img.naturalWidth) {
					btnZoom.disabled = false;
					btnZoom.setAttribute("title", this.strings.titleZoom);
				} else {
					btnZoom.disabled = true;
					btnZoom.setAttribute("title", this.strings.titleZoomDisabled);
				}
			}
		}
			
		/**
		 * @param {string} b
		 * @return {HTMLButtonElement}
		 */
		_makeButton(b) {
			let el = document.createElement("button");
			el.id = `btn${b}`;
			el.setAttribute("type", "button");
			if (typeof this[b.toLowerCase()] === "function") el.addEventListener("click", (e) => this[b.toLowerCase()](e));
			return el;
		}
		
		/**
		 * @param {Event} e
		 */
		_shortcutsEventListener(e) {
			const keys = {
				"Escape": "hide",
				"ArrowLeft": "prev",
				"ArrowRight": "next"
			};
			if (keys.hasOwnProperty(e.key) && typeof this[keys[e.key]] === "function") {
				e.preventDefault();
				this[keys[e.key]]();
			}
		}
		
		/**
		 * @param {Array} classes
		 * @param {HTMLElement} element
		 */
		_insertIcon(classes, element) {
			const i = document.createElement("span");
			i.classList.add(...classes.split(" "));
			element.append(i);
		}
	}

	exports.ImageViewer = ImageViewer;
	exports.Scroller = Scroller;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
