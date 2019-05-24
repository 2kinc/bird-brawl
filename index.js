function Game(renderer, width, height) {
  var that = this;
  this.renderer = renderer;
  this.width = width;
  this.height = height;
  this.objects = new Map();
  this.initialize = function (){
    this.renderer.canvas.width = this.width;
    this.renderer.canvas.height = this.height;
    this.renderer.objects = this.objects;
  }
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
  }
  this.drawFrame = function () { //this has to happen every frame for initializing.
    ctx.fillStyle = that.color;
    ctx.fillRect(0, 0, that.width, that.height);
    that.objects.forEach(function (object) {
      if (object.type === 'rect') {
        ctx.fillStyle = object.color;
        ctx.fillRect(object.x - that.x, object.y - that.y, object.width, object.height);
      }
      if (object.type === 'circle') {
        ctx.fillStyle = object.color;
        ctx.arc(object.x - that.x, object.y - that.y, object.radius, 0, 2 * Math.PI);
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
  type: 'rect',
  color: 'blue',
  x: 100,
  y: 250,
  width: 200,
  height: 130
};
game.objects.set('player', player); //add player to the renderer //ps. i bound the renderer's objects to game.objects it makes more sense to put objects in the game rather than in the renderer
game.renderer.start();
var keys = {};
document.addEventListener('keypress',e=>keys[e.key.toLowerCase()] = e.type = true);
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()] = false)
game.renderer.frameUpdate = function () {
  player.x += Math.random() * 2 - 1;
  player.y += Math.random() * 2 - 1; //works!
}
