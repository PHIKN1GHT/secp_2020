export default function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText =
        `max-width:60%;
        min-width: 150px;
        padding:0 14px;
        height: 40px;
        color: rgb(255, 255, 255);
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        position: fixed;
        top: 8%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999999;
        background: #99AACC;
        font-size: 16px;";`
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
}