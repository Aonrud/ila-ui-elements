/**
 * Adds custom swipe events to a given element.
 * 
 * When instantiated, a `swiped-[DIRECTION]` event will be dispatched when that element is swiped.
 * A `swiped` event is also dispatched with the direction in the customEvent.detail, to allow for a single listener if needed.
 * 
 * @public
 * @param {HTMLElement} el The element on which to listen for swipe events.
 * @fires Swipe#swiped
 * @fires Swipe#swiped-up
 * @fires Swipe#swiped-down
 * @fires Swipe#swiped-left
 * @fires Swipe#swiped-right
 */
class Swipe {
	
	constructor(el) {
		this._el = el;
		el.addEventListener('touchstart',
			e => {
				this.startX = e.changedTouches[0].clientX;
				this.startY = e.changedTouches[0].clientY;
			});
		el.addEventListener('touchend',
			e => {
				this.endX = e.changedTouches[0].clientX;
				this.endY = e.changedTouches[0].clientY;
				this._sendEvents();
			});
	}
	
	/**
	 * Event dispatched by any swipe.
	 * @public
	 * @event Swipe#swiped
	 * @type {object}
	 * @property {object} detail
	 * @property {string} detail.direction - The direction of the swipe action.
	 */
	
	/**
	 * Event dispatched on swipe up.
	 * @public
	 * @event Swipe#swiped-up
	 */
	
	/**
	 * Event dispatched on swipe down.
	 * @public
	 * @event Swipe#swiped-down
	 */
	
	/**
	 * Event dispatched on swipe left.
	 * @public
	 * @event Swipe#swiped-left
	 */
	
	/**
	 * Event dispatched on swipe right.
	 * @public
	 * @event Swipe#swiped-right
	 */
	
	/**
	 * Emits events when a swipe action has occurred.
	 * @protected
	 */
	_sendEvents() {
		const extentX = this.endX - this.startX;
		const extentY = this.endY - this.startY;
		let dir = null;
		
		//Horizontal
		if (Math.abs(extentX) > Math.abs(extentY)) {
			dir = extentX > 0 ? "right" : "left";
		}
		
		//Vertical
		if (Math.abs(extentX) < Math.abs(extentY)) {
			dir = extentY > 0 ? "down" : "up";
		}
		
		if (dir) {
			this._el.dispatchEvent( new CustomEvent('swiped', { detail: { direction: dir } }) );
			this._el.dispatchEvent( new CustomEvent(`swiped-${dir}`) );
		}
	}
}

export { Swipe };
