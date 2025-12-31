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

  // Google Analytics tracking removed - ga object not initialized

  // RSVP slider value update
  $("#likelihood").on("input", function () {
    $("#likelihood-value").text(this.value + "%");
  });

  // Language slider EN(0)/ES(1) - Site-wide toggle
  var $langSlider = $("#langSlider");
  var LANG_KEY = "siteLang"; // 'en' or 'es'
  var isLangAnimating = false;

  function applyLanguageToBlocks(isES) {
    // Toggle inline label spans globally
    $(".label-en").toggle(!isES);
    $(".label-es").toggle(isES);

    // Toggle generic language content blocks by class
    $(".lang-en").toggle(!isES);
    $(".lang-es").toggle(isES);

    // Update placeholders site-wide for inputs having data-ph-en / data-ph-es
    $("[data-ph-en][data-ph-es]").each(function () {
      var $el = $(this);
      var ph = isES ? $el.data("ph-es") : $el.data("ph-en");
      if (typeof ph !== "undefined") $el.attr("placeholder", ph);
    });

    // Also set document language attribute for accessibility
    try {
      document.documentElement.setAttribute("lang", isES ? "es" : "en");
    } catch (e) {}
  }

  function updateLanguage(shouldPersist) {
    var isES = parseFloat($langSlider.val()) >= 0.5;

    // Apply globally
    applyLanguageToBlocks(isES);

    // Persist preference
    if (shouldPersist) {
      try {
        localStorage.setItem(LANG_KEY, isES ? "es" : "en");
      } catch (e) {}
    }
  }

  if ($langSlider.length) {
    // Initialize from saved preference (default to EN)
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === "es") {
        $langSlider.val(1);
      } else {
        $langSlider.val(0);
      }
    } catch (e) {}

    // Apply on load without persisting
    updateLanguage(false);

    // React to slider changes
    $langSlider.on("input change", function () {
      if (!isLangAnimating) {
        updateLanguage(true);
      }
    });

    // Smoothly animate slider to a target value (0 or 1)
    function animateLangSliderTo(target, duration) {
      duration = duration || 220; // ms
      var start = parseFloat($langSlider.val());
      var end = target;
      if (start === end) {
        // No movement needed; still ensure language is correct
        updateLanguage(true);
        return;
      }
      var startTime = null;
      isLangAnimating = true;

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function step(ts) {
        if (startTime === null) startTime = ts;
        var elapsed = ts - startTime;
        var t = Math.min(1, elapsed / duration);
        var eased = easeInOutCubic(t);
        var value = start + (end - start) * eased;
        // Update visual position without triggering change handlers
        $langSlider.val(value);
        if (t < 1) {
          window.requestAnimationFrame(step);
        } else {
          // Snap to final value and apply language once
          $langSlider.val(end);
          isLangAnimating = false;
          updateLanguage(true);
        }
      }

      window.requestAnimationFrame(step);
    }

    // Make EN/ES labels clickable to toggle slider (animate instead of jump)
    $(".lang-option").on("click", function () {
      var target = $(this).data("lang") === "es" ? 1 : 0;
      animateLangSliderTo(target, 220);
    });

    // Override default click/tap on the slider: toggle instead of landing mid-way
    function getClientX(evt) {
      var e = evt.originalEvent || evt;
      if (e.touches && e.touches.length) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length)
        return e.changedTouches[0].clientX;
      return e.clientX;
    }

    function handleToggleFromPointer(evt) {
      // Ignore if we're mid-animation
      if (isLangAnimating) return;
      try {
        evt.preventDefault();
        evt.stopPropagation();
      } catch (e) {}
      var rect = $langSlider[0].getBoundingClientRect();
      var x = getClientX(evt) - rect.left;
      var ratio = Math.max(0, Math.min(1, x / rect.width));
      var target = ratio >= 0.5 ? 1 : 0;
      // Focus for accessibility/keyboard continuity
      try {
        $langSlider[0].focus();
      } catch (e) {}
      animateLangSliderTo(target, 220);
    }

    // Bind to pointer/mouse/touch start so the native slider doesn't jump first
    $langSlider.on("pointerdown", handleToggleFromPointer);
    $langSlider.on("mousedown", handleToggleFromPointer);
    $langSlider.on("touchstart", handleToggleFromPointer);
  } else {
    // No slider on the page: still respect saved preference and apply globally
    try {
      var savedOnly = localStorage.getItem(LANG_KEY);
      applyLanguageToBlocks(savedOnly === "es");
    } catch (e) {}
  }

  // RSVP Form Submission Handler (FormEasy)
  var $rsvpForm = $("#rsvp-form");
  if ($rsvpForm.length) {
    var $submitBtn = $rsvpForm.find('button[type="submit"]');
    var originalBtnTextEN = "Submit RSVP";
    var originalBtnTextES = "Enviar confirmación";
    var loadingTextEN = "Submitting...";
    var loadingTextES = "Enviando...";

    // Replace this with your actual Google Apps Script Web App URL
    var FORM_ENDPOINT =
      "https://script.google.com/macros/s/AKfycbxD3Nd2hRkMnC7Bqu3odO_AVOzgpLMRkl_0NCjafhgV1PiWwPKzVmEiwdt2qahWggfm/exec";

    // Replace this with your reCAPTCHA v3 site key
    var RECAPTCHA_SITE_KEY = "6LcGajwsAAAAAId2rBkCEIPZO5qhVmbi9i_NkQQf";

    $rsvpForm.on("submit", function (e) {
      e.preventDefault();

      // Get current language
      var isES = $langSlider.length
        ? parseFloat($langSlider.val()) >= 0.5
        : localStorage.getItem(LANG_KEY) === "es";

      // Basic client-side validation for required fields
      var names = $("#names").val().trim();
      var email = $("#email").val().trim();
      var phone = $("#phone").val().trim();
      var attending = $("#attending").val();
      var transport = $("#transport").val();

      if (!names) {
        alert(
          isES
            ? "Por favor ingresa los nombres de todos los invitados."
            : "Please enter the names of all guests."
        );
        return;
      }

      if (!email) {
        alert(
          isES
            ? "Por favor ingresa tu correo electrónico."
            : "Please enter your email."
        );
        return;
      }

      if (!phone) {
        alert(
          isES
            ? "Por favor ingresa tu número de teléfono."
            : "Please enter your phone number."
        );
        return;
      }

      if (!attending) {
        alert(
          isES
            ? "Por favor indica si puedes asistir."
            : "Please indicate if you can attend."
        );
        return;
      }

      if (!transport) {
        alert(
          isES
            ? "Por favor selecciona una opción de transporte."
            : "Please select a transport option."
        );
        return;
      }

      // Disable submit button and show loading state
      $submitBtn.prop("disabled", true);
      $submitBtn.find(".label-en").text(loadingTextEN);
      $submitBtn.find(".label-es").text(loadingTextES);

      // Execute reCAPTCHA v3 and submit form
      grecaptcha.ready(function () {
        grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
          .then(function (token) {
            // Collect form data with reCAPTCHA token
            var formData = {
              names: names,
              email: email,
              phone: phone,
              attending: attending,
              transport: transport,
              dietary: $("#dietary").val().trim(),
              comments: $("#comments").val().trim(),
              gCaptchaResponse: token,
            };

            // Submit to FormEasy endpoint
            return fetch(FORM_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "text/plain;charset=utf-8",
              },
              body: JSON.stringify(formData),
            });
          })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            // Success - redirect to thank you page
            window.location.href = "/rsvp-success.html";
          })
          .catch(function (error) {
            // Error - show alert and re-enable form
            console.error("Form submission error:", error);
            alert(
              isES
                ? "Hubo un error al enviar el formulario. Por favor intenta de nuevo."
                : "There was an error submitting the form. Please try again."
            );

            // Re-enable submit button
            $submitBtn.prop("disabled", false);
            $submitBtn.find(".label-en").text(originalBtnTextEN);
            $submitBtn.find(".label-es").text(originalBtnTextES);
          });
      });
    });
  }
});
