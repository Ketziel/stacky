(function( $ ){
	$.fn.stacky = function(options) {

		var defaults = {
			tiles: '.tile',
            tileSizeControler: 'img',
            bestFit: true,
            spacerClass: 'spacer',
            onResize: function(){}
		}
		var options =  $.extend(defaults, options);
		
        var pancake = this;
        

	    pancake.each(function(index) {
            var container = $(this);
            calcAllTileWidths(container, options.tiles, options.tileSizeControler);
            //addSpacerBefore($(this), $(this).find(options.tiles).last(), options.tileSizeControler, options.spacerClass);
            calcAllTileHeights(container, options.tiles, options.tileSizeControler, options.spacerClass);
            bestFit($(this), options.tiles, options.tileSizeControler, options.spacerClass);
            
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
            $(container).find(selector).css('width','');
            var width = getTileWidth($(selector).first(), sizeControl);
            $(container).find(selector).css('width',width);
        }
        
        function calcTileHeight(element, sizeControl){
            element.css('height','');
            var height = element.find(sizeControl).height();
            element.css('height',height);
        }
        
        function calcAllTileHeights(container, selector, sizeControl, spacerClass){
            container.find(selector).each(function(index){
                var d = spacerClass; 
                console.log($(this).attr('class').split(/\s+/));
                if($(this).hasClass(d)){
                    $(this).css('height', 0);
                } else {
                   calcTileHeight($(this), sizeControl);                    
                }
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
            //var r = getTilesInRow(container, selector);
            var a = getColumnHeights(container, selector);
            
            /*var i = 0;
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
            });*/
            $(container).css('height', Math.max.apply(Math, a));            
        }
        
        function getColumnHeights(container, selector){
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
            return a;
        }
        
        function addSpacerBefore(container, element, sizeControl, spacerClass){
            var x = element.clone();
            x.addClass(spacerClass);
            x.contents(':not('+sizeControl+')').remove();
            element.before(x);
        }
        
        function addSpacerAfter(container, element, sizeControl, spacerClass){
            var x = element.clone();
            x.addClass(spacerClass);
            x.contents(':not('+sizeControl+')').remove();
            element.after(x);
        }
        
        function bestFit(container, selector, sizeControl, spacerClass){
            
            if(options.bestFit){
                container.find('.'+spacerClass).remove();
                var rowCount = getTilesInRow(container, selector);
                var lastRowCount = $(container).find(selector).size() % rowCount;
                var a = getColumnHeights(container, selector);
                var lastRow = $(container).find(selector).slice((lastRowCount - (lastRowCount*2))); 

                for (i = 0; i < lastRowCount; i++) { 
                    $(container).find(selector).last().remove();
                }

                lastRow = lastRow.sort(function (a, b) {
                    return $(a).height() < $(b).height() ? 1 : -1;  
                });

                var o = new Array(a.length);
                //var colAssign = Array.apply(null, Array(a.length)).map(function () {return false; })
                var colAssign = $.map(Array.apply(null, Array(a.length)), function () {return false; })
               // var lowOrder = new Array();            

                for (i = 0; i < lastRow.length; i++) {
                    var idx = 0;
                    for (j = 0; j < a.length; j++) {
                        if(a[j] < a[idx] && colAssign[j] == false){
                            idx = j;
                        }
                    }
                    o[idx] = lastRow[i];
                    colAssign[idx] = true;
                }

                var theSpacer = container.find(selector).first().clone();
                theSpacer.addClass(spacerClass);
                theSpacer.contents(':not('+sizeControl+')').remove();

                for (i = 0; i < o.length; i++) {
                        console.log(o[i]); 
                    if(typeof o[i] == 'undefined'){
                        o[i] = theSpacer.clone();
                    }
                }

                $(container).append(o);
                //addSpacerBefore(container, lastRow[1], sizeControl, spacerClass)

                container.find('.'+spacerClass).css('height',0);
            }
            
        }

		$(window).bind('resize',$.proxy(function(){
            
            pancake.each(function(index) {
                var container = $(this);
                $(this).find('.'+options.spacerClass).remove();
                options.onResize();
                calcAllTileWidths(container, options.tiles, options.tileSizeControler);
                calcAllTileHeights(container, options.tiles, options.tileSizeControler, options.spacerClass);
                bestFit($(this), options.tiles, options.tileSizeControler, options.spacerClass);
                calcAllTileTops($(this), options.tiles);
                //$(this).find('.'+options.spacerClass).css('height',0);
            });
            
            
		}, this));
		
	};
})( jQuery );