import {applyConfig} from './util.js';

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
}

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
	 * @param {number} [n] Index of image to show
	 */
	show(n) {
		
		//If this is the first run, insert the overlay into the document
		if(!document.getElementById("overlay")) {
			document.body.append(this._overlay);
		}
		
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
	 * @param {Event} e
	 */
	zoom(e) {
		this._pzInstance = this._pzInstance ?? Panzoom(this._imgDisplay, { disableZoom: true });
		
		if (e.target.classList.contains("zoomed")) {
			this._imgDisplay.classList.remove("pan");
			this._pzInstance.reset({ animate: false });
			e.target.textContent = this._config.btnZoomText;
			if (this._config.btnZoomIcon) e.target.querySelector("span").className = this._config.btnZoomIcon;
			e.target.setAttribute("title", this.strings.titleZoom);
			e.target.classList.remove("zoomed");
		} else {
			e.target.classList.add("zoomed");
			this._imgDisplay.classList.add("pan");
			e.target.textContent = this._config.btnZoomTextActive;
			if (this._config.btnZoomIconActive) e.target.querySelector("span").className = this._config.btnZoomIconActive;
			e.target.classList.add("zoomed");
			e.target.setAttribute("title", this.strings.titleZoomActive);
		}
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
			if (this._images[i].dataset.link) {
				btnLink.href = this._images[i].dataset.link;
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
		overlay.setAttribute("tabindex", -1);
		overlay.append(imgWrap);
		overlay.append(caption);
		overlay.append(this._createControls());
		overlay.addEventListener("keydown", (e) => this._shortcutsEventListener(e));
		
		this._overlay = overlay;
		this._imgDisplay = activeImg;
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
			} else {
				console.log(`this.strings[title${el.id.replace("btn", "")}] doesn't exist.`);
			}
		}
		
		return controls;
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
		}
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

export default ImageViewer
