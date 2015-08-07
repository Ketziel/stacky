(function( $ ){
	$.fn.stacky = function(options) {

		var defaults = {
			tiles: '.tile',
            tileSizeControler: 'img'
		};
		var options =  $.extend(defaults, options);
		
        var pancake = this;
        

	    pancake.each(function(index) {
            var container = $(this);
            calcAllTileWidths(container, options.tiles, options.tileSizeControler);
            calcAllTileHeights(container, options.tiles, options.tileSizeControler);
            
            calcAllTileTops(container, options.tiles);
            
            //console.log('return:'+getTilesInRow(container, options.tiles));
            
            
            //console.log(getTileAtPosition(container, options.tiles, 4).html());
            
            
            /*container.find(options.tiles).each(function(index){
                calcTileHeight($(this), options.tileSizeControler);
            });*/
		});
        
        function getTileWidth(element, sizeControl){
            return element.find(sizeControl).width().floor;
        }
        
        function calcAllTileWidths(container, selector, sizeControl){
            var width = getTileWidth($(selector).first(), sizeControl);
            $(container).find(selector).css('width',width);
        }
        
        function calcTileHeight(element, sizeControl){
            var height = element.find(sizeControl).height();
            element.css('height',height);
        }
        
        function calcAllTileHeights(container, selector, sizeControl){
            container.find(selector).each(function(index){
                calcTileHeight($(this), sizeControl);
                //getTileAbove(container, $(this), selector);
            });
        }
        
        function getTilesInRow(container, selector){
            var containerWidth = container.width();
            //console.log(containerOuterWidth);
            var tileOuterWidth = container.find(selector).outerWidth( true );
            var count = containerWidth / tileOuterWidth;
            //console.log(Math.floor(count));
            return Math.floor(count);
        }
        
        function calcTileTop(container, element, selector){
            var above = getTileAbove(container, element, selector);
            if (above !=  false){
                var elOffset = $(element).offset().top;
                var abOffset = $(above).offset().top;
                var space = elOffset - abOffset - $(above).outerHeight( true );
                $(element).css('top',(space-(space*2)));
            }
        }
        
        function calcAllTileTops(container, selector){
            container.find(selector).each(function(index){
                $(this).css('top','0');
                calcTileTop(container, $(this), selector);
            });
            calcWrapperHeight(container, selector);
        }
        
        function getTileAtPosition(container, selector, idx){
            var i = 0;
            var tile = false;
            $(container).find(selector).each(function(){
                if (idx == i){
                    tile = $(this);   
                    return false;
                }
                i++;
            });
            return tile;
        }
        
        function getTilePosition(container, element, selector){
            //selector refers to tile selector
            var i = 0;
            var idx = false;
            container.find(selector).each(function(){
                if ($(element).get(0) == $(this).get(0)){
                    idx = i;
                    return false;
                }
                i++;
            });
            return idx;
            //console.log($(this).index(selector));
        }
        
        function getTileAbove(container, element, selector){
            var r = getTilesInRow(container, selector);
            var c = getTilePosition(container, element, selector);
            if (c > (r-1)){
                return getTileAtPosition(container, selector, c - r);
            } else {
                return false;
            }
        }
        
        function calcWrapperHeight(container, selector){
            var r = getTilesInRow(container, selector);
            var a = new Array();
            
            var i = 0;
            container.find(selector).each(function(index){
                if (a[i] > 0){
                    a[i] = a[i] + $(this).outerHeight(true);
                } else {
                    a[i] = $(this).outerHeight(true);
                }
                if (i < r-1){
                    i++
                } else {
                    i = 0;   
                }
            });
            $(container).css('height', Math.max.apply(Math, a));            
        }

		$(window).bind('resize',$.proxy(function(){
            
            pancake.each(function(index) {
                calcAllTileTops($(this), options.tiles);
            });
            
            
            
		}, this));
		
	};
})( jQuery );
