window.slideshow3d = function ($) {
	var transformClass = null,
		addClass = null,
		flat = null,
		helix = null,
		rows = null,
		vertical = null,
		setup = {
			getShape: function(type){
				switch(type){
					case 'vertical':
						return {
							'vertical': true
						};
						break;
					case 'cylinder':
						return {
							'rows': 2
						};
						break;
					case 'ribbon':
						return {
							'flat': false,
							'helix': 1
						};
						break;
					case 'double helix':
						return {
							'flat': false,
							'helix': 2
						};
						break;
					case 'coil':
						return {
							'rows': 2,
							'flat': false
						};
						break;
					case 'ring':
						return {};
						break;
					default:
						return {};
						break;						
				}
			},
			getBrowserTransform: function () {
				var $elem = slideshow3d.children.first();

				if ($elem.css("-webkit-transform") === "none") {
					return "-webkit-";
				}

				if ($elem.css("-moz-transform") === "none") {
					return "-moz-";
				}

				if ($elem.css("-o-transform") === "none") {
					return "-o-";
				}

				if ($elem.css("-ms-transform") === "none") {
					return "-ms-";
				}

				if ($elem.css("transform") === "none") {
					return null;
				}
			},
			setStage: function () {
				var multi = parseInt(slideshow3d.children.length / 4);
				slideshow3d.stage.css(transformClass + 'transform', 'translateZ(' + multi * slideshow3d.children.first().width() * -1 + 'px)');
			},
			transform: function () {
				var length = slideshow3d.children.length,
					count = length;

				while (count) {
					var child = $(slideshow3d.children[length - count]),
						width = child.width() / 6.3,
						height = child.height() / 2,
						rotate = ((length / rows) - count) * 360 / (length / rows),
						translateZ = length / rows * width,
						translateY = 0;
						
						if(!flat){
							if(helix > 1){
								translateY = count%helix * 2;
								translateZ /= 2;
							} 
							else {
								translateY = count / 4;
							}
						}
						else {
							if(rows > 1){
								translateY = parseInt((count-1)/(length / rows)) * 1.5;
							}
						}
						translateY  *= height;
						

					if (rotate > 180) {
						rotate -= 360;
					}

					child
						.css(transformClass + 'transform', 'rotate' + vertical +'( ' + rotate + 'deg ) translateZ(' + translateZ + 'px) translateY(' + translateY + 'px)')
						.attr('data-angle', rotate)
						.attr('data-original-angle', rotate)
						.attr('data-translateZ', translateZ)
						.attr('data-translateY', translateY)
						.addClass(addClass);
					count--;
				}
			},
			setAngles: function (current) {
				var length = slideshow3d.children.length,
					currentAngle = parseInt(current.attr('data-angle')),
					count = length;

				while (count) {
					var child = $(slideshow3d.children[length - count]),
						rotate = parseInt(child.attr('data-angle')),
						origRotate = parseInt(child.attr('data-original-angle')),
						translateZ = parseInt(child.attr('data-translateZ')),
						translateY = parseInt(child.attr('data-translateY'));

					console.log(child);
					if (rotate - currentAngle > 180) {
						rotate -= 360;
					} else if (rotate - currentAngle < -180) {
						rotate += 360;
					}
					
					child
						.css(transformClass + 'transform', 'rotate' + vertical +'( ' + origRotate + 'deg ) translateZ(' + translateZ + 'px) translateY(' + translateY + 'px)')
						.attr('data-angle', rotate);
					count--;
				}
			},
			setElementTransform: function (elem, clicked) {
				var clicked = $(clicked),
					deg = -1 * clicked.attr('data-angle'),
					rotate = parseInt(clicked.attr('data-original-angle')),
					translateZ = parseInt(clicked.attr('data-translateZ')) * 1.6,
					translateY = parseInt(clicked.attr('data-translateY'));
					
					slideshow3d.children.removeClass('current');
					clicked.addClass('current');
					
				$(elem).css(transformClass + 'transform', 'rotate' + vertical +'( ' + deg + 'deg ) translateY(' + translateY * -1 + 'px)');
				clicked.css(transformClass + 'transform', 'rotate' + vertical +'( ' + rotate + 'deg ) translateZ(' + translateZ + 'px) translateY(' + translateY + 'px)');
			}
		};

	return {
		container: null,
		children: null,
		stage: null,
		init: function (options) {
			var	hidden = options.hidden || false,
				transition = options.transition || '1',
				typeOptions = setup.getShape(options.type);

			
			addClass = options.class || 'rotateTarget';
			
			slideshow3d.container = $(options.container) || null
			slideshow3d.stage = $(options.stage) || null;
			slideshow3d.children = slideshow3d.container.children();
			
			helix = parseInt(slideshow3d.children.length / typeOptions.helix) || 1;
			flat = (typeOptions.flat !== false);
			rows = typeOptions.rows || 1;
			vertical = typeOptions.vertical?'X':'Y';

			transformClass = setup.getBrowserTransform();

			slideshow3d.stage.height(slideshow3d.container.height() + 'px');
			slideshow3d.children.height(slideshow3d.container.height() + 'px');
			slideshow3d.children.width(slideshow3d.container.width() + 'px');
			slideshow3d.children.css(transformClass + 'backface-visibility', hidden ? 'hidden' : 'visible');
			slideshow3d.children.css('position', 'absolute');
			slideshow3d.children.css(transformClass + 'transition-duration', transition + 's');

			setup.transform();

			if (slideshow3d.stage !== null) {
				setup.setStage();
				slideshow3d.stage.css(transformClass + 'transition-duration', transition + 's');
			}
	
			$('.' + addClass).click(function (evt) {
				var that = $(this);		
				
				setup.setAngles(that);		
				setup.setElementTransform(slideshow3d.container, that);
				
			});
			
		},
		reset: function(){
			slideshow3d.container.attr('style', '');
			slideshow3d.stage.attr('style', '');
			slideshow3d.children.remove();
		},
		next: function(){
			var current = slideshow3d.container.find('.current').next();
			if( current.length === 0){
				current = slideshow3d.children.first();
			}
			setup.setAngles(current);
			setup.setElementTransform(slideshow3d.container, current);
		},
		prev: function(){
			var current = slideshow3d.container.find('.current').prev();
			if( current.length === 0){
				current = slideshow3d.children.last();
			}
			setup.setAngles(current);
			setup.setElementTransform(slideshow3d.container, current);
		}
	}
}(jQuery);