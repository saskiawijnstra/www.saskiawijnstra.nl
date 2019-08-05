$(document).ready(function() {
    var startSlidingOffset = 20;
    var sliding = [], startClientX = [],startPixelOffset = [],pixelOffset = [],currentSlide = [];
    slideCount = [];

    $(".slides").each(function(i, obj) {
      $(this).on('mousedown touchstart', null, i, slideStart);
      $(this).on('mouseup touchend', null, i, slideEnd);
      $(this).on('mousemove touchmove', null, i, slide);
      sliding.push(0);
      startClientX.push(0);
      startPixelOffset.push(0);
      pixelOffset.push(0);
      currentSlide.push(0);
      slideCount.push(obj.children.length);
      console.log("slideCount[" + i + "]: ");
      console.log(slideCount[i]);
    });

    /**
    / Triggers when slide event started
    */
    function slideStart(event) {
      console.log(event.data);
        // If it is mobile device redefine event to first touch point
        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];
        // If sliding not started yet store current touch position to calculate distance in future.
        if (sliding[event.data] == 0) {
            sliding[event.data] = 1; // Status 1 = slide started.
            startClientX[event.data] = event.clientX;
        }
    }

    /** Occurs when image is being slid.
     */
    function slide(event) {
        if (sliding[event.data] > 1) event.preventDefault();
        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];
        // Distance of slide.
        var deltaSlide = event.clientX - startClientX[event.data];

        // If sliding started first time and there was a distance.
        if (sliding[event.data] == 1 && (deltaSlide > startSlidingOffset || deltaSlide < -startSlidingOffset)) {
            sliding[event.data] = 2; // Set status to 'actually moving'
            startPixelOffset[event.data] = pixelOffset[event.data]; // Store current offset
        }

        //  When user move image
        if (sliding[event.data] == 2) {
            // Means that user slide 1 pixel for every 1 pixel of mouse movement.
            var touchPixelRatio = 1;
            // Check for user doesn't slide out of boundaries
            if ((currentSlide[event.data] == 0 && event.clientX > startClientX[event.data]) ||
                (currentSlide[event.data] == slideCount[event.data] - 1 && event.clientX < startClientX[event.data]))
            // Set ratio to 3 means image will be moving by 3 pixels each time user moves it's pointer by 1 pixel. (Rubber-band effect)
                touchPixelRatio = 3;
            // Calculate move distance.
            pixelOffset[event.data] = startPixelOffset[event.data] + deltaSlide / touchPixelRatio;
            // Apply moving and remove animation class
            $(this).css('transform', 'translateX(' + pixelOffset[event.data] + 'px').removeClass("animate");
        }
    }

    /** When user release pointer finish slide moving.
     */
    function slideEnd(event) {
        if (sliding[event.data] == 2) {
            // Reset sliding.
            sliding[event.data] = 0;
            // Calculate which slide need to be in view.
            currentSlide[event.data] = pixelOffset[event.data] < startPixelOffset[event.data] ? currentSlide[event.data] + 1 : currentSlide[event.data] - 1;
            // Make sure that unexisting slides weren't selected.
            currentSlide[event.data] = Math.min(Math.max(currentSlide[event.data], 0), slideCount[event.data] - 2);
            // Since in this example slide is full viewport width offset can be calculated according to it.
            pixelOffset[event.data] = currentSlide[event.data] * -($('.slide').width() + 40);
            // Remove style from DOM (look below)
            // $('#temp').remove();
            // Add animate class to slider and reset transform prop of this class.
            $(this).addClass('animate').css('transform', '');
            // Add a translate rule dynamically and asign id to it
            $(this).css("transform", "translateX(" + pixelOffset[event.data] + "px)");
            // $('<style id="temp">#slides.animate{transform:translateX(' + pixelOffset[event.data] + 'px)}</style>').appendTo('head');
          }
    }
});