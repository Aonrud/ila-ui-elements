import {applyConfig} from './utils/applyConfig.js';
import {makeButton} from './utils/makeButton.js';
import {Swipe} from './utils/Swipe.js';

/**
 * The configuration object for the ImageViewer.
 * @typedef {object} imageViewerConfig
 * @property {string} [targetClass = viewer]
 * @property {boolean} [panzoom = false]
 * Activate the zoom button, which toggles the image's full size and allows panning around.
 * Requires @panzoom/panzoom module to be available.
 * @property {boolean} [showDownload = false] Show a button to download the image
 * @property {boolean} [showLink = true] Show a link button for any images with a link associated
 * @property {Array} [captions = [ "& + figcaption", "& + .caption" ]] CSS selectors for the captions. '&' will be replaced with the automatically assigned ID of the anchor around the image. If ':scope' is included, the selector scope is the `<img>` grandparent.
 * @property {imageViewerButtons} [texts] The inner text of the buttons
 * @property {string} [texts.cue = ⨁]
 * @property {string} [texts.hide = ⓧ]
 * @property {string} [texts.download = ⮋]
 * @property {string} [texts.prev = ⮈]
 * @property {string} [texts.next = ⮊]
 * @property {string} [texts.reveal = ᴑ]
 * @property {string} [texts.revealActive = ᴓ]
 * @property {string} [texts.link = ⛓]
 * @property {string} [texts.zoom = 🞕]
 * @property {string} [texts.zoomActive = 🞔]
 * @property {imageViewerButtons} [icons = {}] Classes to add to a span inside each button (for icon display)
 * @property {imageViewerButtons} [titles] Strings to include as title attributes for each button
 * @property {string} [titles.cue]
 * @property {string} [titles.hide = Close]
 * @property {string} [titles.download = Download this image]
 * @property {string} [titles.prev = Previous image]
 * @property {string} [titles.next = Next image]
 * @property {string} [titles.reveal = Reveal image]
 * @property {string} [titles.revealActive = Re-hide image]
 * @property {string} [titles.link = More information]
 * @property {string} [titles.zoom = Enlarge image (drag to move the image around)]
 * @property {string} [titles.zoomActive = Reset image to fit screen] 
 * @property {string} [titles.zoomDisabled = Zoom disabled (the image is already full size)]
 */

/**
 * The available buttons which can be set in the Image Viewer configuration.
 * Note that reveal and zoom have additional 'active' states, and zoom also has a 'disabled' state.
 * @typedef {object} imageViewerButtons
 * @property {string} [cue] - The cue shown when hovering over an image to indicate the viewer is available.
 * @property {string} [hide] - The button to hide/close the viewer
 * @property {string} [download] - The button to download the current image in the viewer
 * @property {string} [prev] - The button to show the previous image
 * @property {string} [next] - The button to show the next image 
 * @property {string} [reveal] - The button to reveal a blurred image
 * @property {string} [revealActive] - The button to hide turn off reveal - i.e. re-blur the image.
 * @property {string} [link] - The button for the image's link
 * @property {string} [zoom] - The button to zoom the image to full size and activate panning
 * @property {string} [zoomActive] - Properties for the zoom button when it's active
 * @property {string} [zoomDisabled] - Properties for the zoom button when it's disabled
 */

/**
 * The default image viewer configuration.
 * @type imageViewerConfig
 */
const defaultImageViewerConfig = {
	targetClass: "viewer",
	panzoom: false,
	showDownload: false,
	showLink: true,
	captions: [ "& + figcaption", "& + .caption" ],
	texts: {
		cue: "⨁",
		hide: "ⓧ",
		download: "⮋",
		prev: "⮈",
		next: "⮊",
		reveal: "ᴑ",
		revealActive: "ᴓ",
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
		reveal: "",
		revealActive: "",
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
		reveal: "Reveal image",
		revealActive: "Blur image",
		link:  "More information",
		zoom: "Enlarge image (drag to move the image around)",
		zoomActive: "Reset image to fit screen",
		zoomDisabled: "Zoom disabled (the image is already full size)",
	}
}

