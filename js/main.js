/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function () {
  var hiddenNavBar = $(".navbar.navbar-hidden-top");

  if (hiddenNavBar.length) {
    if (hiddenNavBar.offset().top > 50) {
      $(".navbar-custom").addClass("top-nav-collapse");
    } else {
      $(".navbar-custom").removeClass("top-nav-collapse");
    }
  }
});

$(function () {
  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $("a.page-scroll").bind("click", function (event) {
    var $anchor = $(this);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr("href")).offset().top,
        },
        1500,
        "easeInOutExpo"
      );
    event.preventDefault();
  });

  NOTIFICATION_COOKIE = "c<3n";

  var hasSeenNotification = function () {
    return new RegExp(NOTIFICATION_COOKIE + "=" + "1").test(document.cookie);
  };

  var markNotificationAsRead = function () {
    document.cookie = NOTIFICATION_COOKIE + "=1;max-age=99999;path=/";
    toggleNotificationIcon(false);
  };

  var toggleNotificationIcon = function (show) {
    $(".notification-link").toggleClass("notify", show);
  };

  if (!hasSeenNotification()) toggleNotificationIcon(true);

  $(document).on("show.bs.modal", markNotificationAsRead);

  // Closes the Responsive Menu on Menu Item Click
  $(".navbar-collapse ul li a").click(function () {
    $(".navbar-toggle:visible").click();
  });

  $("nav").on("show.bs.collapse", function () {
    $(this).addClass("is-expanded");
  });

  $("nav").on("hide.bs.collapse", function () {
    $(this).removeClass("is-expanded");
  });

  // GA Tracking
  $(".ga-email-nav").click(function () {
    ga("send", "event", "Email Signup", "Open Form", "Nav Bar");
  });

  $(".ga-email-etc-coming-soon").click(function () {
    ga("send", "event", "Email Signup", "Open Form", "ETC - Coming Soon");
  });

  // RSVP slider value update
  $("#likelihood").on("input", function () {
    $("#likelihood-value").text(this.value + "%");
  });

  // Language slider EN(0)/ES(1)
  var $langSlider = $("#langSlider");
  var $enText = $("#rsvp-text-en");
  var $esText = $("#rsvp-text-es");
  var LANG_KEY = "siteLang"; // 'en' or 'es'

  function updateLanguage(shouldPersist) {
    var isES = $langSlider.val() === "1";
    if (isES) {
      $enText.hide();
      $esText.show();
    } else {
      $esText.hide();
      $enText.show();
    }

    // Toggle label language visibility
    var $form = $(".rsvp-form");
    $form.find(".label-en").toggle(!isES);
    $form.find(".label-es").toggle(isES);

    // Update placeholders based on selected language
    $form.find("[data-ph-en][data-ph-es]").each(function(){
      var $el = $(this);
      var ph = isES ? $el.data('ph-es') : $el.data('ph-en');
      if (typeof ph !== 'undefined') $el.attr('placeholder', ph);
    });

    if (shouldPersist) {
      try { localStorage.setItem(LANG_KEY, isES ? 'es' : 'en'); } catch(e) {}
    }
  }

  if ($langSlider.length) {
    // Initialize from saved preference (default to EN)
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'es') { $langSlider.val(1); }
      else { $langSlider.val(0); }
    } catch(e) {}

    $langSlider.on("input change", function(){ updateLanguage(true); });
    updateLanguage(false);

    // Make EN/ES labels clickable to toggle slider
    $(".lang-option").on("click", function () {
      var val = $(this).data('lang') === 'es' ? 1 : 0;
      $langSlider.val(val).trigger("change");
    });
  }
});
