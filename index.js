function Game(renderer, width, height) {
  var that = this;
  this.renderer = renderer;
  this.width = width;
  this.height = height;
  this.objects = new Map();
  this.initialize = function () {
    this.renderer.canvas.width = this.width;
    this.renderer.canvas.height = this.height;
    this.renderer.objects = this.objects;
  };
}
function Renderer(canvas, width, height, color, x, y) {
  var that = this;
  this.canvas = canvas;
  var ctx = canvas.getContext('2d');
  this.x = x || 0;
  this.y = y || 0;
  this.color = color;
  this.width = width;
  this.height = height;
  this.objects = new Map();
  this.getObjectByName = function (name) {
    return that.objects.filter(object => object.name === name);
  };
  this.drawCircle = function (x, y, r, c) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  };
  this.drawFrame = function () { //this has to happen every frame for initializing.
    ctx.fillStyle = that.color;
    ctx.fillRect(0, 0, that.width, that.height);
    that.objects.forEach(function (object) {
      if (object.type === 'rect') {
        ctx.fillStyle = object.color;
        ctx.fillRect(object.x - that.x, object.y - that.y, object.width, object.height);
      }
      if (object.type === 'circle') {
        that.drawCircle(object.x - that.x, object.y - that.y, object.width / 2, object.color);
      }
    });
  };
  this.frameUpdate = function () {
    //write stuff that happens every frame for your players, enemies, etc
  };
  this.animationFrame = function () {
    that.drawFrame();
    that.frameUpdate();
    requestAnimationFrame(that.animationFrame);
  }
  this.start = function () {
    requestAnimationFrame(that.animationFrame);
  };
}

var game = new Game(new Renderer(document.querySelector('#game-canvas'), innerWidth, innerHeight, 'white', 40, 100), innerWidth, innerHeight);
game.initialize();
var player = {
  type: 'circle',
  color: 'blue',
  x: 100,
  y: 250,
  width: 200,
  height: 130
};
var box = {
  type: 'rect',
  color: 'red',
  x: 300,
  y: 120,
  width: 220,
  height: 140
}
game.objects.set('player', player); //add player to the renderer //ps. i bound the renderer's objects to game.objects it makes more sense to put objects in the game rather than in the renderer
game.objects.set('box', box);
game.renderer.start();
var keys = {};
document.addEventListener('keypress', e => keys[e.key.toLowerCase()] = e.type = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
game.renderer.frameUpdate = function () {
  if (keys['w']) {
    player.y -= 10;
  }
  if (keys['a']) {
    player.x -= 10;
  }
  if (keys['s']) {
    player.y += 10;
  }
  if (keys['d']) {
    player.x += 10;
  }

  if (keys['i']) {
    game.renderer.y -= 10;
  }
  if (keys['j']) {
    game.renderer.x -= 10;
  }
  if (keys['k']) {
    game.renderer.y += 10;
  }
  if (keys['l']) {
    game.renderer.x += 10;
  }
}
