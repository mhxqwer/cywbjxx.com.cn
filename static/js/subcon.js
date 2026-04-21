$('.sub_menu1 .item.cur').each(function() {
    $(this).parent().addClass('on');
});
$('.sub_menu2 .item.cur').each(function() {
    var index = $(this).parents('ul').index();
    $(this).parent().addClass('on');
    $('.sub_menu1 li').eq(index).addClass('on').siblings().removeClass('on');
    $('.sub_menu2 ul').eq(index).addClass('on').siblings().removeClass('on');
});
$('.sub_menu1 .item').click(function() {
    var index = $(this).parent().index();
    $('.sub_menu1 li').eq(index).addClass('on').siblings().removeClass('on');
    $('.sub_menu2 ul').eq(index).addClass('on').siblings().removeClass('on');
});


$('#jumpPage').click(function() {
    turnPage();
})
$("#pageNumber").keydown(function(e) {
    if (e.keyCode == 13) {
        turnPage();
    }
});

function turnPage() {
    var pageNumber = parseInt($('#pageNumber').val());
    if (pageNumber > 0 && pageNumber <= maxPageCount) {
        document.location.href = pageNumber == 1 ? "index.htm" : pageNumber > maxPageCount ? "index" + (parseInt(maxPageCount) - 1).toString() + ".htm" : "index" + (pageNumber - 1).toString() + ".htm";
    } else {
        $('.tips').text('页码需大于0小于' + maxPageCount)
        $('.tips').show();
        // alert('页码需大于0小于'+maxPageCount)
    }
}

// 检测并替换jwplayer为原生video标签
$(document).ready(function() {

    if ($('.jwplayer').length > 0) {
        var date = $('#date').html();
        date = date.replace(/-/g, '/')
        $('.jwplayer').each(function() {

            var playerId = $(this).attr('id');


            var videoId = playerId.replace(/\D/g, '');


            var imagePath = '/upload/resources/video/' + date + '/' + videoId + '.jpg';
            var videoPath = '/upload/resources/video/' + date + '/' + videoId + '.mp4';


            var videoHtml = '<video width="480px" height="360px" controls poster="' + imagePath + '" controlsList="nodownload" oncontextmenu="return false">' +
                '<source src="' + videoPath + '" type="video/mp4">' +
                '您的浏览器不支持视频播放。' +
                '</video>';


            $(this).html(videoHtml);
        });
    }

    if ($('.muplayer').length > 0) {
        var date = $('#date').html();
        date = date.replace(/-/g, '/')
        $('.muplayer').each(function() {

            var playerId = $(this).attr('id');


            var audioId = playerId.replace(/\D/g, '');



            var audioPath = '/upload/resources/audio/' + date + '/' + audioId + '.mp3';


            var audioHtml = '<audio src="' + audioPath + '" controls="controls" >当前浏览器不支持audio</audio>';





            $(this).html(audioHtml);
        });
    }
    if ($('.article').length > 0) {
        // 查找.article元素内的所有img图片元素
        $('.article img').each(function() {
            var $img = $(this);
            var $parentA = $img.closest('a');
            if ($parentA.length > 0) {
                var href = $parentA.attr('href') || '';
                if (href.indexOf('www.bjxx.com.cn/') !== -1) {
                    var imgSrc = $img.attr('src') || '';
                    if (imgSrc) {
                        $parentA.attr('href', imgSrc);
                    }
                }
            }
        });
    }
});