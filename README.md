This is a set of UI elements created for the [Irish Left Archive](https://www.leftarchive.ie) website. They are provided here under the [GPLv3 licence](LICENCE).

For examples of each component, see the index.html in the demos folder.

They are also in use on the Irish Left Archive website - for a live example see [this document collection](https://www.leftarchive.ie/collection/2041/).

## Use

For the most simple use, include [`dist/ila-ui.min.js`](dist/ila-ui.min.js) and [`dist/ila-ui.min.css`](dist/ila-ui.min.css) in your HTML file then refer to the examples below to use each component.

The package is bundled as an ES6 module [`dist/ila-ui.esm.js`](dist/ila-ui.esm.js) or a UMD [`dist/ila-ui.min.js`](dist/ila-ui.min.js), depending on your preferred development tools.

The CSS is compiled from SASS files. If including the module in your build environment, the file [`src/scss/_variables.scss`](src/scss/_variables.scss) sets the colour variables as defaults so they can be over-ridden if required.

## Components

### Toggler

Use a link or button to toggle the visibility of another element.

The target element to be hidden can be set either directly by passing a `HTMLElement` at instantiation, or by setting the data attribute `data-toggle-target` on the source link/button, containing the ID of the target element.

The button or link text can be changed depending on state -- text provided either directly at instantiation or in the `data-toggle-text` attribute of the button or link will be applied when in the visible/shown state.

#### Example

The below HTML and Javascript will create a button to show/hide the target text using `data-` attributes to set the target and button text.

````html
<<button data-toggle-target="toggle-target" data-toggle-text="Hide text ↑">Show text ↓</button>

<p id="toggle-target">
Et labore dolores aut repudiandae neque. Quos quaerat accusamus et qui qui sit.
Commodi magnam aut ipsam eveniet ipsam reprehenderit qui enim.
</p>

````

Note the below will instantiate all elements that have a `data-toggle-target` attribute, allowing for multiple use.

````javascript
document.querySelectorAll("[data-toggle-target]").forEach( (el) => new ila.Toggler(el) );
````

### Scroller

The scroller turns a list of linked images into a configurable horizontal scroller.

The scroller can be controlled by buttons or by left and right swipe actions.

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

The image viewer enables keyboard and touchscreen navigation when active. Use <kbd>Esc</kbd> or swipe up to close the viewer, and the arrow keys (<kbd>←</kbd> and <kbd>→</kbd>) or left and right swipe to switch to the previous and next images respectively.

**Note:** Full size panning requires the inclusion of the [@panzoom/panzoom](https://github.com/timmywil/panzoom) module.  This is not bundled here, but can be included either via a CDN or bundled in your own build tools.  This setting is disabled by default.

#### Example

The below HTML and Javascript will instatiate the image viewer with default settings. Any images, however positioned in the page, will be included in the viewer if they have the selected class.

 * **Full size image** - To provide a full-size version of the image for use in the viewer, include the URL in a `data-full` attribute.  Otherwise, the `src` URL will be used.
 * **Captions** - Captions can be included in three ways, in this order of priority:
    1. The content of an element whose id matches the `data-caption-id` attribute of the `<img>`
    2. The content of the `data-caption` attribute of the `<img>`
    3. The config.captions CSS selectors. By default this will match a `<figcaption>` or element with `.caption` class, positioned after the `<img>` element or its wrapping `<a>`. (See also the [ImageViewer Config](#imageViewerConfig)).
 * **Links** - If an image is wrapped in a link (and linking is enabled - see [Configuration](#configuration-1) below), then a link button will be added to the viewer controls leading to that URL.


```html
<img class="viewer" src="example.png" />
<p class="caption">This is the caption.</p>

…
<p id="special-caption">This caption is set using data-caption-id.</p>
<img src="example.png" alt="This image isn't used in the viewer" data-caption-id="special-caption" />

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
* CSS selectors used to find the image caption.
* The text, icons and title attributes for the control buttons.

To make changes to the defaults, pass a config object when instantiating the image viewer. All properties are optional - any provided will be used to over-ride the defaults.

See the [imageViewerConfig](#imageViewerConfig) definition for the available options.

## Javascript documentation

### Classes

<dl>
<dt><a href="#Toggler">Toggler</a></dt>
<dd><p>A simple animated visibility toggler.</p>
</dd>
<dt><a href="#Swipe">Swipe</a></dt>
<dd><p>Adds custom swipe events to a given element.</p>
<p>When instantiated, a <code>swiped-[DIRECTION]</code> event will be dispatched when that element is swiped.
A <code>swiped</code> event is also dispatched with the direction in the customEvent.detail, to allow for a single listener if needed.</p>
</dd>
<dt><a href="#Scroller">Scroller</a></dt>
<dd><p>Creates an image scroller from a list of images.</p>
</dd>
<dt><a href="#ImageViewer">ImageViewer</a></dt>
<dd><p>Creates an image viewer overlay.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#scrollerConfig">scrollerConfig</a> : <code>object</code></dt>
<dd><p>The configuration object for the Scroller.</p>
</dd>
<dt><a href="#scrollerButtons">scrollerButtons</a> : <code>object</code></dt>
<dd><p>The buttons available for configuration in the Scroller config object.</p>
</dd>
<dt><a href="#imageViewerConfig">imageViewerConfig</a> : <code>object</code></dt>
<dd><p>The configuration object for the ImageViewer.</p>
</dd>
<dt><a href="#imageViewerButtons">imageViewerButtons</a> : <code>object</code></dt>
<dd><p>The available buttons which can be set in the Image Viewer configuration.
Note that zoom has an additional &#39;active&#39; and &#39;disabled&#39; state setting.</p>
</dd>
</dl>

<a name="Toggler"></a>

### Toggler
A simple animated visibility toggler.

**Kind**: global class  
**Access**: public  

* [Toggler](#Toggler)
    * [new Toggler(source, [target], [toggleText])](#new_Toggler_new)
    * [toggler.toggle()](#Toggler+toggle)
    * [toggler.show()](#Toggler+show)
    * [toggler.hide()](#Toggler+hide)

<a name="new_Toggler_new"></a>

#### new Toggler(source, [target], [toggleText])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source | <code>HTMLElement</code> |  | The element which triggers the toggle, e.g. a `<button>` |
| [target] | <code>HTMLElement</code> \| <code>null</code> | <code></code> | The element of which to toggle the visibility. 						If omitted, the `data-toggle-target` attribute of the source will be checked for an ID. 						If neither is provided, an error is thrown. |
| [toggleText] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The replacement text for the source when its state is toggled. 						If omitted, the `data-toggle-text` attribute of the source will be used. 						If neither is provided, the source text remains static. |

<a name="Toggler+toggle"></a>

#### toggler.toggle()
Toggle the state of the target.

**Kind**: instance method of [<code>Toggler</code>](#Toggler)  
**Access**: public  
<a name="Toggler+show"></a>

#### toggler.show()
Show the target.

**Kind**: instance method of [<code>Toggler</code>](#Toggler)  
**Access**: public  
<a name="Toggler+hide"></a>

#### toggler.hide()
Hide the target.

**Kind**: instance method of [<code>Toggler</code>](#Toggler)  
**Access**: public  
<a name="Swipe"></a>

### Swipe
Adds custom swipe events to a given element.

When instantiated, a `swiped-[DIRECTION]` event will be dispatched when that element is swiped.
A `swiped` event is also dispatched with the direction in the customEvent.detail, to allow for a single listener if needed.

**Kind**: global class  
**Emits**: [<code>swiped</code>](#Swipe+event_swiped), [<code>swiped-up</code>](#Swipe+event_swiped-up), [<code>swiped-down</code>](#Swipe+event_swiped-down), [<code>swiped-left</code>](#Swipe+event_swiped-left), [<code>swiped-right</code>](#Swipe+event_swiped-right)  
**Access**: public  

* [Swipe](#Swipe)
    * [new Swipe(el)](#new_Swipe_new)
    * ["swiped"](#Swipe+event_swiped)
    * ["swiped-up"](#Swipe+event_swiped-up)
    * ["swiped-down"](#Swipe+event_swiped-down)
    * ["swiped-left"](#Swipe+event_swiped-left)
    * ["swiped-right"](#Swipe+event_swiped-right)

<a name="new_Swipe_new"></a>

#### new Swipe(el)

| Param | Type | Description |
| --- | --- | --- |
| el | <code>HTMLElement</code> | The element on which to listen for swipe events. |

<a name="Swipe+event_swiped"></a>

#### "swiped"
Event dispatched by any swipe.

**Kind**: event emitted by [<code>Swipe</code>](#Swipe)  
**Access**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| detail | <code>object</code> |  |
| detail.direction | <code>string</code> | The direction of the swipe action. |

<a name="Swipe+event_swiped-up"></a>

#### "swiped-up"
Event dispatched on swipe up.

**Kind**: event emitted by [<code>Swipe</code>](#Swipe)  
**Access**: public  
<a name="Swipe+event_swiped-down"></a>

#### "swiped-down"
Event dispatched on swipe down.

**Kind**: event emitted by [<code>Swipe</code>](#Swipe)  
**Access**: public  
<a name="Swipe+event_swiped-left"></a>

#### "swiped-left"
Event dispatched on swipe left.

**Kind**: event emitted by [<code>Swipe</code>](#Swipe)  
**Access**: public  
<a name="Swipe+event_swiped-right"></a>

#### "swiped-right"
Event dispatched on swipe right.

**Kind**: event emitted by [<code>Swipe</code>](#Swipe)  
**Access**: public  
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
| [captions] | <code>Array</code> | <code>[ &quot;&amp; + figcaption&quot;, &quot;&amp; + .caption&quot; ]</code> | CSS selectors for the captions. '&' will be replaced with the automatically assigned ID of the anchor around the image. If ':scope' is included, the selector scope is the `<img>` grandparent. |
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



* * *

&copy; 2021-2023 [licence](LICENCE)
