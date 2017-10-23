var can1;
var can2;

var ctx1;
var ctx2;

var lastTime;
var deltaTime;

var bgPic = new Image();

var canWidth;
var canHeight;

var ane;
var fruit;

var mom;

var mx;
var my;

var mouse;

// 海葵
var aneObj = function(){
    this.x = [];
    this.y = [];
    this.len = [];
}
aneObj.prototype.num = 50;
aneObj.prototype.init = function(){

    for( var i=0;i<this.num;i++){
        this.x[i] = i*17 + Math.random()*20;
        this.len[i] = 200 + Math.random()*50;
    }
};
aneObj.prototype.draw = function(){

    ctx2.save();
    ctx2.globalAlpha = 0.6;
    ctx2.strokeStyle = "#3b1541";
    ctx2.lineWidth = 15;
    ctx2.lineCap = "round";
    for( var i=0;i<this.num;i++){
        ctx2.beginPath();
        ctx2.moveTo(this.x[i],canHeight);
        ctx2.lineTo(this.x[i],canHeight-this.len[i]);

        ctx2.stroke();
    }
    ctx2.restore();
};

// 果实
var fruitObj = function(){
    this.alive = [];
    this.num = 30;  // 果实池子
    this.game_num = 15;  // 游戏进行中的果实数量
    this.x = [];
    this.y = [];
    this.l = [];
    this.speed = [];
    this.fruit_type = [];
    this.orange = new Image();
    this.blue = new Image();
};

fruitObj.prototype.init = function(){
    this.orange.src = './img/fruit.png';
    this.blue.src = './img/blue.png';
    for( var i=0;i<this.num;i++){
        this.alive[i] = false;
        this.x[i] = 0;
        this.y[i] = 0;
        this.speed[i] = Math.random()*0.01+0.005; // 0.005-0.015
        this.fruit_type[i] = '';
        //this.born(i);
    }
};

fruitObj.prototype.draw = function(){
    // 画果实，出生，成长，死亡
    for( var i=0;i<this.num;i++){


        if( this.alive[i] ){
            if( this.l[i] <= 16 ){
                this.l[i] += this.speed[i]*deltaTime;
            }else{
                this.y[i] -= this.speed[i]*6*deltaTime;
            }

            var pic;
            if( this.fruit_type[i] == 'blue'){
                pic = this.blue;
            }else{
                pic = this.orange;
            }


            ctx2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);

            if( this.y[i] < 0 ){
                this.alive[i] = false;
            }
        }

    }

};

fruitObj.prototype.born = function(i){

    var aneId = Math.floor(Math.random()*ane.num);
    this.x[i] = ane.x[aneId];
    this.y[i] = canHeight - ane.len[aneId];
    this.l[i] = 0;
    this.alive[i] = true;
    // 生产的时候随机类型
    var random = Math.random();
    // 10% 概率
    if( random < 0.1 ){
        this.fruit_type[i] = 'blue';
    }else{
        this.fruit_type[i] = 'orange';
    }
}

// 监视果实数量，少于15个就产生一个新的
fruitObj.prototype.monitor = function(){
    var num = 0;
    for( var i=0;i<this.num;i++){
        if( this.alive[i] ){
            num++;
        }
    }
    if( num < this.game_num ){
        // 生产一个果实
        this.sendOneFruit();
    }
}

fruitObj.prototype.sendOneFruit = function(){
    for(var i=0;i<this.num;i++){
        if( !this.alive[i] ){
            this.born(i);
            return;
        }
    }
}


// 大鱼
var momObj = function(){
    this.x;
    this.y;
    this.angle;
    this.bigEye = new Image();
    this.bigBody = new Image();
    this.bigTail = new Image();
}

momObj.prototype.init = function(){
    this.x = canWidth*0.5;
    this.y = canHeight*0.5;
    this.angle = 0;
    this.bigEye.src = './img/bigEye0.png';
    this.bigBody.src = './img/bigSwim0.png';
    this.bigTail.src = './img/bigTail0.png';
}

momObj.prototype.draw = function(){

    // lerp x,y
    var delY = my - this.y;
    var delX = mx - this.x;
    var delAngel = Math.atan2(delY,delX);
    this.x = lerpDistince(mx,this.x,0.99);
    this.y = lerpDistince(my,this.y,0.9);
    this.angle = lerpAngle(delAngel,this.angle,0.9);
    ctx1.save();
    ctx1.translate(this.x,this.y);
    ctx1.rotate(this.angle);
    ctx1.drawImage(this.bigEye,-1*this.bigEye.width*0.5,-1*this.bigEye.height*0.5);
    ctx1.drawImage(this.bigBody,-1*this.bigBody.width*0.5,-1*this.bigBody.height*0.5);
    ctx1.drawImage(this.bigTail,-1*this.bigTail.width*0.5+30,-1*this.bigTail.height*0.5);
    ctx1.restore();
}

window.requestNextAnimationFrame = (function(){
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.msRequestAnimationFrame
        || window.oRequestAnimationFrame ||
        function(callback,element){
            var self = this,
                start,
                finish;
            window.setTimeout(function(){
                start = +new Date();
                callback(start);
                finish = +new Date();
                self.timeout = 1000/60 - (finish-start);
            },self.timeout);
        };

})();

function init(){

    // 获得canvas content
    can1 = document.getElementById('game_top'); // fishes,dust,ui,circle
    can2 = document.getElementById('game_bottom'); // bg,
    ctx1 = can1.getContext('2d');
    ctx2 = can2.getContext('2d');

    bgPic.src = './img/background.jpg';
    canWidth = can1.width;
    canHeight = can1.height;

    mx = canWidth*0.5;
    my = canHeight*0.5;


    can1.addEventListener('mousemove',onMouseMove,false);

    ane = new aneObj();
    ane.init();

    fruit = new fruitObj();
    fruit.init();

    mom = new momObj();
    mom.init();


}

function onMouseMove(e){

    var e = e || window.event;
    if( e.offSetX || e.layerX ){
        mx = e.offSetX || e.layerX;
        my = e.offsetY || e.layerY;
    }
}

function lerpDistince(aim,cur,ratio){
    var delt = cur-aim;
    return aim + delt*ratio;
}

function lerpAngle(a,b,t)
{
    var d = b-a;
    /*if( d > Math.PI){
        d = d - 2*Math.PI;
    }
    if( d < -Math.PI){
        d = d + 2*Math.PI;
    }*/
    d = Math.PI + d;
    return a + d*t;
}

function game(){

    init();

    lastTime = Date.now();
    deltaTime = 0;

    gameLoop();
}

function gameLoop(){


    requestNextAnimationFrame(gameLoop);
    var now = Date.now();
    deltaTime = now -lastTime;
    lastTime = now;
    //console.log(deltaTime);

    drawBg();
    drawAne();
    monitorFruit();
    drawFruit();

    ctx1.clearRect(0,0,canWidth,canHeight);
    mom.draw();



}

function drawBg(){
    ctx2.drawImage(bgPic,0,0,canWidth,canHeight);
}

function drawAne(){

    ane.draw();
}

function monitorFruit()
{
    //fruit.monitor();
    var num = 0;
    for( var i=0;i<fruit.num;i++){
        if( fruit.alive[i] ){
            num++;
        }
    }
    if( num < 15 ){
        // 生产一个果实
        fruit.sendOneFruit();
        return;
    }
}

function drawFruit(){

    fruit.draw();
}


$(document).ready(function(){

    game();

});
