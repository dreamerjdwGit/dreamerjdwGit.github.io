(function() {

    var vcd = {

        ID_VCD: 'vcd',
        ID_CD: 'cd',
        CLASS_ACTIVE: 'active',
        CLASS_CD_SWITCH: 'switch',
        isRunning: false,
        timer: null,
        currentIndex: 0,

        init: function() {

            vcd.vcd = $('#' + vcd.ID_VCD);
            vcd.cd = $('#' + vcd.ID_CD);
            vcd.imgs = $('li', vcd.vcd );  
        },

        resetDotClick: function() {
            vcd.cd.removeClass(vcd.CLASS_CD_SWITCH);
            vcd.imgs.removeClass(vcd.CLASS_ACTIVE);
            vcd.imgs.eq(vcd.currentIndex).addClass(vcd.CLASS_ACTIVE);
            vcd.isRunning = false;
        },

        autoClick: function() {
            var as = $('a');
            vcd.currentIndex++;
            if(vcd.currentIndex == as.length) {
                vcd.currentIndex = 1;
            }
            as.removeClass(vcd.CLASS_ACTIVE);
            as.eq(vcd.currentIndex).addClass(vcd.CLASS_ACTIVE);
            vcd.cd.addClass(vcd.CLASS_CD_SWITCH);
            setTimeout(vcd.resetDotClick, 1500);
        },

        autoPlay: function() {
            vcd.timer = setInterval(function() {
                vcd.autoClick();
            }, 3000);
        }

    };

    vcd.init();
    vcd.autoPlay();



})();