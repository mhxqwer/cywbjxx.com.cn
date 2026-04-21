var GlobalClickNum=0;
var playerIDList=[];
var initMeida = function(videoUrl,coverUrl,node,curData) {
    $(node).hide();
    var videoid = "my-video"+(GlobalClickNum++);
    var divPlayerWidth = curData.divPlayerWidth;
    var imgContainerHeight = curData.imgContainerHeight;
    addPlayerIDList(videoid);
    var videoHtml='<div class="videoContainer" style="width: '+ divPlayerWidth +'px;overflow: hidden;display: block;position: relative;margin: 15px auto;height:'+ imgContainerHeight +'px"><video style="width:'+ divPlayerWidth +'px;height:'+ imgContainerHeight +'px;padding:0" id="' + videoid + '" class="video-js  vjs-big-play-centered" controls preload="none"  ></video></div>';
    $(node).after(videoHtml);
    mediaPlayerInit(videoid,videoUrl,coverUrl,curData)
    pauseOtherPlayer(videoid);


};
var addPlayerIDList = function(videoid) {
    if(!isContainPlayerID(videoid)){
        playerIDList.push(videoid);
    }
};
var isContainPlayerID=function(videoid){
    if(playerIDList){
        for(var i=0;i<playerIDList.length;i++){
            if(playerIDList[i] == videoid){
                return true;
            }
        }
    }else{
        return false;
    }
    return false;
};
var pauseOtherPlayer=function(videoid){
    for(var i=0;i<playerIDList.length;i++){
        if(playerIDList[i] != videoid){
            let videoid2 = playerIDList[i];
            if(document.getElementById(videoid2)!=null){
                videojs(videoid2).pause();
            }

        }
    }
};
var writeVideoLog = function(mid){
    try {
        $.ajax({
            url:"/cms/web/videoLog.jsp?id="+mid,
            method:"GET",
            success:function (response){
                console.log("videoLog",response);
            }
        });
    }catch (e){}
}
var mediaPlayerInit = function(videoid,videoSrc,jpgUrl,curData) {
    var mid = curData.id;

    writeVideoLog(curData.rid);
    var videoType = "application/x-mpegURL";
    if(videoSrc.toLowerCase().endsWith(".mp4")){
        videoType = "video/mp4"
    }
    videojs(videoid, {
        controls: true,
        preload: "auto",
        poster: jpgUrl,
        sources: [
            {
                src: videoSrc,
                type: videoType
            }
        ],
        autoplay: true,
        loop: false,
        muted:false,
        volume:0,
        language: 'zh-CN',
        fluid: true,

        nativeControlsForTouch: false,
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        bigPlayButtion: true,
        textTrackButtion: false,
        errorDisplay: false,
        playbackRates:[0.5,1,1.5,2,3],
        controlBar: {
            currentTimeDisplay: true,
            durationDisplay: true,
            // playbackRateMenuButton: false,  //播放速率
            remainingTimeDisplay: false,
            timeDivider: true,
            progressControl: true,
            volumePanel: {
                inline: false
            },
            muteToggle: false,
            fullscreenToggle: true
        },
        techOrder: ["html5"]

    }, function onPlayerReady() {
        var vdthis = this;
        videojs.log('ok');
        $("#"+videoid+" .vjs-time-control").show();
        vdthis.volume(0.5);
        vdthis.play();

        //vdthis.currentTime(currMedia.playTime);
        vdthis.on('play', function () {
            $("#"+videoid+ "  .vjs-big-play-button").hide();
            // pauseOtherPlayer(videoid);
        })


        vdthis.on("click", function () {
            pauseOtherPlayer(videoid);
        });
        vdthis.on('ended', function () {
            videojs.log('ended');
        })

        vdthis.on('timeupdate', function (e) {
        });

        vdthis.on('pause', function () {
            $("#"+videoid + "  .vjs-big-play-button").show();
        });


        this.on('error', function () {
            var mediaError = this.error();
            console.log(mid,$("#"+mid).parentsUntil(".divPlayerImgResponsive").parent());
            var tDiv = $("#"+mid).parentsUntil(".divPlayerImgResponsive").parent();
            tDiv.next().remove();
            tDiv.show();
            alert("视频正在转码中，请稍后重试");
            if (mediaError.code == 1) {
            } else if (mediaError.code == 2) {
            } else if (mediaError.code == 3) {
            } else if (mediaError.code == 4) {
            } else if (mediaError.code == 5) {
            }
        });

    });

}
function initJQuery() {
    $(document).ready(function () {
        var sizeData = {};
        var divPlayer = $('.divPlayerImgResponsive');
        divPlayer.each(function () {
            var that = $(this)
            var divPlayerWidth = that.width();
            //debugger
            var imgContainer = that.find('img').eq(0);
            var imgWidth = imgContainer.attr('data-width');
            var imgHeight = imgContainer.attr('data-height');
            var imgContainerHeight = divPlayerWidth * imgHeight / imgWidth;
            // fix:【优化】北印刷的视频预览不出现视频画面的问题
            if(isNaN(imgContainerHeight) || imgContainerHeight == 0) {
                imgWidth = imgContainer[0].width || 600;
                imgHeight = imgContainer[0].height || 350;
                imgContainerHeight = divPlayerWidth * imgHeight / imgWidth;
            }
            if (imgContainerHeight > 0) {
                imgContainer.height = imgContainerHeight;
            }
            sizeData[imgContainer.attr("id")] = {
                imgContainerHeight: imgContainerHeight,
                divPlayerWidth: divPlayerWidth,
                id: imgContainer.attr("id"),
                rid: imgContainer.attr("data-id")
            };

        });
        console.log("sizeData", sizeData);
        $(".divPlayerImgResponsive").off('click').on('click', function () {
            GlobalClickNum++;
            var videoImgObj = $(this).find("img");
            var coverUrl = videoImgObj.attr("src");
            coverUrl = coverUrl.replace("\\", "/");
            var videoUrl = videoImgObj.attr("data-video");
            var curData = sizeData[videoImgObj.attr("id")];
            initMeida(videoUrl, coverUrl, this, curData);
            return false;
        });
    })
}
//视频无法播放，页面渲染和js渲染顺序问题
setTimeout(function() {
    initJQuery();
}, 1000);