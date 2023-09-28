
// 源码ID集
var sourceIdMap = new Map([
    ['25522.html', 'OL_1690198574085']
]);

// 源码价格集
var sourcePriceMap = new Map([
    ['25522.html', 0.01]
]);

// 判断是否时候寄 如果是 返回true 否则 false
function isPhone(){
    var info = navigator.userAgent;
    console.log(info)
    var isPhone = /mobile/i.test(info);
    return isPhone;
}



// 获取客户端IP
$('#btn_submit_alipay').click(
    function getPaymentUrl() {
        var filename = location.href;
        filename = filename.substr(filename.lastIndexOf('/') + 1);
        var title = document.title;
        var is = isPhone();
        var device = "pc";
        if(is){
            device = "mobile"
        }
        $.ajax({
            type: 'get',
            url: 'https://www.gengtian1.cn/qcz/payment/wechat',
            data: {
                'type': 'alipay',
                'money': sourcePriceMap.get(filename),
                'name': title,
                'body': '测试内容',
                'id': sourceIdMap.get(filename),
                'device': device
            },
            success: function (res) {
                if (null == res) {
                    return;
                }
                let code = res.code;
                if (code != 200) {
                    alert(res.msg);
                }
                if(is){
                    window.location.href=res.info;
                }else{
                    window.open(res.info,"_blank");
                }

            }
        })
    }

)
