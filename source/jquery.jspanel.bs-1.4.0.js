/* jQuery Plugin jsPanel for bootstrap
   Version: 1.4.0 2014-05-26 10:18
   Dependencies:
    jQuery library ( > 1.7.0 incl. 2.1.0 )
    jQuery.UI library ( > 1.9.0 ) - (at least UI Core, Mouse, Widget, Draggable, Resizable)
    bootstrap version 3.1.1 or greater
    HTML5 compatible browser

   Copyright (c) 2014 Stefan Sträßer, http://stefanstraesser.eu/
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var jsPanelversion = '1.4.0 2014-05-26 10:18';

(function ( $ ) {

    $.fn.jsPanel = function( config , callback ) {

        // tagname des elements an das das jsPanel gehängt wird und window Daten
        // this is the collection on which .jsPanel() is called
        try
        {
            var par = this.first()[0].tagName.toLowerCase();
        }
        catch ( e )
        {
            console.log( e + '\nThe element you want to append the jsPanel to does not exist!' );
        }
        function winscrollTop(){
            return $( window ).scrollTop();
        }
        function winscrollLeft(){
            return $( window ).scrollLeft();
        }
        function winouterHeight(){
            return $( window ).outerHeight();
        }
        function docouterHeight(){
            return $(document ).outerHeight();
        }

        // Extend our default config with those provided.
        // Note that the first arg to extend is an empty object -
        // this is to keep from overriding our "defaults" object.
        var option = $.extend(true, {}, $.fn.jsPanel.defaults, config);

        // Counter für die Panels im jeweils verwendeten Container (für top & left)
        var count = $('.jsPanel', this.first() ).length;

        var jsPanel = $('<div class="jsPanel normalized" style="z-index:1000;display:none;">'+
                            '<nav class="jsPanel-navbar-hdr navbar navbar-default" role="navigation">'+
                                '<!-- Brand and toggle get grouped for better mobile display -->'+
                                '<div class="navbar-header jsPanel-header">'+
                                    '<a class="navbar-brand jsPanel-title" href="#"></a>'+
                                '</div>'+
                                '<!-- Collect the nav links, forms, and other content for toggling -->'+
                                '<div class="collapse navbar-collapse">'+
                                    '<ul class="nav navbar-nav navbar-right jsPanel-controls">'+
                                        '<li class="jsPanel-hdr-r-btn-min"><a   href="#"><span class="glyphicon glyphicon-minus"></span></a></li>'+
                                        '<li class="jsPanel-hdr-r-btn-max"><a   href="#"><span class="glyphicon glyphicon-fullscreen"></span></a></li>'+
                                        '<li class="jsPanel-hdr-r-btn-close"><a href="#"><span class="glyphicon glyphicon-remove"></span></a></li>'+
                                    '</ul>'+
                                '</div><!-- /.navbar-collapse -->'+
                                '<div class="jsPanel-hdr-tb"></div><!-- extra header toolbar -->'+
                            '</nav>'+
                            '<div class="jsPanel-content jsPanel-resize32 panel panel-default">'+
                                '<div class="panel-body"></div>'+
                            '</div>'+
                            '<div class="jsPanel-ftr" style="display:none;">'+
                                '<nav class="jsPanel-navbar-ftr navbar navbar-default" role="navigation">'+
                                    '<!-- Collect the nav links, forms, and other content for toggling -->'+
                                    '<div class="collapse navbar-collapse">'+
                                        '<ul class="nav navbar-nav navbar-right" style="width:100%;">'+
                                        '</ul>'+
                                    '</div><!-- /.navbar-collapse -->'+
                                '</nav>'+
                            '</div>'+
                        '</div>');


        /*
         * DAS OPTIONS-OBJEKT DER FUNKTION .jsPanel() ABARBEITEN
         * und jsPanel ins document einfügen
         */

        /* option.modal  | default: false  */
        if( option.modal )
        {
            if( par == 'body' )
            {
                // necessary for correct positioning of modal when modal appended directly to the body element
                // though I don't really get why !!
                par = null;
            }
            var dh = $(document ).outerHeight() + 'px',
                backdrop = '<div class="jsPanel-backdrop" style="height:' + dh + ';">'+
                           '<div class="jsPanel-backdrop-inner" style="top:' + winscrollTop() + 'px;height:' + winouterHeight() + 'px;"></div></div>';
            // falls vorhanden backdrop entfernen
            $( '.jsPanel-backdrop' ).remove();
            // backdrop wieder einfügen
            $( 'body' ).append( backdrop );
            // jsPanel in backdrop einfügen
            jsPanel.appendTo( $( '.jsPanel-backdrop-inner' ) );
            // jsPanel auf jeden Fall centern
            option.position = 'center';
            commons_MTA( option, jsPanel, 'closeonly' );
            // reposition wenn window gescrollt wird
            window.onscroll = function(){
                $( '.jsPanel-backdrop-inner' ).css( 'top', winscrollTop() + 'px' );
            }
            // various presets for option.modal
            if( option.modal == 'modal-ok' )
            {
                option.toolbarFooter = [
                    {
                        item:     jsPanel_mbtn_ok,                      // button to use
                        btntext:  option.toolbarFooter[0].buttontext,   // buttontext
                        btnclass: option.toolbarFooter[0].buttonclass,  // classname to add to the button
                        event:    'click',
                        callback: option.toolbarFooter[0].callback
                    }
                ]
            }
            else if( option.modal == 'modal-yesno' )
            {
                option.toolbarFooter = [
                    { item: jsPanel_mbtn_yes, btntext: option.toolbarFooter[0].buttontext, btnclass: option.toolbarFooter[0].buttonclass, event: 'click', callback: option.toolbarFooter[0].callback },
                    { item: jsPanel_mbtn_no,  btntext: option.toolbarFooter[1].buttontext, btnclass: option.toolbarFooter[1].buttonclass, event: 'click', callback: option.toolbarFooter[1].callback }
                ]
            }
            else if( option.modal == 'modal-confirm' )
            {
                option.toolbarFooter = [
                    { item: jsPanel_mbtn_confirm, btntext: option.toolbarFooter[0].buttontext, btnclass: option.toolbarFooter[0].buttonclass, event: 'click', callback: option.toolbarFooter[0].callback },
                    { item: jsPanel_mbtn_cancel,  btntext: option.toolbarFooter[1].buttontext, btnclass: option.toolbarFooter[1].buttonclass, event: 'click', callback: option.toolbarFooter[1].callback }
                ]
            }
            else if( option.modal == 'modal-submit' )
            {
                option.toolbarFooter = [
                    { item: jsPanel_mbtn_submit, btntext: option.toolbarFooter[0].buttontext, btnclass: option.toolbarFooter[0].buttonclass, event: 'click', callback: option.toolbarFooter[0].callback },
                    { item: jsPanel_mbtn_cancel, btntext: option.toolbarFooter[1].buttontext, btnclass: option.toolbarFooter[1].buttonclass, event: 'click', callback: option.toolbarFooter[1].callback }
                ]
            }
        }
        else if( option.tooltip )
        {
            commons_MTA( option, jsPanel, 'closeonly' );
            // cursor zurücksetzen, weil draggable deaktiviert
            $('.navbar', jsPanel ).css( 'cursor', 'inherit' );

            var trigger = this.first(),      // element serving as trigger for the tooltip
                parW = trigger.outerWidth(), // width of element serving as trigger for the tooltip
                parH = trigger.height(),     // height of element serving as trigger for the tooltip
                oX, oY;                      // takes the offsets

            // check whether offsets are set
            option.tooltip.offsetX ? ( oX = option.tooltip.offsetX ) : ( oX = 0 );
            option.tooltip.offsetY ? ( oY = option.tooltip.offsetY ) : ( oY = 0 );

            // calc top & left for the various positions
            if(option.tooltip.position == 'top')
            {
                option.position = {
                    top: function(){ return -( option.size.height ) + (oY) + 'px' },
                    left: function(){ return ( parW - option.size.width )/2 + (oX) + 'px' }
                }
            }
            else if(option.tooltip.position == 'bottom')
            {
                option.position = {
                    top: function(){ return parH + (oY) + 'px' },
                    left: function(){ return ( parW - option.size.width )/2 + (oX) + 'px' }
                }
            }
            else if(option.tooltip.position == 'left')
            {
                option.position = {
                    top: function(){ return -( option.size.height/2 ) + ( parH/2 ) + (oY) + 'px' },
                    left: function(){ return -( option.size.width ) + (oX) + 'px' }
                }
            }
            else if(option.tooltip.position == 'right')
            {
                option.position = {
                    top: function(){ return -( option.size.height/2 ) + ( parH/2 ) + (oY) + 'px' },
                    left: function(){ return parW + (oX) + 'px' }
                }
            }

            if( !trigger.parent().hasClass('jsPanel-tooltip-wrapper') )
            {
                // wrap element serving as trigger in a div - will take the tooltip
                trigger.wrap( '<div class="jsPanel-tooltip-wrapper">' );

                if( option.tooltip.mode == 'semisticky' )
                {
                    // tooltip will remain in place until mouse leaves the tooltip
                    jsPanel.hover(
                        function(){ $.noop() },
                        function(){ jsPanel.close() }
                    );
                }
                else if( option.tooltip.mode == 'sticky' )
                {
                    // do nothing - tooltip will remain in place
                    $.noop();
                }
                else
                {
                    option.controls.buttons = false;
                    // tooltip will be removed whenever mouse leaves trigger
                    trigger.mouseout(function(){
                        jsPanel.close();
                    })
                }

                // append tooltip (jsPanel) to the wrapper div
                trigger.parent().append( jsPanel );
            }
        }
        else
        {
            jsPanel.appendTo( this.first() );
        }

        /* EXPERIMENTAL option.rtl ---------------------------------------------------------------------------------- */
        if( option.rtl.rtl === true )
        {
            $( '.jsPanel-controls', jsPanel ).removeClass( 'navbar-right' );
            $( '.jsPanel-header, .jsPanel-title, .jsPanel-hdr-tb', jsPanel ).css( 'float', 'right' );
            $( '.navbar-collapse', jsPanel ).css( 'padding-left', '5px' );
            $( '.jsPanel-navbar-ftr div ul', jsPanel ).css( 'padding-right', '10px' );
            $( '.jsPanel-hdr-r-btn-min', jsPanel ).alterClass( 'jsPanel-hdr-r-btn-min', 'jsPanel-hdr-r-btn-close' );
            $( '.jsPanel-hdr-r-btn-close', jsPanel ).eq(1).alterClass( 'jsPanel-hdr-r-btn-close', 'jsPanel-hdr-r-btn-min' );
            $( '.jsPanel-hdr-r-btn-close a span', jsPanel ).alterClass( 'glyphicon-minus', 'glyphicon-remove' );
            $( '.jsPanel-hdr-r-btn-min a span', jsPanel ).alterClass( 'glyphicon-remove', 'glyphicon-minus' );
            $( '.jsPanel-title, .jsPanel-hdr-tb, .panel-body, .jsPanel-navbar-ftr div ul', jsPanel ).attr( 'dir', 'rtl' );
        }
        if( option.rtl.lang )
        {
            // enables use of lang attr with option.rtl.rtl = false
            $( '.jsPanel-title, .jsPanel-hdr-tb, .panel-body, .jsPanel-navbar-ftr div ul', jsPanel ).attr( 'lang', option.rtl.lang );
        }
        /* ---------------------------------------------------------------------------------------------------------- */

        /* option.title | default: function - (Überschrift) des Panels */
        $( '.jsPanel-title', jsPanel ).append( option.title );

        /* option.id | default: false */
        // wenn option.id -> string oder function?
        if( typeof option.id === 'string' )
        {
            // wenn id noch nicht existiert -> benutzen
            if( $( '#' + option.id ).length < 1 ){
                jsPanel.attr( 'id', option.id );
            }
            else
            {
                // sonst ...
                jsPanel.uniqueId();
                // neue id als Hinweis in den title schreiben
                var txt = $('.jsPanel-title', jsPanel).html();
                $('.jsPanel-title', jsPanel).html( txt + ' AUTO-ID: ' + jsPanel.attr('id') );
            }
        }
        else if( $.isFunction( option.id ) )
        {
            jsPanel.attr( 'id', option.id );
        }

        /* option.header */
        if( option.header == false )
        {
            // remove complete header section
            $( '.jsPanel-navbar-hdr', jsPanel ).remove();
            // CSS corrections for various combinations of header/header toolbar and footer toolbar when header = false
            if( !option.toolbarFooter )
            {
                // if no toolbarFooter is configured and therefore no toolbar at all
                $( '.jsPanel-content', jsPanel ).alterClass( 'jsPanel-resize*', '' );
            }
            else if( option.toolbarFooter )
            {
                // if toolbarFooter is configured
                $( '.jsPanel-content', jsPanel ).alterClass( 'jsPanel-resize*', 'jsPanel-resize40' );
            }
        }
        /* option.controls (buttons in header right) | default: object */
        if( option.controls.buttons === 'closeonly' || option.modal )
        {
            $( '.jsPanel-hdr-r-btn-min, .jsPanel-hdr-r-btn-max', jsPanel ).css('display', 'none');
            $( '.jsPanel-header', jsPanel ).css( 'width', 'calc(100% - 32px)');
        }
        else if( option.controls.buttons === false )
        {
            $( '.jsPanel-hdr-r-btn-min, .jsPanel-hdr-r-btn-max, .jsPanel-hdr-r-btn-close', jsPanel ).css('display', 'none');
        }
        /* font-awesome | bootstrap iconfonts einfügen wenn option.iconfont gesetzt */
        if( option.controls.iconfont )
        {
            if( option.controls.iconfont === 'font-awesome' )
            {
                $( '.jsPanel-hdr-r-btn-close a span', jsPanel ).replaceWith( '<i class="fa fa-times"></i>' );
                $( '.jsPanel-hdr-r-btn-max a span', jsPanel ).replaceWith( '<i class="fa fa-arrows-alt"></i>' );
                $( '.jsPanel-hdr-r-btn-min a span', jsPanel ).replaceWith( '<i class="fa fa-minus"></i>' );
            }
        }

        /* option.toolbarHeader | default: false */
        if( option.toolbarHeader && option.header == true )
        {
            $( '.jsPanel-content', jsPanel ).alterClass( 'jsPanel-resize*', 'jsPanel-resize52' );
            $( '.jsPanel-hdr-tb', jsPanel ).css( 'display', 'block' );
            configToolbar(  option.modal, option.toolbarHeader, '.jsPanel-hdr-tb', jsPanel );
        }

        /* option.toolbarFooter | default: false */
        if( option.toolbarFooter )
        {
            $( '.jsPanel-content', jsPanel ).alterClass( 'jsPanel-resize*', 'jsPanel-resize72' );
            $( '.jsPanel-ftr', jsPanel ).css( { 'display':'block' } );
            // toolbar Elemente einfügen und konfigurieren
            configToolbar( option.modal, option.toolbarFooter, '.jsPanel-ftr .navbar-right', jsPanel, option.rtl.rtl );
            if( option.toolbarHeader && option.header == true )
            {
                $( '.jsPanel-content', jsPanel ).alterClass( 'jsPanel-resize*', 'jsPanel-resize92' );
            }
            else if( option.header == false )
            {
                $( '.jsPanel-content', jsPanel ).alterClass( 'jsPanel-resize*', 'jsPanel-resize40' );
            }
        }
        else
        {
            $( '.jsPanel-ftr', jsPanel ).remove();
        }

        /* option.overflow  | default: 'scroll' */
        if( typeof option.overflow === 'string' )
        {
            $( '.jsPanel-content.panel .panel-body', jsPanel ).css( 'overflow', option.overflow );
        }
        else if ( $.isPlainObject( option.overflow ) )
        {
            $( '.jsPanel-content.panel .panel-body', jsPanel ).css( { 'overflow-y':option.overflow.vertical, 'overflow-x':option.overflow.horizontal } );
        }

        /* option.draggable */
        // default-config für draggable steht in $.fn.jsPanel.defaults.draggable
        if( $.isPlainObject( option.draggable ) )
        {
            // wenn jsPanel ein childpanel ist ...
            if( jsPanel.parent().hasClass('jsPanel-content') )
            {
                option.draggable.containment = 'parent';
            }
            option.customdraggable = $.extend( true, {}, $.fn.jsPanel.defaults.draggable, option.draggable );
            jsPanel.draggable( option.customdraggable );
        }
        else if( option.draggable == 'disabled' )
        {
            // cursor zurücksetzen, weil draggable deaktiviert
            $('.navbar', jsPanel ).css( 'cursor', 'inherit' );
            // jquery ui draggable disabled initialisieren, damit Zustand abgefragt werden kann ( z.B. in minimize()/maximize() )
            jsPanel.draggable({ disabled: true });
        }

        /* option.resizable */
        // default-config für resizable steht in $.fn.jsPanel.defaults.resizable
        if( $.isPlainObject( option.resizable ) )
        {
            option.customresizable = $.extend( true, {}, $.fn.jsPanel.defaults.resizable, option.resizable );
            jsPanel.resizable( option.customresizable );
        }
        else if( option.resizable == 'disabled' )
        {
            // jquery ui resizable disabled initialisieren, damit Zustand abgefragt werden kann ( z.B. in minimize()/maximize() )
            jsPanel.resizable({ disabled: true });
        }

        /* option.content */
        // option.content kann auch eine Funktion (auch IIFE) oder ein jQuery Objekt sein, die den Inhalt zurückliefert
        $( '.jsPanel-content.panel .panel-body' , jsPanel ).append( option.content );

        /* option.load */
        if( $.isPlainObject( option.load ) && option.load.url )
        {
            if( !option.load.data ){
                option.load.data = undefined;
            }
            if( !option.load.complete ){
                var func = $.noop();
            }else{
                func = function( responseText, textStatus, XMLHttpRequest ){
                    option.load.complete( responseText, textStatus, XMLHttpRequest, jsPanel );
                }
            }
            $( '.jsPanel-content.panel .panel-body' , jsPanel ).empty().load( option.load.url, option.load.data, func );
        }

        /* option.ajax */
        if( $.isPlainObject( option.ajax ) )
        {
            $.ajax( option.ajax )
                .done( function( data, textStatus, jqXHR ){
                    $( '.jsPanel-content.panel .panel-body' , jsPanel ).empty().append( data );
                    if( option.ajax.done && $.isFunction( option.ajax.done ) ){
                        option.ajax.done( data, textStatus, jqXHR, jsPanel );
                    }
                })
                .fail( function( jqXHR, textStatus, errorThrown ){
                    if( option.ajax.fail && $.isFunction( option.ajax.fail ) ){
                        option.ajax.fail( jqXHR, textStatus, errorThrown, jsPanel );
                    }
                })
                .always( function( arg1, textStatus, arg3 ){
                    //In response to a successful request, the function's arguments are the same as those of .done(): data(hier: arg1), textStatus, and the jqXHR object(hier: arg3)
                    //For failed requests the arguments are the same as those of .fail(): the jqXHR object(hier: arg1), textStatus, and errorThrown(hier: arg3)
                    if( option.ajax.always && $.isFunction( option.ajax.always ) ){
                        option.ajax.always( arg1, textStatus, arg3, jsPanel );
                    }
                })
                .then( function( data, textStatus, jqXHR ){
                    if( option.ajax.then && $.isArray( option.ajax.then ) ){
                        if( option.ajax.then[0] && $.isFunction( option.ajax.then[0] ) ){
                            option.ajax.then[0]( data, textStatus, jqXHR, jsPanel );
                        }
                    }
                },
                function( jqXHR, textStatus, errorThrown ){
                    if( option.ajax.then && $.isArray( option.ajax.then ) ){
                        if( option.ajax.then[1] && $.isFunction( option.ajax.then[1] ) ){
                            option.ajax.then[1]( jqXHR, textStatus, errorThrown, jsPanel );
                        }
                    }
                }
            )
        }

        /* option.autoclose | default: false */
        if( typeof option.autoclose == 'number' && option.autoclose > 0 )
        {
            var id = jsPanel.attr('id');
            window.setTimeout( function(){
                // func autoclose prüft erst ob es das el noch gibt
                autoclose( jsPanel, id );
            }, option.autoclose )
        }

        /* option.size | default: { width: 400, height: 222 } */
        if( typeof option.size === 'string' && option.size == 'auto' )
        {
            option.size = { width: 'auto', height: 'auto' }
        }
        if( $.isPlainObject( option.size  ) )
        {
            /* CSS WIDTH initialisieren und zuweisen wenn option.size kein string ist */
            if( option.size.width != 'auto' )
            {
                calcSize( 'width' );
            }
            /* CSS HEIGHT initialisieren und zuweisen wenn option.height kein string ist */
            if( option.size.height != 'auto' )
            {
                calcSize( 'height' );
            }
        }
        // calculate size values for width/height
        function calcSize( param )
        {
            if( $.isFunction( option.size[param] ) )
            {
                option.size[param] = option.size[param]( jsPanel );
            }
            else if( typeof option.size[param] == 'string' )
            {
                option.size[param] = option.size[param];
            }
            else if( $.isNumeric( option.size[param] ) )
            {
                option.size[param] = option.size[param];
            }
            else
            {
                option.size.height = $.fn.jsPanel.defaults.size[param];
            }
        }
        // set class for jsPanel-content depending on present header/toolbars
        // and adjust header height if necessary
        if( option.header == false && !option.toolbarFooter ) // kein header, keine toolbars
        {
            $('.jsPanel-content', jsPanel).alterClass( 'jsPanel-resize*', 'jsPanel-resize0' );
        }
        else if( option.header && !option.toolbarHeader && !option.toolbarFooter ) // header, aber keine toolbars
        {
            $('.jsPanel-content', jsPanel).alterClass( 'jsPanel-resize*', 'jsPanel-resize32' );
        }
        else if( option.header && option.toolbarHeader && !option.toolbarFooter ) // header + toolbarHeader, kein toolbarFooter
        {
            $('.jsPanel-content', jsPanel).alterClass( 'jsPanel-resize*', 'jsPanel-resize52' );
            $('.jsPanel-navbar-hdr', jsPanel ).css('height', '52px');
        }
        else if( option.header == false && !option.toolbarHeader && option.toolbarFooter ) // nur toolbarFooter
        {
            $('.jsPanel-content', jsPanel).alterClass( 'jsPanel-resize*', 'jsPanel-resize40' );
        }
        else if( option.header && !option.toolbarHeader && option.toolbarFooter ) // header + toolbarFooter, kein toolbarHeader
        {
            $('.jsPanel-content', jsPanel).alterClass( 'jsPanel-resize*', 'jsPanel-resize72' );
        }
        else if( option.header && option.toolbarHeader && option.toolbarFooter ) // header + toolbarHeader + toolbarFooter
        {
            $('.jsPanel-content', jsPanel).alterClass( 'jsPanel-resize*', 'jsPanel-resize92' );
            $('.jsPanel-navbar-hdr', jsPanel ).css('height', '52px');
        }


        /* css width & height des jsPanels setzen (ist hier erforderlich wenn manuell width & height gesetzt wurde) */
        jsPanel.css( { width: option.size.width, height: option.size.height + 32 + 'px' } );

        /* der folgende code block ermöglicht 'center' für top & left auch dann, wenn width und/oder height 'auto' sind */
        option.size.width = $( jsPanel ).outerWidth();
        option.size.height = $( jsPanel ).innerHeight();

        /* option.position | default: 'auto' */
        if( typeof option.position === 'string' )
        {
            if( option.position == 'center' ){
                option.position = { top: 'center', left: 'center' };
            }
            else if( option.position == 'auto' )
            {
                option.position = { top: 'auto', left: 'auto' };
            }
            else if( option.position == 'top left' ){
                option.position = { top: 0, left: 0 };
            }
            else if( option.position == 'top center' ){
                option.position = { top: 0, left: 'center' };
            }
            else if( option.position == 'top right' ){
                option.position = { top: 0, right: 0 };
            }
            else if( option.position == 'center right' ){
                option.position = { top: 'center', right: 0 };
            }
            else if( option.position == 'bottom right' ){
                option.position = { bottom: 0, right: 0 };
            }
            else if( option.position == 'bottom center' ){
                option.position = { bottom: 0, left: 'center' };
            }
            else if( option.position == 'bottom left' ){
                option.position = { bottom: 0, left: 0 };
            }
            else if( option.position == 'center left' ){
                option.position = { top: 'center', left: 0 };
            }
        }
        if( $.isPlainObject( option.position ) )
        {
            if( option.position.top || option.position.top == 0 )
            {
                calcPosition( 'top', 'height' );
            }
            else if( option.position.bottom  || option.position.bottom == 0 )
            {
                calcPosition( 'bottom', 'height' );
            }

            if( option.position.left || option.position.left == 0 )
            {
                calcPosition( 'left', 'width' );
            }
            else if( option.position.right || option.position.right == 0 )
            {
                calcPosition( 'right', 'width' );
            }
        }
        // calculate position values for top/left/bootom/right
        function calcPosition( position, dimension ){
            if( option.position[position] === 'center' )
            {
                if( par == 'body' )
                {
                    option.position[position] = ( $( window )[dimension]() - parseInt(option.size[dimension]) ) / 2 + 'px';
                }
                else
                {
                    option.position[position] = ( jsPanel.parent()[dimension]() - parseInt(option.size[dimension]) ) / 2 + 'px';
                }
            }
            else if( option.position[position] === 'auto' )
            {
                option.position[position] = (25 * count + 10) + 'px';
            }
            else if( $.isFunction( option.position[position] ) )
            {
                option.position[position] = parseInt( option.position[position]( jsPanel ) ) + 'px';
            }
            else if( $.isNumeric( option.position[position] ) )
            {
                option.position[position] = option.position[position] + 'px';
            }
            else if( typeof option.position[position] == 'string' )
            {
                option.position[position] = option.position[position];
            }
            else
            {
                option.position[position] = (25 * count + 10) + 'px';
            }
        }

        /* CSS top, left, bottom, right, z-index des jsPanels setzen */
        if( option.position.top )
        {
            setCSS( 'top', winscrollTop() );
        }
        else if( option.position.bottom )
        {
            setCSS( 'bottom', winscrollTop() );
        }
        if( option.position.left )
        {
            setCSS( 'left', winscrollLeft() );
        }
        else if( option.position.right )
        {
            setCSS( 'right', winscrollLeft() );
        }
        // set css for top/left/bottom/right
        function setCSS( param, vari ){
            var panelID = jsPanel.attr('id');
            if( par == 'body' )
            {
                if( param == 'bottom' || param == 'right' )
                {
                    document.getElementById( panelID ).style[param] = parseInt( option.position[param] ) - vari + 'px';
                }
                else
                {
                    document.getElementById( panelID ).style[param] = parseInt( option.position[param] ) + vari + 'px';
                }
            }
            else
            {
                if( document.getElementById( panelID ) )
                {
                    document.getElementById( panelID ).style[param] = option.position[param];
                }
            }
        }

        if( $('.jsPanel-backdrop' ).length > 0 )
        {
            var zi = $('.jsPanel-backdrop' ).css('z-index') + 1;
            jsPanel.css('z-index', zi );
        }
        else
        {
            jsPanel.css( 'z-index', set_zi() );
        }




        /*
         * DIE HANDLER FÜR DAS PANEL
         *
         */
        // Handler um Panel in den Vordergrund zu holen
        jsPanel.on('click', function(){
            jsPanel.css( 'z-index', set_zi() );
        });

        if( option.controls.buttons != 'closeonly' && option.controls.buttons != false ){
            // jsPanel minimieren
            $('.jsPanel-hdr-r-btn-min', jsPanel).on('click', function(e){
                e.preventDefault();
                jsPanel.minimize();
            });
            // jsPanel maximieren
            $('.jsPanel-hdr-r-btn-max', jsPanel).on('click', function(e){
                e.preventDefault();
                jsPanel.maximize();
            });
        }
        if( option.controls.buttons != false ) {
            // jsPanel schliessen
            $( '.jsPanel-hdr-r-btn-close', jsPanel ).on( 'click', function ( e ) {
                e.preventDefault(); // important to prevent the window from scrolling back to top
                jsPanel.close();
            } );
        }


        /*
         * jsPanel properties ----------------------------------------------------
         */
        // define jsPanel property with panel content
        jsPanel.content = $( '.jsPanel-content.panel .panel-body' , jsPanel );



        /*
         * METHODEN DES JSPANEL-OBJEKTS
         *
         * Ich habe mich entschieden, die Anzahl der Methoden klein zu halten, weil jQuery selbst
         * ausreichend Funktionalität bereitstellt, die hier verwendet werden kann
         *
         */
        // TITLE TEXT GETTER/SETTER und mehr
        jsPanel.title = function()
        {
            if( arguments.length == 0 )
            {
                // ohne Argument liefert die Funktion das Element das den Titletext enthält
                return $('.jsPanel-title', this);
            }
            else if( arguments.length == 1 && arguments[0] === true )
            {
                // mit Argument true liefert die Funktion den Inhalt des Title-Elements des jsPanels
                return $('.jsPanel-title', this).html();
            }
            else if( arguments.length == 1 && typeof arguments[0] === 'string' )
            {
                // mit Argument string setzt die Funktion den Inhalt des Title-Elements des jsPanels
                $('.jsPanel-title', this).html( arguments[0] );
                return this;
            }
            else
            {
                // in allen anderen Fällen liefert die Funktion das jsPanel an sich
                return this;
            }
        };

        // jsPanel schließen
        jsPanel.close = function()
        {
            // das parent-Element des Panels ermitteln, wird benötigt, um dessen childpanels nach close zu repositionieren wenn minimized
            var context = this.parent(),
                count = context.children('.jsPanel').length;    // Anzahl Panels im context
            // childpanels löschen ...
            jsPanel.closeChildpanels();
            // if present remove tooltip wrapper
            if( this.parent().hasClass('jsPanel-tooltip-wrapper') )
            {
                this.unwrap();
            }
            // remove the jsPanel itself
            this.remove();

            var panelID = jsPanel.attr('id');
            $('body' ).trigger( 'onjspanelclosed', panelID );

            // backdrop entfernen
            $( '.jsPanel-backdrop' ).remove();
            // die minimierten Panels repositionieren
            for (var i = 0 ; i < count-1 ; i++)
            {
                var left = (i * 150) + 'px';
                context.children('.minimized').eq(i).animate({left: left});
            }
            return context;
        };

        // childpanels des jspanels löschen
        jsPanel.closeChildpanels = function()
        {
            $( '.jsPanel', this ).each(function(){
                var pID = $(this).attr('id');
                this.remove();
                $('body' ).trigger( 'onjspanelclosed', pID );
            });
            return this;
        };

        // jsPanel in den Fordergrund holen
        jsPanel.front = function()
        {
            this.css( 'z-index', set_zi() );
            return this;
        };

        // jsPanel Minimieren und Maximieren
        jsPanel.minimize = function()
        {
            if( $( '#jsPanel-min-container' ).length == 0 )
            {
                // wenn der Container für die minimierten jsPanels noch nicht existiert ->
                $( 'body' ).append( '<div id="jsPanel-min-container"></div>' );
            }
            // wenn jsPanel NICHT minimiert ist ...
            if( !this.hasClass( 'minimized' ) )
            {
                // ... sondern normalized und auch nicht maximiert
                if( this.hasClass( 'normalized' ) ){
                    // position, size, parent speichern
                    jsPanel.storeData( jsPanel );
                }
                // counter der minimierten jsPanels und css left für das zu minimierende Panel berechnen
                var count =  $( '.jsPanel.minimized' ).length,
                    left = ( ( count ) * 150 ) + 'px';
                // jsPanel bearbeiten
                this.alterClass( 'normalized maximized', 'minimized' )
                    .animate( { width:'150px' , height:'26px' , left:left , top:0 , opacity:1 , zIndex:1000 } );
                // jquery ui resizable und draggable bei Bedarf deaktivieren
                if( jsPanel.resizable( "option", "disabled" ) === false )
                {
                    this.resizable( "disable" );
                }
                if( jsPanel.draggable( "option", "disabled" ) === false )
                {
                    this.draggable( "disable" );
                }
                // jsPanel in vorgesehenen Container verschieben
                jsPanel.appendTo( '#jsPanel-min-container' );
            }

            return this;
        };

        jsPanel.maximize = function()
        {
            if ( !this.hasClass('normalized') )
            {
                // jsPanel wieder in den Ursprungscontainer verschieben
                this.appendTo( this.data( 'parentElement' ) );
                // jsPanel restore position and size
                if( par == 'body' && option.restoreTo == 'top_left' )
                {
                    // only when jsPanel is appended to body-element AND option.restoreTo is set
                    this.animate({
                        // restore normalized size & an position top left
                        left:   $(window).scrollLeft() + 10 + 'px',
                        top:    $(window).scrollTop() + 10 + 'px',
                        width:  this.data( 'panelWidth' ),
                        height: this.data( 'panelHeight' )
                    });
                }
                else
                {
                    // restore normalized size & safed position
                    this.animate({
                        left:   this.data( 'panelLeft' ),
                        top:    this.data( 'panelTop' ),
                        width:  this.data( 'panelWidth' ),
                        height: this.data( 'panelHeight' )
                    });
                }
                this.alterClass( 'minimized maximized', 'normalized' );
            }
            else
            {
                if ( !this.hasClass('minimized') )
                {
                    // nur wenn jsPanel nicht minimiert ist
                    jsPanel.storeData( jsPanel );
                }
                // wenn jsPanel minimiert ist
                if( this.hasClass('minimized') ){
                    // jsPanel wieder in den Ursprungscontainer verschieben
                    this.appendTo( this.data( 'parentElement' ) );
                }
                // maximale Größe anwenden
                var width =  parseInt( this.parent().outerWidth() , 10 ) - 10 + 'px',
                    height = parseInt( this.parent().outerHeight() , 10 ) - 10 + 'px';

                if( par == 'body' )
                {

                    this.animate( {left: winscrollLeft()+5+'px' , top: winscrollTop()+5+'px' , width: width , height: winouterHeight()-10+'px' } );
                }
                else
                {
                    // sonst
                    this.animate( {left: '5px' , top: '5px' , width: width , height: height} );
                }
                this.alterClass( 'minimized normalized', 'maximized' );
            }
            this.resizable( "enable" ).draggable( "enable" );

            // die minimierten panels repositionieren
            var count = $('.jsPanel.minimized').length;
            for (var i = 0; i < count; i++){
                var left = (i * 150) + 'px';
                $('.jsPanel.minimized').eq(i).animate({left: left});
            }

            return this;
        };

        // Speichert CSS-Werte in data-Property des jsPanels
        jsPanel.storeData = function( panel )
        {
            panel.data({
                'panelWidth':    panel.css( 'width' ),
                'panelHeight':   panel.css( 'height' ),
                'panelTop':      panel.css( 'top' ),
                'panelLeft':     panel.css( 'left' ),
                'parentElement': panel.parent()
            });
        };


        /*
         * PANEL EINBLENDEN .....
         *
         */
        var anim = option.show;
        if( anim.indexOf(" ") == -1 )
        {
            // wenn in anim kein Leerzeichen zu finden ist -> function anwenden
            jsPanel[anim](function(){
                // trigger custom event
                $( jsPanel ).trigger( 'onjspanelloaded', jsPanel.attr('id') );
            });
        }
        else
        {
            // sonst wird es als css animation interpretiert und die class gesetzt
            // does not work with certain combinations of type of animation and positioning
            jsPanel.css( { display:'block', opacity: 1 } )
                   .addClass( option.show )
                   .trigger( 'onjspanelloaded', jsPanel.attr('id') );
        }


        /* css bottom und/oder right in top und left wandeln */
        // ist notwendig, damit resizable und draggable ordentlich funktionieren wenn bottom oder right benutzt wird
        var pos = jsPanel.position();
        if( option.position.bottom )
        {
            jsPanel.css( { 'top': parseInt(pos.top) + 'px', 'bottom': '' } );
        }
        if( option.position.right )
        {
            jsPanel.css( { 'left': parseInt(pos.left) + 'px', 'right': '' } );
        }




        /*
         * CALLBACK AUFRUFEN WENN VORHANDEN
         *
         */
        if( arguments.length == 1 && $.isFunction( arguments[0] ) )
        {
            arguments[0]( jsPanel );
        }
        else if( callback && $.isFunction( callback ) )
        {
            // der callback bekommt das jsPanel als Argument 'jsPanel' übergeben
            callback( jsPanel );
        }


        /*
         * RETURN-WERT IST DAS PANEL SELBST
         *
         */
        return jsPanel;

    };

    /*
     * PLUGIN DEFAULTS - added as a property on our plugin function
     *
     */
    $.fn.jsPanel.defaults = {
        "ajax":          false,
        "autoclose":     false,
        "content":       false,
        "controls":      {
                            buttons:  true,
                            iconfont: false
                         },
        "draggable":     {
                            handle:      '.navbar',
                            stack:       '.jsPanel',
                            opacity:     0.6
                         },
        "header":        true,
        "id":            function(){
                            $(this).first().uniqueId()
                         },
        "load":          false,
        "modal":         false,
        "overflow":      'hidden',
        "position":      'auto',
        "resizable":     {
                            handles:     'e, s, w, se, sw',
                            autoHide:    false,
                            minWidth:    150,
                            minHeight:   93
                         },
        "restoreTo":     false,
        "rtl":           {
                            rtl: false
                         },
        "show":          'fadeIn',
        "size":          {
                            width:  400,
                            height: 222
                         },
        "title":         function(){
                            return 'jsPanel No ' + ( $('.jsPanel').length + 1 )
                         },
        "toolbarFooter": false,
        "toolbarHeader": false,
        "tooltip":       false
    };

    /*
     * UTILITY FUNCTIONS for internal use
     *
     */
    // Funktion bildet einen Wert für css z-index
    function set_zi(){
        var zi = 0;
        $('.jsPanel').each( function(){
            if( $(this).zIndex() > zi ){
                zi = $(this).zIndex();
            }
        });
        return zi + 1;
    }

    // common settings for modal, tooltip, alert
    function commons_MTA( option, jsPanel, controls ){
        // draggable & resizable NICHT inizialisieren, nur close button einblenden, cursor
        option.resizable = false;
        option.draggable = false;
        option.controls.buttons = controls;
        $('.jsPanel-hdr, .jsPanel-hdr-l, .jsPanel-ftr', jsPanel ).css( 'cursor', 'default' );
    }

    // bestückt die Toolbars mit Inhalt
    function configToolbar( optionModal, optionToolbar, cssToolbar, panel, rtl ){
        if( typeof optionToolbar === 'string' )
        {
            // wenn toolbarFooter ein string ist -> einfügen
            $( cssToolbar, panel ).append( optionToolbar );
        }
        else if( $.isArray( optionToolbar ) )
        {
            for( i = 0; i < optionToolbar.length; i++ )
            {
                if( typeof optionToolbar[i] === 'object' )
                {
                    var el = $( optionToolbar[i].item ),                        // Änderung in 1.3.0
                        type = el.prop('tagName');                              // Änderung in 1.3.0
                    if( typeof optionModal === 'string' && type == 'BUTTON' )   // Änderung in 1.3.0
                    {
                        // set text of button
                        el.append( '&nbsp;' + optionToolbar[i].btntext );
                        if( rtl == true || rtl == 'bootstrap-rtl')
                        {
                            el.css( 'float', 'left' );
                        }
                        // add class to button
                        if( typeof optionToolbar[i].btnclass == 'string' ){
                            el.addClass( optionToolbar[i].btnclass );
                        }
                        else
                        {
                            el.addClass( 'btn-sm' );
                        }
                    }
                    $( cssToolbar, panel ).append( el );
                    el.bind( optionToolbar[i].event, optionToolbar[i].callback );
                }
            }
        }
    }

    // wird in option.autoclose verwendet und prüft vor Anwendung von .close() ob es das jsPanel überhaupt noch gibt
    function autoclose( jsPanel, id ){
        var elmt = $('#' + id );
        if( elmt ){
            elmt.fadeOut('slow', function(){
                jsPanel.close(); // elmt geht hier nicht weil .close() nicht für elmt definiert ist
            });
        }
    }


    /*
     * jQuery alterClass plugin
     *
     * Remove element classes with wildcard matching. Optionally add classes:
     * $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
     *
     * Copyright (c) 2011 Pete Boere (the-echoplex.net)
     * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
     *
     */
    $.fn.alterClass = function ( removals, additions ) {
        var self = this;
        if ( removals.indexOf( '*' ) === -1 ) {
        // Use native jQuery methods if there is no wildcard matching
            self.removeClass( removals );
            return !additions ? self : self.addClass( additions );
        }

        var patt = new RegExp( '\\s' +
            removals.
                replace( /\*/g, '[A-Za-z0-9-_]+' ).
                split( ' ' ).
                join( '\\s|\\s' ) +
            '\\s', 'g' );

        self.each( function ( i, it ) {
            var cn = ' ' + it.className + ' ';
            while ( patt.test( cn ) ) {
                cn = cn.replace( patt, ' ' );
            }
            it.className = $.trim( cn );
        });

        return !additions ? self : self.addClass( additions );
    };

    /* Templates */
    // for the modal buttons in the footer toolbar
    var jsPanel_mbtn_ok      = '<button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span></button>',
        jsPanel_mbtn_yes     = '<button type="button" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span></button>',
        jsPanel_mbtn_no      = '<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>',
        jsPanel_mbtn_cancel  = '<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>',
        jsPanel_mbtn_confirm = '<button type="button" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span></button>',
        jsPanel_mbtn_submit  = '<button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span></button>',
        jsPanel_mbtn_close   = '<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-off"></span></button>',
        jsPanel_mbtn_login   = '<button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-log-in"></span></button>';

}( jQuery ));
