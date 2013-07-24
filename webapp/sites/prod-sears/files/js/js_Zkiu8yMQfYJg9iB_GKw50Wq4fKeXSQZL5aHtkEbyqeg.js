(function($) {

/**
 * jQuery debugging helper.
 *
 * Invented for Dreditor.
 *
 * @usage
 *   $.debug(var [, name]);
 *   $variable.debug( [name] );
 */
jQuery.extend({
  debug: function () {
    // Setup debug storage in global window. We want to look into it.
    window.debug = window.debug || [];

    args = jQuery.makeArray(arguments);
    // Determine data source; this is an object for $variable.debug().
    // Also determine the identifier to store data with.
    if (typeof this == 'object') {
      var name = (args.length ? args[0] : window.debug.length);
      var data = this;
    }
    else {
      var name = (args.length > 1 ? args.pop() : window.debug.length);
      var data = args[0];
    }
    // Store data.
    window.debug[name] = data;
    // Dump data into Firebug console.
    if (typeof console != 'undefined') {
      console.log(name, data);
    }
    return this;
  }
});
// @todo Is this the right way?
jQuery.fn.debug = jQuery.debug;

})(jQuery);
;
/**
 * @file
 * Adds smooth scrolling to TOC anchor links.
 *
 * From: Scroll window smoothly in jQuery - Animated scroll
 *       http://blog.freelancer-id.com/2009/03/26/scroll-window-smoothly-in-jquery/
 */

(function ($) {

Drupal.tocFilterScrollToOnClick = function() {
  // Make sure links still has hash.
  if (!this.hash || this.hash == '#') {
    return true;
  }

  // Make sure the href is pointing to an anchor link on this page.
  var href = this.href.replace(/#[^#]*$/, '');
  var url = window.location.toString();
  if (href && url.indexOf(href) === -1) {
    return true;
  }

  // Find hash target.
  var $a = $('a[name=' + this.hash.substring(1) + ']');

  // Make hash target is on the current page.
  if (!$a.length) {
    return true;
  }

  // Scroll to hash target
  var duration = Drupal.settings.toc_filter_smooth_scroll_duration || 'medium';
  $('html, body').animate({scrollTop: $a.offset().top}, duration);
  return false;
}

Drupal.behaviors.tocFilterSmoothScroll = {
  attach: function (context) {
    // Only map <a href="#..."> links
    $('a[href*="#"]', context).once('toc-filter').click(Drupal.tocFilterScrollToOnClick);
  }
};

})(jQuery)
;
