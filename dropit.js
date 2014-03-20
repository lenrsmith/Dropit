/*
 * Dropit v1.0
 * http://dev7studios.com/dropit
 *
 * Copyright 2012, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {
    $.fn.dropit = function(method) {
        var buildOptions = function(o){
            var str  = '<ul>',
                settings = $.fn.dropit.settings;
            for(var i = 0; i < o.length; i++){
                str += "<li data-id='"+o[i].value+"''>"+o[i].label;
                if(settings.remove === ""){
                    str+="</li>";
                } else {
                    str+="<span class='delete'>X</span></li>";
                }
            }
            str += '</ul>';

            return str;
        };

        var updateOptions = function(el, data){
            var $el = $(el),
                 settings = $.fn.dropit.settings;

            $ulwrap = $el.closest('ul');
            var submenu = buildOptions(data);
            $ulwrap.find('>li>ul').remove();
            $ulwrap.find('>li').append(submenu);

            $ulwrap.find('>li li').hover(function(e){
                $(this).addClass('dropit-highlighted');
            }, function(e){
                $(this).removeClass('dropit-highlighted');
            });

            $ulwrap.find('>li li').click(function(e){
                var del = $(this).clone();
                del.find('span').remove();
                $el.val(del.html());
            });

            $ulwrap.find('>li li span.delete').click(function(e){
                e.stopPropagation();
                var el = $(this);
                $.ajax({
                    url: settings.remove,
                    data: {id: $(this).closest('li').attr('data-id')},
                    dataType: 'json',
                    type: 'GET'
                }).fail(function(xhr, textStatus, errorThrown){
                    Messenger().post({
                        message:"There was an error processing your request.\nERROR: "+textStatus,
                        showCloseButton: true
                    });
                }).done(function(data, textStatus, xhr){
                    if(data.response === 0){
                        alert(data.message);
                    } else if(data.response == 1) {
                        el.closest('li').remove();
                    }
                });
            });

            // Hide initial submenus
            $ulwrap.find('>'+ settings.triggerParentEl +':has('+ settings.submenuEl +')').addClass('dropit-trigger')
            .find(settings.submenuEl).addClass('dropit-submenu').hide();
            
            // Open on click
            $ulwrap.on(settings.action, settings.triggerParentEl +':has('+ settings.submenuEl +') > '+ settings.triggerEl +'', function(){
                if($(this).parents(settings.triggerParentEl).hasClass('dropit-open')) return false;
                settings.beforeHide.call(this);
                $('.dropit-open').removeClass('dropit-open').find('.dropit-submenu').hide();
                settings.afterHide.call(this);
                settings.beforeShow.call(this);
                $(this).parents(settings.triggerParentEl).addClass('dropit-open').find(settings.submenuEl).show();
                settings.afterShow.call(this);
                return false;
            });
            
            // Close if outside click
            $(document).on('click', function(){
                settings.beforeHide.call(this);
                $('.dropit-open').removeClass('dropit-open').find('.dropit-submenu').hide();
                settings.afterHide.call(this);
            });
            
            settings.afterLoad.call(this);
        };

        var methods = {

            init : function(options) {
                this.dropit.settings = $.extend({}, this.dropit.defaults, options);
                var el = this,
                    $el = $(el),
                    settings = $.fn.dropit.settings;
                return this.each(function() {
                    // Setup the element
                    $el.wrap('<ul class="dropit"><li></li></ul>');
                    $el.attr('autocomplete', 'off');
                    if(settings.source_type.toLowerCase() == 'array' ){
                        updateOptions(el, settings.source);
                    } else if(settings.source_type.toLowerCase() == 'ajax') {
                        $.ajax({
                            url: settings.source,
                            dataType: 'json',
                            type: 'GET'
                        }).fail(function(xhr, textStatus, errorThrown){
                            Messenger().post({
                                message:"There was an error processing your request.\nERROR: "+textStatus,
                                showCloseButton: true
                            });
                        }).done(function(data, textStatus, xhr){
                            updateOptions(el, data);
                        });
                    }
                });
            },

            update : function(data) {
                var el = this,
                    settings = $.fn.dropit.settings;
                return this.each(function(){
                    updateOptions(el, data);
                });
            }
        };

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method "' +  method + '" does not exist in dropit plugin!');
        }

    };

    $.fn.dropit.defaults = {
        action: 'click', // The open action for the trigger
        submenuEl: 'ul', // The submenu element
        triggerEl: 'a', // The trigger element
        triggerParentEl: 'li', // The trigger parent element
        afterLoad: function(){}, // Triggers when plugin has loaded
        beforeShow: function(){}, // Triggers before submenu is shown
        afterShow: function(){}, // Triggers after submenu is shown
        beforeHide: function(){}, // Triggers before submenu is hidden
        afterHide: function(){} // Triggers before submenu is hidden
    };

    $.fn.dropit.settings = {};

})(jQuery);