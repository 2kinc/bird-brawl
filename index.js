function Game(renderer, width, height, friction) {
  var that = this;
  this.renderer = renderer;
  this.width = width;
  this.height = height;
  this.objects = new Map();
  this.friction = friction || 0.92;
  this.addForce = function (force, object) {
    object.acceleration.x += (force.x / (object.mass || 1)) || 0;
    object.acceleration.y += (force.y / (object.mass || 1)) || 0;
  };
  this.animationFrame = function () {
    that.frameUpdate();
    that.framePhysics();
    requestAnimationFrame(that.animationFrame);
  }
  this.framePhysics = function () {
    this.objects.forEach(function (object) {
      object.x += object.acceleration.x || 0;
      object.y += object.acceleration.y || 0;
      object.acceleration.x *= that.friction;
      object.acceleration.y *= that.friction;
    });
  }
  this.frameUpdate = function () {
    //write stuff that happens every frame for your players, enemies, etc
  };
  this.initialize = function () {
    this.renderer.canvas.width = this.width;
    this.renderer.canvas.height = this.height;
    this.renderer.objects = this.objects;
    requestAnimationFrame(that.animationFrame);
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
  this.animationFrame = function () {
    that.drawFrame();
    requestAnimationFrame(that.animationFrame);
  }
  this.start = function () {
    requestAnimationFrame(that.animationFrame);
  };
}

function GameObject(type, width, height, color, mass, x, y) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.color = color;
  this.x = x || 0;
  this.y = y || 0;
  this.mass = mass || 1;
  this.acceleration = {
    x: 0,
    y: 0
  };
}

var game = new Game(new Renderer(document.querySelector('#game-canvas'), innerWidth, innerHeight, 'white', 40, 100), innerWidth, innerHeight);
game.initialize();
var player = new GameObject('circle', 200, 200, 'blue', 3, 100, 250);
var box = new GameObject('rect', 220, 140, 'red', 1, 300, 120);
game.objects.set('player', player); //add player to the renderer //ps. i bound the renderer's objects to game.objects it makes more sense to put objects in the game rather than in the renderer
game.objects.set('box', box);
game.renderer.start();
var keys = {};
document.addEventListener('keypress', e => keys[e.key.toLowerCase()] = e.type = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
var cameraOffset = {
  x: 0,
  y: 0
};
game.frameUpdate = function () {
  if (keys['w']) {
    game.addForce({
      x: 0,
      y: -10
    }, player);
  }
  if (keys['a']) {
    game.addForce({
      x: -10,
      y: 0
    }, player);
  }
  if (keys['s']) {
    game.addForce({
      x: 0,
      y: 10
    }, player);
  }
  if (keys['d']) {
    game.addForce({
      x: 10,
      y: 0
    }, player);
  }

  if (keys['i']) {
    cameraOffset.y -= 10;
  }
  if (keys['j']) {
    cameraOffset.x -= 10;
  }
  if (keys['k']) {
    cameraOffset.y += 10;
  }
  if (keys['l']) {
    cameraOffset.x += 10;
  }

  game.renderer.x = player.x + cameraOffset.x;
  game.renderer.y = player.y + cameraOffset.y;
}
