/**
 * Created with JetBrains WebStorm.
 * User: zhy
 * Date: 14-6-15
 * Time: 下午6:26
 * To change this template use File | Settings | File Templates.
 */
var vcd = {
        /**
         * 常量
         */
        ID_VCD: "vcd",
        ID_INDEXBAR: "indexBar",
        ID_CD: "cd",
        CLASS_ACTIVE: "active",
        CLASS_CD_SWITCH: "switch",
        currentIndex: 0,
        isRunning: false,
        timer: null,
        init: function ()
        {
            /**
             * 初始化数据与事件
             */
            vcd.vcd = $("#" + vcd.ID_VCD);
            vcd.cd = $("#" + vcd.ID_CD);
            vcd.imgs = $("li", vcd.vcd);
            vcd.indexBar = $("#" + vcd.ID_INDEXBAR);

            vcd.vcd.mouseover(function (event)
            {
                clearInterval(vcd.timer);
            });
            vcd.vcd.mouseout(function ()
            {
                vcd.autoPlay();
            })
            ;
            $("a", vcd.indexBar).click(vcd.dotClick);

        },
        /**
         * 按钮点击切换
         * @param event
         */
        dotClick: function (event)
        {
            //如果当前动画还在运行，则直接返回
            if (vcd.isRunning)return;
            vcd.isRunning = true;
            $("a", vcd.indexBar).removeClass(vcd.CLASS_ACTIVE);
            $(this).addClass(vcd.CLASS_ACTIVE);
            vcd.currentIndex = $(this).text();
            vcd.cd.addClass(vcd.CLASS_CD_SWITCH);
            setTimeout(vcd.resetDotClick, 1500);
            event.preventDefault();//阻止a的默认跳转页面

        },
        /**
         * 当cd动画结束后，更新图片
         */
        resetDotClick: function ()
        {
            vcd.cd.removeClass(vcd.CLASS_CD_SWITCH);
            vcd.imgs.removeClass(vcd.CLASS_ACTIVE);
            vcd.imgs.eq(vcd.currentIndex).addClass(vcd.CLASS_ACTIVE);
            vcd.isRunning = false;
        },
        autoClick: function ()
        {
            var as = $("a", vcd.indexBar);
            vcd.currentIndex++;
            if (vcd.currentIndex == as.length)
            {
                vcd.currentIndex = 0;
            }
            as.removeClass(vcd.CLASS_ACTIVE);
            as.eq(vcd.currentIndex).addClass(vcd.CLASS_ACTIVE);
            vcd.cd.addClass(vcd.CLASS_CD_SWITCH);
            setTimeout(vcd.resetDotClick, 1500);
        },
        /**
         * 自动播放
         */
        autoPlay: function ()
        {
            vcd.timer = setInterval(function ()
            {
                vcd.autoClick();
            }, 3000);
        }

    }
    ;