/**
 * Creates an image viewer overlay.
 * @public
 * @param {imageViewerConfig} [config = defaultImageViewerConfig]
 */
class ImageViewer {

	constructor(config = {}) {
		this._config = applyConfig(defaultImageViewerConfig, config);
		this._images = document.querySelectorAll('img.' + this._config.targetClass);
	}
	
	/**
	 * Create the viewer.
	 * This method should be called after instantiation to activate the viewer.
	 * @public
	 */
	create() {
		this._setupImages();
		this._createOverlay();
	}
	
	/**
	 * Show the next image.
	 * @public
	 */
	next() {
		const n = this._activeIndex === this._images.length - 1 ? 0 : this._activeIndex + 1;
		this.show(n);
	}
	
	/**
	 * Show the previous image.
	 * @public
	 */
	prev() {
		const n = this._activeIndex === 0 ? this._images.length - 1 : this._activeIndex - 1;
		this.show(n);
	}
	
	/**
	 * Hide the viewer and return to the page.
	 * @public
	 */
	hide() {
		if (this._active) {
			this._overlay.style.display = "none";
			document.body.style.overflow = "visible";
			this._overlay.blur();
			this._active = false;
		}
	}
	
	/**
	 * Show the viewer with the image specified by the given index
	 * @public
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
	 * @protected
	 */
	handleEvent(e) {
		if (e.type == "click") this[e.currentTarget.id.replace("btn-","")](e);
	}
	
	/**
	 * Switch the viewer to display the image specified by the index
	 * @protected
	 * @param {number} n The index number of the image to display
	 */
	async _showImage(n) {
		const img = this._images[n];
		const el = this._imgDisplay;
		const path = img.dataset.full ?? img.src;
		this._activeIndex = n;
		
		//If panzoom is still on for last image, switch it off
		if (this._config.panzoom && el.classList.contains("pan")) { 
			this.btnToggle(document.getElementById("btn-zoom"), false);
			this.zoomToggle(false);
		}
		
		this._loader.style.visibility = "visible";
		this._resetImage();
		el.dataset.loading = path;
		
		const url = await this._loadImage(path);
		
		//Prevent jumping back if display has moved on to another image before this one is loaded.
		if(el.dataset.loading == url) {
			console.log(url);
			//Put the loaded image into the visible <img> element.
			//The promise is awaited again to prevent the controls update checking the width before the image is in position.
			await this._loadImage(url, this._imgDisplay);
			el.alt = img.getAttribute("alt");
			this._loader.style.visibility = "hidden";
			this._updateCaption(n);
			this.revealToggle(!img.dataset.hasOwnProperty("reveal") || !img.dataset.reveal == 'true');
			this._updateControls();
		}
	}
	
	/**
	 * Load the image and return a promise that resolves when complete.
	 * @protected
	 * @param {string} url The image source
	 * @param {HTMLImageElement} [i = new Image()] The image element in which to load the image. If unspecified a new Image is created on the DOM.
	 * @return Promise
	 */
	_loadImage(url, i = new Image()) {
		console.log(`Loading ${url}`);
		return new Promise((resolve) => {
			i.addEventListener('load', () => { resolve(url); });
			i.src = url;
			i.dataset.loading = null;
		});
	}
	
	/**
	 * Empty the overlay display image and remove its alt and caption.
	 * @protected
	 */
	_resetImage() {
		this._imgDisplay.src = "";
		this._imgDisplay.alt = "";
		this._overlay.querySelector(".caption").style.display = "none";
	}
	
