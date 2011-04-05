window.slideshow3d = function ($) {
	var transformClass = null,
		children = null,
		stage = null,
		addClass = null,
		setup = {
			getBrowserTransform: function () {
				var $elem = children.first();

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
				var multi = parseInt(children.length / 4);
				stage.css(transformClass + 'transform', 'translateZ(' + multi * children.first().width() * -1 + 'px)');
			},
			transform: function () {
				var length = children.length,
					count = length;

				while (count) {
					var child = $(children[length - count]),
						ratio = count / length,
						width = child.width() / 6.3,
						rotate = (length - count) * 360 / length,
						translate = length * width;


					if (rotate > 180) {
						rotate -= 360;
					}

					child
						.css(transformClass + 'transform', 'rotateY( ' + rotate + 'deg ) translateZ(' + translate + 'px)')
						.attr('data-angle', rotate)
						.attr('data-original-angle', rotate)
						.attr('data-translate', translate)
						.addClass(addClass);
					count--;
				}
			},
			setAngles: function (current) {
				var length = children.length,
					currentAngle = parseInt(current.attr('data-angle')),
					count = length;

				while (count) {
					var child = $(children[length - count]),
						rotate = parseInt(child.attr('data-angle')),
						origRotate = parseInt(child.attr('data-original-angle')),
						translate = parseInt(child.attr('data-translate'));

					if (rotate - currentAngle > 180) {
						rotate -= 360;
					} else if (rotate - currentAngle < -180) {
						rotate += 360;
					}
					
					child
						.css(transformClass + 'transform', 'rotateY( ' + origRotate + 'deg ) translateZ(' + translate + 'px)')
						.attr('data-angle', rotate);
					count--;
				}
			},
			getElementTransform: function (elem) {
				return ($(elem).attr('data-angle'));
			},
			setElementTransform: function (elem, clicked) {
				var	deg = -1 * setup.getElementTransform(clicked),
					value = 'RotateY(' + deg + 'deg)';
				$(elem).css(transformClass + 'transform', value);
			}
		};

	return {
		init: function (options) {
			var container = $(options.container) || null,
				hidden = options.hidden || false,
				transition = options.transition || '1';

			addClass = options.class || 'rotateTarget';
			stage = $(options.stage) || null;
			children = container.children();

			transformClass = setup.getBrowserTransform();

			stage.height(container.height() + 'px');
			children.height(container.height() + 'px');
			children.width(container.width() + 'px');
			children.css(transformClass + 'backface-visibility', hidden ? 'hidden' : 'visible');
			children.css('position', 'absolute');
			children.css(transformClass + 'transition-duration', transition + 's');

			setup.transform();

			if (stage !== null) {
				setup.setStage();
				stage.css(transformClass + 'transition-duration', transition + 's');
			}
	
			$('.' + addClass).click(function (evt) {
				var that = $(this),
					multi = parseInt(children.length / 4),
					rotate = parseInt(that.attr('data-original-angle')),
					translate = parseInt(that.attr('data-translate')) * 1.6;
					
				setup.setElementTransform(container, that);
				setup.setAngles(that);
				
				that.css(transformClass + 'transform', 'rotateY( ' + rotate + 'deg ) translateZ(' + translate + 'px)');
			});
			
		},
		reset: function(options){
			var container = $(options.container) || null,
				stage = $(options.stage) || null,
				children = container.children();
			
			container.attr('style', '');
			stage.attr('style', '');
			children.remove();
		}
	}
}(jQuery);