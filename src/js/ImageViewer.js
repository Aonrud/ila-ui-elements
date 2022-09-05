import {applyConfig} from './util.js';

/**
 * @typedef imageViewerConfig
 * @property {string} [targetClass = "viewer"]
 * @property {boolean} [panzoom = false]
 * @property {boolean} [showDownload = false]
 * @property {boolean} [showLink = true]
 * @property {object} [texts = {}]
 * @property {string} [texts.cue = "⨁"]
 * @property {string} [texts.hide = "ⓧ"]
 * @property {string} [texts.download = "⮋"]
 * @property {string} [texts.prev = "⮈"]
 * @property {string} [texts.next = "⮊"]
 * @property {string} [texts.link = "⛓"]
 * @property {string} [texts.zoom = "🞕"]
 * @property {string} [texts.zoomActive = "🞔"]
 * @property {object} [icons = {}]
 * @property {string} [icons.cue = ""]
 * @property {string} [icons.hide = ""]
 * @property {string} [icons.download = ""]
 * @property {string} [icons.prev = ""]
 * @property {string} [icons.next = ""]
 * @property {string} [icons.link = ""]
 * @property {string} [icons.zoom = ""]
 * @property {string} [icons.zoomActive = ""]
 * @property {object} [titles = {}]
 * @property {string} [titles.cue = ""]
 * @property {string} [titles.hide = "Close"]
 * @property {string} [titles.download = "Download this image"]
 * @property {string} [titles.prev = "Previous image"]
 * @property {string} [titles.next = "Next image"]
 * @property {string} [titles.link = "More information"]
 * @property {string} [titles.zoom = "Enlarge image (drag to move the image around)"]
 * @property {string} [titles.zoomActive = "Reset image to fit screen"] 
 * @property {string} [titles.zoomDisabled = "Zoom disabled (the image is already full size)]
 */

/**
 * @type imageViewerConfig
 */
const defaultImageViewerConfig = {
	targetClass: "viewer",
	panzoom: false,
	showDownload: false,
	showLink: true,
	texts: {
		cue: "⨁",
		hide: "ⓧ",
		download: "⮋",
		prev: "⮈",
		next: "⮊",
		link: "⛓",
		zoom: "🞕",
		zoomActive: "🞔",
	},
	icons: {
		cue: "",
		hide: "",
		download: "",
		prev: "",
		next: "",
		link: "",
		zoom: "",
		zoomActive: "",
	},
	titles: {
		cue: "",
		hide: "Close",
		download: "Download this image",
		prev: "Previous image",
		next: "Next image",
		link:  "More information",
		zoom: "Enlarge image (drag to move the image around)",
		zoomActive: "Reset image to fit screen",
		zoomDisabled: "Zoom disabled (the image is already full size)",
	}
}

class ImageViewer {
	
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
		const btnName = btn.id.replace("btn", "").toLowerCase();
		const btnTextNode = [...btn.childNodes].filter( n => n.nodeType === Node.TEXT_NODE)[0];
		const txt = switchOn ? this._config.texts[`${btnName}Active`] : this._config.texts[btnName];
		const icon = switchOn ? this._config.icons[`${btnName}Active`] : this._config[btnName];
		const title = switchOn ? this._config.titles[`${btnName}Active`] : this._config.titles[btnName];
		
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
			cue.textContent = this._config.texts.cue;
			if (this._config.icons.cue) {
				this._insertIcon(this._config.icons.cue, cue);
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
			const btnName = el.id.replace("btn", "").toLowerCase();
			console.log(this._config.titles[btnName]);
			el.textContent = this._config.texts[btnName];
			if (this._config.icons[btnName]) {
				this._insertIcon(this._config.icons[btnName], el);
			}
			if (this._config.titles[btnName]) {
				el.setAttribute("title", this._config.titles[btnName]);
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
				btnZoom.setAttribute("title", this._config.titles.zoom);
			} else {
				btnZoom.disabled = true;
				btnZoom.setAttribute("title", this._config.titles.zoomDisabled);
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