	/**
	 * Set the overlay caption for the given image number.
	 * The caption will be determined with this order of priority:
	 * 1. The content of the element matched by `data-caption-id` attribute
	 * 2. The content of the `data-caption` attribute
	 * 3. The content of elements matching config.captions. Note: multiple matches will be concatenated.
	 * 
	 * @protected
	 * @param {number} n The number of the image from which to take the caption.
	 */
	_updateCaption(n) {
		const caption = this._overlay.querySelector(".caption");
		caption.textContent = '';
		
		//First use the selectors
		const scope = this._images[n].parentNode.parentNode; //The element which contains the .viewer-wrap anchor
		for (let selector of this._config.captions) {
			let node;
			selector = selector.replace("&", `#iv-${n}`)
			if (selector.includes(":scope")) {
				selector.replace(":scope", "");
				node = scope.querySelector(selector);
			} else {
				node = document.querySelector(selector);
			}
			if (node) caption.textContent += node.textContent;
		}
		
		//Caption in data-caption attribute
		if (this._images[n].dataset.caption) {
			caption.textContent = this._images.dataset.caption;
		}
		
		//Caption element ID in data-caption-id attribute
		if (this._images[n].dataset.captionId && document.querySelector('#' + this._images[n].dataset.captionId)) {
			caption.textContent = document.querySelector('#' + this._images[n].dataset.captionId).textContent;
		}
		
		if (caption.textContent !== '') {
			caption.style.display = "block";
		} else {
			caption.style.display = "none";
		}
	}
	
	/** 
	 * Handle click events for toggling the panzoom status
	 * @protected
	 * @param {HTMLElement} e The click event
	 */
	zoom(e) {
		const state = !this._imgDisplay.classList.contains("pan");		
		this.zoomToggle(state);
		this.btnToggle(e.currentTarget, state);		
		e.currentTarget.classList.toggle("zoomed");
	}
	
	/** 
	 * Handle click events for toggling the reveal status
	 * @protected
	 * @param {HTMLElement} e The click event
	 */
	reveal(e) {
		const state = this._imgDisplay.style.filter.includes("blur");
		this.revealToggle(state);
		this.btnToggle(e.currentTarget, state);
	}
	
