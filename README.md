This is a set of UI elements created for the [Irish Left Archive](https://www.leftarchive.ie) website. They are provided here under the [GPLv3 licence](LICENCE).

For examples of each component, see the index.html in the demos folder.

They are also in use on the Irish Left Archive website - for a live example see [this document collection](https://www.leftarchive.ie/collection/2041/).

## Use

For the most simple use, include [`dist/ila-ui.min.js`](dist/ila-ui.min.js) and [`dist/ila-ui.min.css`](dist/ila-ui.min.css) in your HTML file then refer to the examples below to use each component.

The package is bundled as an ES6 module [`dist/ila-ui.esm.js`](dist/ila-ui.esm.js) or a UMD [`dist/ila-ui.min.js`](dist/ila-ui.min.js), depending on your preferred development tools.

The CSS is compiled from SASS files. If including the module in your build environment, the file [`src/scss/_variables.scss`](src/scss/_variables.scss) sets the colour variables as defaults so they can be over-ridden if required.

## Components

### Scroller

The scroller turns a list of linked images into a configurable horizontal scroller.

#### Example

The below HTML and Javascript will create a scroller with the default settings.

**Note:** To allow the use of margins, the styling of the scroller items is applied to `ul.scroller li a`.

```html
<ul class="scroller">
    <li>
        <a href="https://example.com">
            <img src="example.png" alt="First image" />
            <div class="caption">This is the caption</div>
        </a>
    </li>
    
    …
    
</ul>
```

```javascript
new ila.Scroller(document.querySelectorAll(".scroller")[0]);
```

#### Configuration

The scroller configuration allows modifying the buttons and changing the number of items shown at each screen width.

To make changes to the defaults, pass a config object when instantiating the scroller. All properties are optional - any provided will be used to over-ride the defaults.

**Note:** The default classes applied to the scroller buttons include `scroller-button` for the visual style and `scroller-left` and `scroller-right` for the position. If using custom classes and excluding the latter classes, the `left` and `right` CSS properties should be set in your custom class to position the buttons at either end of the scroller.

See the [scrollerConfig](#scrollerConfig) definition for the available options.

### Image Viewer

Creates an image viewer overlay from selected images for viewing them in larger size, with options to allow downloading, include panning large images and include links.

The image viewer also enables keyboard navigation when active. Use <kbd>Esc</kbd> to close the viewer, and the arrow keys (<kbd>←</kbd> and <kbd>→</kbd>) to switch to the previous and next images respectively.

**Note:** Full size panning requires the inclusion of the [@panzoom/panzoom](https://github.com/timmywil/panzoom) module.  This is not bundled here, but can be included either via a CDN or bundled in your own build tools.  This setting is disabled by default.

#### Example

The below HTML and Javascript will instatiate the image viewer with default settings. Any images, however positioned in the page, will be included in the viewer if they have the selected class.

 * **Full size image** - To provide a full-size version of the image for use in the viewer, include the URL in a `data-full` attribute.  Otherwise, the `src` URL will be used.
 * **Captions** - Captions can be included by following the image with an element with the class `caption`, or with a `<figcaption>` element.
 * **Links** - If an image is wrapped in a link (and linking is enabled - see Configuration below), then a link button will be added to the viewer controls leading to that URL.


```html
<img class="viewer" src="example.png" />
<p class="caption">This is the caption.</p>

…

<img src="example.png" alt="This image isn't used in the viewer" />

…

<figure>
    <a href="https://www.example.com/">
        <img class="viewer" alt="This is the image alt" data-full="example.png" src="example.png" />
    </a>
    <figcaption>This image will have a link button and this caption will be picked up</figcaption>
</figure>
```

```javascript
const iv = new ila.ImageViewer();
iv.create();
```


#### Configuration

The image viewer configuration is used to change the following settings:

* The target class of images to be included
* Whether to enable the download and link buttons
* Whether to use Panzoom (requires the inclusion of the `@panzoom/panzoom module`).
* The text, icons and title attributes for the control buttons.

To make changes to the defaults, pass a config object when instantiating the image viewer. All properties are optional - any provided will be used to over-ride the defaults.

See the [imageViewerConfig](#imageViewerConfig) definition for the available options.

## Javascript documentation

### Classes

<dl>
<dt><a href="#ImageViewer">ImageViewer</a></dt>
<dd><p>Creates an image viewer overlay.</p>
</dd>
<dt><a href="#Scroller">Scroller</a></dt>
<dd><p>Creates an image scroller from a list of images.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#imageViewerConfig">imageViewerConfig</a> : <code>object</code></dt>
<dd><p>The configuration object for the ImageViewer.</p>
</dd>
<dt><a href="#imageViewerButtons">imageViewerButtons</a> : <code>object</code></dt>
<dd><p>The available buttons which can be set in the Image Viewer configuration.
Note that zoom has an additional &#39;active&#39; and &#39;disabled&#39; state setting.</p>
</dd>
<dt><a href="#scrollerConfig">scrollerConfig</a> : <code>object</code></dt>
<dd><p>The configuration object for the Scroller.</p>
</dd>
<dt><a href="#scrollerButtons">scrollerButtons</a> : <code>object</code></dt>
<dd><p>The buttons available for configuration in the Scroller config object.</p>
</dd>
</dl>

<a name="ImageViewer"></a>

### ImageViewer
Creates an image viewer overlay.

**Kind**: global class  
**Access**: public  

* [ImageViewer](#ImageViewer)
    * [new ImageViewer([config])](#new_ImageViewer_new)
    * [imageViewer.create()](#ImageViewer+create)
    * [imageViewer.next()](#ImageViewer+next)
    * [imageViewer.prev()](#ImageViewer+prev)
    * [imageViewer.hide()](#ImageViewer+hide)
    * [imageViewer.show([n])](#ImageViewer+show)
    * [imageViewer.zoomToggle([switchOn])](#ImageViewer+zoomToggle)

<a name="new_ImageViewer_new"></a>

#### new ImageViewer([config])

| Param | Type | Default |
| --- | --- | --- |
| [config] | [<code>imageViewerConfig</code>](#imageViewerConfig) | <code>defaultImageViewerConfig</code> | 

<a name="ImageViewer+create"></a>

#### imageViewer.create()
Create the viewer.
This method should be called after instantiation to activate the viewer.

**Kind**: instance method of [<code>ImageViewer</code>](#ImageViewer)  
**Access**: public  
<a name="ImageViewer+next"></a>

#### imageViewer.next()
Show the next image.

**Kind**: instance method of [<code>ImageViewer</code>](#ImageViewer)  
**Access**: public  
<a name="ImageViewer+prev"></a>

#### imageViewer.prev()
Show the previous image.

**Kind**: instance method of [<code>ImageViewer</code>](#ImageViewer)  
**Access**: public  
<a name="ImageViewer+hide"></a>

#### imageViewer.hide()
Hide the viewer and return to the page.

**Kind**: instance method of [<code>ImageViewer</code>](#ImageViewer)  
**Access**: public  
<a name="ImageViewer+show"></a>

#### imageViewer.show([n])
Show the viewer with the image specified by the given index

**Kind**: instance method of [<code>ImageViewer</code>](#ImageViewer)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [n] | <code>number</code> | <code>0</code> | Index of image to show |

<a name="ImageViewer+zoomToggle"></a>

#### imageViewer.zoomToggle([switchOn])
Set the panzoom status

**Kind**: instance method of [<code>ImageViewer</code>](#ImageViewer)  
**Access**: public  

| Param | Type | Default |
| --- | --- | --- |
| [switchOn] | <code>boolean</code> | <code>true</code> | 

<a name="Scroller"></a>

### Scroller
Creates an image scroller from a list of images.

**Kind**: global class  
**Access**: public  

* [Scroller](#Scroller)
    * [new Scroller(el, [config])](#new_Scroller_new)
    * [scroller.create()](#Scroller+create)
    * [scroller.destroy()](#Scroller+destroy)
    * [scroller.left()](#Scroller+left)
    * [scroller.right()](#Scroller+right)
    * [scroller.scroll([forward])](#Scroller+scroll) ⇒ <code>number</code>

<a name="new_Scroller_new"></a>

#### new Scroller(el, [config])

| Param | Type | Default |
| --- | --- | --- |
| el | <code>HTMLElement</code> |  | 
| [config] | [<code>scrollerConfig</code>](#scrollerConfig) | <code>{}</code> | 

<a name="Scroller+create"></a>

#### scroller.create()
Create the scroller after instantiation.

**Kind**: instance method of [<code>Scroller</code>](#Scroller)  
**Access**: public  
<a name="Scroller+destroy"></a>

#### scroller.destroy()
Destroy the scroller.

**Kind**: instance method of [<code>Scroller</code>](#Scroller)  
**Access**: public  
<a name="Scroller+left"></a>

#### scroller.left()
Scroll to the left.

**Kind**: instance method of [<code>Scroller</code>](#Scroller)  
**Access**: public  
<a name="Scroller+right"></a>

#### scroller.right()
Scroll to the right.

**Kind**: instance method of [<code>Scroller</code>](#Scroller)  
**Access**: public  
<a name="Scroller+scroll"></a>

#### scroller.scroll([forward]) ⇒ <code>number</code>
Scroll in the provided direction and return the pixel offset from origin after scrolling.

**Kind**: instance method of [<code>Scroller</code>](#Scroller)  
**Returns**: <code>number</code> - The pixel offset  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [forward] | <code>boolean</code> | <code>true</code> | Scroll forward (true) or back (false) |


<a name="imageViewerConfig"></a>

### imageViewerConfig : <code>object</code>
The configuration object for the ImageViewer.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [targetClass] | <code>string</code> | <code>&quot;viewer&quot;</code> |  |
| [panzoom] | <code>boolean</code> | <code>false</code> | Activate the zoom button, which toggles the image's full size and allows panning around. Requires @panzoom/panzoom module to be available. |
| [showDownload] | <code>boolean</code> | <code>false</code> | Show a button to download the image |
| [showLink] | <code>boolean</code> | <code>true</code> | Show a link button for any images with a link associated |
| [texts] | [<code>imageViewerButtons</code>](#imageViewerButtons) |  | The inner text of the buttons |
| [texts.cue] | <code>string</code> | <code>&quot;⨁&quot;</code> |  |
| [texts.hide] | <code>string</code> | <code>&quot;ⓧ&quot;</code> |  |
| [texts.download] | <code>string</code> | <code>&quot;⮋&quot;</code> |  |
| [texts.prev] | <code>string</code> | <code>&quot;⮈&quot;</code> |  |
| [texts.next] | <code>string</code> | <code>&quot;⮊&quot;</code> |  |
| [texts.link] | <code>string</code> | <code>&quot;⛓&quot;</code> |  |
| [texts.zoom] | <code>string</code> | <code>&quot;🞕&quot;</code> |  |
| [texts.zoomActive] | <code>string</code> | <code>&quot;🞔&quot;</code> |  |
| [icons] | [<code>imageViewerButtons</code>](#imageViewerButtons) | <code>{}</code> | Classes to add to a span inside each button (for icon display) |
| [titles] | [<code>imageViewerButtons</code>](#imageViewerButtons) |  | Strings to include as title attributes for each button |
| [titles.cue] | <code>string</code> |  |  |
| [titles.hide] | <code>string</code> | <code>&quot;Close&quot;</code> |  |
| [titles.download] | <code>string</code> | <code>&quot;Download this image&quot;</code> |  |
| [titles.prev] | <code>string</code> | <code>&quot;Previous image&quot;</code> |  |
| [titles.next] | <code>string</code> | <code>&quot;Next image&quot;</code> |  |
| [titles.link] | <code>string</code> | <code>&quot;More information&quot;</code> |  |
| [titles.zoom] | <code>string</code> | <code>&quot;Enlarge image (drag to move the image around)&quot;</code> |  |
| [titles.zoomActive] | <code>string</code> | <code>&quot;Reset image to fit screen&quot;</code> |  |
| [titles.zoomDisabled] | <code>string</code> | <code>&quot;Zoom disabled (the image is already full size)&quot;</code> |  |

<a name="imageViewerButtons"></a>

### imageViewerButtons : <code>object</code>
The available buttons which can be set in the Image Viewer configuration.
Note that zoom has an additional 'active' and 'disabled' state setting.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [cue] | <code>string</code> | The cue shown when hovering over an image to indicate the viewer is available. |
| [hide] | <code>string</code> | The button to hide/close the viewer |
| [download] | <code>string</code> | The button to download the current image in the viewer |
| [prev] | <code>string</code> | The button to show the previous image |
| [next] | <code>string</code> | The button to show the next image |
| [link] | <code>string</code> | The button for the image's link |
| [zoom] | <code>string</code> | The button to zoom the image to full size and activate panning |
| [zoomActive] | <code>string</code> | Properties for the zoom button when it's active |
| [zoomDisabled] | <code>string</code> | Properties for the zoom button when it's disabled |

<a name="scrollerConfig"></a>

### scrollerConfig : <code>object</code>
The configuration object for the Scroller.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [classes] | [<code>scrollerButtons</code>](#scrollerButtons) |  | Classes to apply to each button |
| [classes.left] | <code>string</code> | <code>&quot;scroller-left scroller-button&quot;</code> |  |
| [classes.right] | <code>string</code> | <code>&quot;scroller-right scroller-button&quot;</code> |  |
| [texts] | [<code>scrollerButtons</code>](#scrollerButtons) |  | Text content of each button |
| [texts.left] | <code>string</code> | <code>&quot;⮈&quot;</code> |  |
| [texts.right] | <code>string</code> | <code>&quot;⮊&quot;</code> |  |
| [icons] | [<code>scrollerButtons</code>](#scrollerButtons) |  | Icon classes to apply to a span inside each button |
| [titles] | [<code>scrollerButtons</code>](#scrollerButtons) |  | The title attribute for each button |
| [breakpoints] | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | <code>[ [0, 4], [768, 4], [992, 6], [1200, 8] ]</code> | An array of number pairs. Each array entry should be an array containing two numbers, the first representing  a screen width in px and the second representing the number of scroller items to fit at that width and above  (up to the width of the next pair). |

<a name="scrollerButtons"></a>

### scrollerButtons : <code>object</code>
The buttons available for configuration in the Scroller config object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [left] | <code>string</code> | The left/back button |
| [right] | <code>string</code> | The right/forward button |


* * *

&copy; 2021-2023 [licence](LICENCE)
