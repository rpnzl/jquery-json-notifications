(function ($) {

  $.fn.notifications = function ( options ) {

    // Vars
    var _this = this,   // HTML object
        msgs  = [];     // Current messages

    // Set defaults
    var options = $.extend({
      kind  : 'kind',
      msg   : 'msg',
      delay : 1600,
      speed : 200
    }, options);

    _this.notify = function() {
      if (msgs.length > 0) {
        var msg = msgs.shift();
        var html = $('<p class="notification ' + msg.kind + '">' + msg.msg + '</p>');
        var element = html.appendTo(_this);
        element.slideToggle( options.speed ).delay( options.delay ).slideToggle( options.speed );
      }
    };

    _this.init = function() {
      $(document).ajaxComplete(function(evt, xhr) {

        var res = jQuery.parseJSON(xhr.responseText);

        if (res != null && res[options.kind] != null && res[options.msg] != null) {
          var item = { kind : res[options.kind], msg : res[options.msg] };
          msgs.push(item);
        }

        _this.notify();
      });

      $(document).ajaxError(function(evt, xhr) {
        var msg = xhr.status + ' Error: ' + xhr.statusText;
        var item = { kind : 'error', msg : msg };
        msgs.push(item);
        _this.notify();
      });
    };

    // Build
    _this.init();

  };

})(jQuery);