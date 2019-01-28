/* 
 * jquery.colorwheel.js
 *
 * version: 1.0
 * author: Johnathan Bamber (bamberjp@gmail.com)
 */
(function($) {
	$.fn.colorwheel = function(op, palette) {
		op = op || 'init';
		
		switch (op) {
			case 'init':
				return init(this, palette);
				break;
			case 'value':
				return getValue(this);
				break;
			default:
				break;
		}
		
		function init(elements, palette) {
			palette = palette || [
				"ff0000", 
				"ff6600", 
				"ff9400", 
				"fec500", 
				"ffff00", 
				"8cc700", 
				"0fad00",
				"00a3c7",
				"0064b5",
				"0010a5",
				"6300a5",
				"c5007c"];
			
			var percent = 1 / palette.length;
			var offset = -(percent / 2);
			var r = 0.9;	
			
			$(elements).each( function() {
				var output = "";
					output += "<div class=\"colorwheel-wrapper\">";
				
					output += "<div class=\"colorwheel-selector\"><svg viewBox=\"-1 -1 2 2\">";
					output += "<circle cx=\"0\" cy=\"0\" r=\"" + r + "\" stroke=\"black\" stroke-width=\".001\" fill=\"black\" />"; /* outer circle */
			
				$.each(palette, function(index, value) {
					var p1 = offset + (index * percent);
					var p2 = offset + ((index + 1) * percent);
					
					var x1 = r * Math.cos(2 * Math.PI * p1); 
					var y1 = r * Math.sin(2 * Math.PI * p1);
					
					var x2 = r *  Math.cos(2 * Math.PI * p2); 
					var y2 = r * Math.sin(2 * Math.PI * p2);
					
					var laf = 0;
					
					output += "<g class=\"segment\"><path d=\"M " + x1 + " " + y1 + " A " + r + " " + r + " 0 " + laf + " 1 " + x2 + " " + y2 + " L 0 0\" stroke=\"black\" stroke-width=\".001\" fill=\"#" + value +"\"></path></g>";
				});
			
				output += "<circle cx='0' cy='0' r='.5' stroke='black' stroke-width='.001' fill='white' />";	/* inner circle */
				output += "</svg></div>";
				output += "<input type=\"text\" pattern=\"[a-f0-9]{6}\" readonly=\"readonly\" title=\"Value\" class=\"colorwheel-value\">";
				output += "</div>"; /* end colorwheel-wrapper */
				
				$(this).html(output);
			});
		
			$(elements).find(".segment").click(
				function() {
					var path = $(this).children('path').first();
					var value = $(path).attr('fill').substring(1).toUpperCase();
					var wrapper = $(this).parent().parent().parent();
					var field = $(wrapper).children('.colorwheel-value').first();
					
					$(wrapper).find('.segment.selected').removeClass('selected');
					$(this).addClass('selected');
					$(field).val(value);
				}
			);
		
			$(document).on('keydown', function(e) {
				var keyCode = e.keyCode || e.which;
				var shift = e.shiftKey;
				var element = $(document.activeElement)
				
				if ($(element).hasClass('colorwheel-value')) { /* if current focused element is a colorwheel-value */
					var wrapper = $(element).parent();
					var highlight = $(wrapper).find('.segment.highlight');
				
					if (keyCode == 9) {	/* tab key */
						var segments = $(wrapper).find('.segment:not(.selected)');
						
						if ($(highlight).length) {
							if (!$(segments).last().is($(highlight))) {
								$(highlight).removeClass('highlight');
								
								if (shift) {
									while ($(highlight = $(highlight).prev('.segment')).hasClass('selected')) {}
								} else {
									while ($(highlight = $(highlight).next('.segment')).hasClass('selected')) {}
								}
								
								if ($(highlight).length) {
									$(highlight).addClass('highlight');
									e.preventDefault();
								} else {
									$(this).prev().focus();	/* no previous segment, remove focus on input text */
								}
							} else {
								/* last segment in sequence, perform default */
							}
						} else {
							$(segments).first().addClass('highlight');
							e.preventDefault();
						}
					} else if (keyCode == 13) { /* enter key */
						if ($(highlight).length)
							$(highlight).click();
							$(element).blur();
					}
				}
			});
		
			$('.colorwheel-value').focusin(function() {
				var e = $.Event("keydown");
					e.which = 9;
				$(document).trigger(e);	/* trigger tab */
				
				var value = $(this).val();	/* hack to prevent text selection */
				$(this).val('');
				$(this).val(value);
			});
			
			$('.colorwheel-value').focusout(function() {
				$(this).parent().find('.segment.highlight').removeClass('highlight');	/* remove highlight class */
			});	
			
			return elements;
		}
		
		function getValue(elements) {
			if (elements.length == 1) {
				return $(elements).find('.colorwheel-value').val();
			} else {
				$(elements).each(function() {
					var result = [];
					result.push($(this).find('.colorwheel-value').val());
					return result;
				});
			}
		}
	}
}(jQuery));