	/**
	 * Toggle the specified button on or off as specified
	 * @protected
	 * @param {boolean} [switchOn = true]
	 */
	btnToggle(btn, switchOn = true) {
		const btnName = btn.id.replace("btn-", "");
		const btnTextNode = [...btn.childNodes].filter( n => n.nodeType === Node.TEXT_NODE)[0];
		const txt = switchOn ? this._config.texts[`${btnName}Active`] : this._config.texts[btnName];
		const icon = switchOn ? this._config.icons[`${btnName}Active`] : this._config.icons[btnName];
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
	 * Set the panzoom status 
	 * @public
	 * @param {boolean} [switchOn = true]
	 */
	zoomToggle(switchOn = true) {
		const pz = this._pzInstance;
		
		if (switchOn) {
			//Turn off swipe actions when zoomed to prevent over-riding Panzoom movements
			this._swipe.detach();
			this._imgDisplay.classList.add("pan");
			pz.bind();
			pz.setStyle("cursor", "move");
			return;
		}
		this._swipe.attach();
		this._imgDisplay.classList.remove("pan");
		pz.reset({ animate: false });
		pz.setStyle("cursor", "auto");
		pz.destroy();
	}
	
	/**
	 * Set the reveal state.
	 * @public
	 * @param {boolean} [reveal = true]
	 */
	revealToggle(reveal = true) {
		const caption = this._overlay.querySelector(".caption");
		
		if (reveal) {
			this._imgDisplay.style.filter = "";
			caption.style.color = "";
		} else {
			this._imgDisplay.style.filter = "blur(1em)";
			caption.style.color = getComputedStyle(caption).getPropertyValue('background-color');
		}
	}

	/**
	 * Create the overlay and insert in the document
	 * @protected
	 */
	_createOverlay() {
		const imgWrap = document.createElement("div");
		imgWrap.classList.add("image-wrap");
		
		const loader = document.createElement("div");
		loader.classList.add("loader");
		imgWrap.append(loader);
		
		const activeImg = document.createElement("img");
		// activeImg.addEventListener("load", () => this._updateControls());
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
		
		this._swipe = new Swipe(overlay);
		this._swipe.attach();
		overlay.addEventListener('swiped-right', () => this.prev() );
		overlay.addEventListener('swiped-left', () => this.next() );
		overlay.addEventListener('swiped-up', () => this.hide() );
				
		this._overlay = overlay;
		this._imgDisplay = activeImg;
		this._caption = caption;
		this._loader = loader;
		this._active = false;
				
		document.body.append(this._overlay);
		
		//Instantiate panzoom if needed
		if (this._config.panzoom) {
			this._pzInstance = this._pzInstance ?? Panzoom(this._imgDisplay, { disableZoom: true, noBind: true });
			//Even though only instantiated, the classes are set so we do a full switch off for the initial state
			this.zoomToggle(false);
		}
	}
	
	/**
	 * Setup the images on the page for activating the viewer.
	 * @protected
	 */
	_setupImages() {
		for (const [i, img] of this._images.entries()) {
			
			let wrap = img.parentElement;
			
			if (wrap.tagName !== "A") {
				wrap = document.createElement("a");
				img.parentElement.insertBefore(wrap, img);
				wrap.append(img);
			}
			
			wrap.id = `iv-${i}`;
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
	 * Create the viewer controls.
	 * @protected
	 * @return {HTMLElement}
	 */
	_createControls() {
		const controls = document.createElement("nav");
		controls.classList.add("image-viewer-controls");
		controls.setAttribute("aria-label", "Image Viewer Controls");
		
		const btns = [ "hide" ];
		if (this._images.length > 1) {
			btns.push("next", "prev");
		}
		btns.push("reveal");
		
		const anchors = [ "download", "link" ];
		
		for (const b of btns) {
			controls.append(makeButton(b, "", this._config.texts[b], this._config.titles[b], this._config.icons[b], this));
		}
		
		if (this._config.panzoom) controls.append(makeButton("zoom", "", this._config.texts.zoom, this._config.titles.zoom, this._config.icons.zoom, this));
		
		for (const a of anchors) {
			if (this._config[`show${a.charAt(0).toUpperCase() + a.slice(1)}`]) {
				controls.append(makeButton(a, "", this._config.texts[a], this._config.titles[a], this._config.icons[a], undefined, "a"));
			}
		}		
		return controls;
	}
	
	/**
	 * Update the viewer controls based on the currently shown image.
	 * @protected
	 */
	_updateControls() {
		const img = this._imgDisplay;
		const i = this._activeIndex;
		
		if (this._config.showDownload) {
			const dl = document.getElementById("btn-download");
			dl.href = img.src;
			dl.setAttribute("download", "");
		}
		
		if (this._config.showLink) {
			const btnLink = document.getElementById("btn-link");
			const link = this._images[i].dataset.link ? this._images[i].dataset.link : this._images[i].parentElement.href;
			if (link) {
				btnLink.href = link;
				btnLink.style.display = "block";
			} else {
				btnLink.removeAttribute("href");
				btnLink.style.display = "none";
			}
		}
		
		const btnReveal = document.getElementById("btn-reveal");
		if (this._images[i].dataset.reveal == 'true') {
			btnReveal.style.display = "block";
		} else {
			btnReveal.style.display = "none";
		}
			
		
		if (this._config.panzoom) {
			console.log(`Shown: ${img.width}; Actual: ${img.naturalWidth}`);
			const btnZoom = document.getElementById("btn-zoom");
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
	 * Event listener for keyboard shortcuts
	 * @protected
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
	 * Insert an icon (<span>) with the given classes into the given element
	 * @protected
	 * @param {string} classes
	 * @param {HTMLElement} element
	 */
	_insertIcon(classes, element) {
		const i = document.createElement("span");
		i.classList.add(...classes.split(" "));
		element.append(i);
	}
}

export default ImageViewer


