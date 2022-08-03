import {applyConfig} from './util.js';

//TODO: No need to add all image elements to the overlay.  Probably better to switch the src.

const defaultConfig = {
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
	btnCueIcon: "",
	btnHideIcon: "",
	btnDownloadIcon: "",
	btnPrevIcon: "",
	btnNextIcon: "",
	btnLinkIcon: ""
}

class ImageViewer {
	
	/**
	 * @param {Object} [config = {}] The css class of images to which the viewer should be applied.
	 */
	constructor(config = {}) {
		this._config = applyConfig(defaultConfig, config);
		this._sourceImages = document.querySelectorAll('img.' + this._config.targetClass);
	}
	
	create() {
		this._setupImages();
		this._createOverlay();
	}
	
	_setupImages() {
		this._images = [];
		for (const [i, img] of this._sourceImages.entries()) {
			
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
			const full = document.createElement("img");
			full.id = `img-${i}`;
			full.setAttribute("src",img.dataset.full);
			full.setAttribute("alt", img.getAttribute("alt"));
			full.dataset.link = img.parentElement.href ?? "";
			this._images.push(full);
		}
	}
		
	next() {
		const current = this._images.findIndex(e => e.classList.contains("active"));
		const show = current === this._images.length - 1 ? 0 : current + 1;
		this.show(show);
	}
	
	prev() {
		const current = this._images.findIndex(e => e.classList.contains("active"));
		const show = current === 0 ? this._images.length - 1 : current - 1;
		this.show(show);
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
		for (const i of this._images) {
			i.classList.remove("active");
		}
		
		const img = this._images[n];
		img.classList.add("active");
		
		const caption = this._overlay.querySelector(".caption");
		const next = this._sourceImages[n].parentElement.nextElementSibling;
		if (next && (next.tagName === "FIGCAPTION" || next.classList.contains("caption"))){
			caption.textContent = next.textContent;
			caption.style.display = "block";
		} else {
			caption.style.display = "none";
		}
		
		this._updateControls(img);
	}
	
	/**
	 * @param {HTMLElement} img
	 */
	_updateControls(img) {
		
		if (this._config.showDownload) {
			const dl = document.getElementById("btnDownload");
			dl.href = img.src;
			dl.setAttribute("download", "");
		}
		
		if (this._config.showLink) {
			const btnLink = document.getElementById("btnLink");
			console.log(btnLink);
			if (img.dataset.link) {
				btnLink.href = img.dataset.link;
				btnLink.style.display = "block";
			} else {
				btnLink.removeAttribute("href");
				btnLink.style.display = "none";
			}
		}
	}

	/**
	 * Create the overlay, but don't insert in document
	 */
	_createOverlay() {
		const imgList = document.createElement("div");
		imgList.classList.add("image-viewer-list")
		imgList.append(...this._images);
		
		const caption = document.createElement("div");
		caption.classList.add("caption");
		
		const overlay = document.createElement("div");
		overlay.id = "overlay";
		overlay.setAttribute("tabindex", -1);
		overlay.append(imgList);
		overlay.append(caption);
		overlay.append(this._createControls());
		overlay.addEventListener("keydown", (e) => this._shortcutsEventListener(e));
		
		this._overlay = overlay;
		this._imgList = imgList;
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
			let el = document.createElement("button");
			el.id = `btn${b}`;
			el.setAttribute("type", "button");
			if (typeof this[b.toLowerCase()] === "function") el.addEventListener("click", () => this[b.toLowerCase()]());
			controls.append(el);
		}
		
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
		}
		
		return controls;
	}
	
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
	 * @param {Array} classses
	 * @param {HTMLElement} element
	 */
	_insertIcon(classes, element) {
		const i = document.createElement("span");
		i.classList.add(...classes.split(" "));
		element.append(i);
	}
}

export default ImageViewer
