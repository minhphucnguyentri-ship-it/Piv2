(function(){

// Nội dung thư
var PAGES = [
    {
        h:"My Dearest,",
        t:"In a world that moves far too fast, you have become my favorite pause. I still remember the exact moment you entered my life — it felt as though all the background noise of the world quietly vanished, leaving only the warmth of your presence."
    },
    {
        h:"",
        t:"You make ordinary days feel like small celebrations. The way you laugh at your own jokes, the way you hold my hand without thinking — these are the things I carry with me, long after the day is done."
    },
    {
        h:"Forever yours,",
        t:"I don’t have grand words big enough for what you mean to me, so I’ll say it plainly: thank you for being you, and for letting me love you. Whatever comes next, I choose you — today, tomorrow, and always."
    }
];

// Thời gian (ms) của từng bước
var T_FLAP  = 900;   // 1. nắp phong bì mở (khớp transition .9s)
var T_WAIT1 = 500;   // 2. chờ 0,5 giây
var T_CARD  = 2000;  // 3+4+5. thư trượt ra + đi lên, một animation liền mạch (khớp animation 2s)

var i = 0;

var env = document.getElementById('env');
var card = document.getElementById('card');
var page = document.getElementById('page');

var intro = document.getElementById('intro');
var stage = document.getElementById('stage');

var pg = document.getElementById('pg');
var prev = document.getElementById('prev');
var next = document.getElementById('next');
var hint = document.getElementById('hint');

// Bấm trái tim lớn
document.getElementById('start').onclick = function(){
    intro.classList.add('hide');
    stage.classList.add('ready');
};

// Hiển thị nội dung trang
function render(){

    page.classList.add('out');

    setTimeout(function(){

        var p = PAGES[i];

        page.innerHTML = '';

        if(p.h){
            var h = document.createElement('h2');
            h.textContent = p.h;
            page.appendChild(h);
        }

        var t = document.createElement('p');
        t.textContent = p.t;
        page.appendChild(t);

        pg.textContent = 'PAGE ' + (i+1) + ' OF ' + PAGES.length;

        prev.disabled = i === 0;
        next.disabled = i === PAGES.length-1;

        page.classList.remove('out');

    },180);
}

// Mở phong bì theo từng giai đoạn
function open(){

    if(env.classList.contains('open')) return;

    env.classList.add('open');            // 1. Nắp phong bì mở
    stage.classList.add('letter-open');

    hint.style.opacity = 0;

    i = 0;
    render();

    // 2. Chờ 0,5 giây sau khi nắp mở xong
    setTimeout(function(){

        // 3 + 4 + 5. Thư trượt ra rồi đi lên trên phong bì (một animation)
        env.classList.add('letter-up');

        setTimeout(function(){
            next.focus();
        }, T_CARD);

    }, T_FLAP + T_WAIT1);
}

// Đóng thư (chạy ngược lại)
function close(){

    zoomOut();

    env.classList.add('closing');          // thư hạ vào lại phong bì

    setTimeout(function(){

        env.classList.remove('letter-up','closing');
        env.classList.remove('open');
        stage.classList.remove('letter-open');

        hint.style.opacity = 1;

    }, T_CARD);
}

// Sự kiện nút
document.getElementById('seal').onclick = open;

document.getElementById('close').onclick = close;
document.getElementById('x').onclick = close;

prev.onclick = function(){
    if(i > 0){
        i--;
        render();
    }
};

next.onclick = function(){
    if(i < PAGES.length-1){
        i++;
        render();
    }
};

// Điều khiển bằng bàn phím
document.addEventListener('keydown',function(e){

    if(e.key === 'Escape' && photo.classList.contains('zoom')){
        zoomOut();
        return;
    }

    if(!env.classList.contains('letter-up')) return;

    if(e.key === 'Escape') close();

    if(e.key === 'ArrowRight') next.click();

    if(e.key === 'ArrowLeft') prev.click();

});

// Tải ảnh Polaroid
var file = document.getElementById('file');
var pic = document.getElementById('pic');

var photo = document.getElementById('photo');
var photoBusy = false;

// Phóng to: ảnh bay ra giữa màn hình
function zoomIn(){

    var w = photo.offsetWidth;
    var h = photo.offsetHeight;
    var r = photo.getBoundingClientRect();

    var cx = r.left + r.width/2;
    var cy = r.top + r.height/2;

    var s = Math.min(320/w, innerWidth*.82/w, innerHeight*.7/h);

    photo.style.setProperty('--dx',(innerWidth/2 - cx) + 'px');
    photo.style.setProperty('--dy',(innerHeight/2 - 24 - cy) + 'px');
    photo.style.setProperty('--s',s);

    photo.classList.add('zoom');
}

// Thu nhỏ: ảnh quay về chỗ cũ trên phong bì
function zoomOut(){
    photo.classList.remove('zoom');
}

photo.onclick = function(){

    if(photoBusy) return;

    photoBusy = true;
    setTimeout(function(){ photoBusy = false; },760);

    if(photo.classList.contains('zoom')) zoomOut();
    else zoomIn();
};

photo.addEventListener('keydown',function(e){
    if(e.target === photo && (e.key === 'Enter' || e.key === ' ')){
        e.preventDefault();
        photo.click();
    }
});

// Bấm ra ngoài ảnh để thu nhỏ lại
document.addEventListener('click',function(e){

    if(!photo.classList.contains('zoom') || photoBusy) return;

    if(e.target.closest('#photo') || e.target === file) return;

    zoomOut();
});

addEventListener('resize',zoomOut);

file.onchange = function(){

    var f = file.files[0];

    if(!f) return;

    var r = new FileReader();

    r.onload = function(){
        pic.style.backgroundImage = 'url(' + r.result + ')';
        pic.textContent = '';
    };

    r.readAsDataURL(f);
};

// Hiệu ứng cánh hoa rơi
var cv = document.getElementById('petals');
var ctx = cv.getContext('2d');

var W,H;
var dpr = Math.min(window.devicePixelRatio || 1,2);
var pt = [];

function size(){

    W = innerWidth;
    H = innerHeight;

    cv.width = W*dpr;
    cv.height = H*dpr;

    ctx.setTransform(dpr,0,0,dpr,0,0);
}

size();
addEventListener('resize',size);

for(var k=0;k<38;k++){

    pt.push({
        x:Math.random()*W,
        y:Math.random()*H,
        s:4+Math.random()*7,
        v:12+Math.random()*28,
        d:Math.random()*6,
        r:Math.random()*6,
        a:.15+Math.random()*.4
    });

}

var still = matchMedia('(prefers-reduced-motion:reduce)').matches;
var lt = 0;

function loop(n){

    var dt = Math.min((n-lt)/1000 || .016,.05);

    lt = n;

    ctx.clearRect(0,0,W,H);

    for(var j=0;j<pt.length;j++){

        var p = pt[j];

        if(!still){
            p.y += p.v*dt;
            p.x += Math.sin(n/1500+p.d)*12*dt;
            p.r += dt;
        }

        if(p.y > H+10){
            p.y = -10;
            p.x = Math.random()*W;
        }

        ctx.save();

        ctx.translate(p.x,p.y);
        ctx.rotate(p.r);

        ctx.fillStyle = 'rgba(200,30,80,'+p.a+')';

        ctx.beginPath();

        ctx.moveTo(0,p.s*.4);

        ctx.bezierCurveTo(-p.s,-p.s*.6,-p.s*.2,-p.s,0,-p.s*.3);
        ctx.bezierCurveTo(p.s*.2,-p.s,p.s,-p.s*.6,0,p.s*.4);

        ctx.fill();
        ctx.restore();

    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

})();
