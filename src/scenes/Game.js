import Phaser from "phaser";
import mp3 from "../assets/Orbital\ Colossus.mp3";
import background from "../assets/scifi_platform_BG1.jpg";
import tiles from "../assets/scifi_platformTiles_32x32.png";
import star from "../assets/star.png";
import ball from "../assets/ball.png";
import wizard from "../assets/wizard_idle.png";
import { accelerate, decelerate } from "../utils";

let box;
let cursors;
let Evilwizard;

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'game' });
    window.GAME = this;
  },
  preload: function preload() {
    this.load.image("background", background);

    this.load.spritesheet('tiles', tiles, {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("ball", ball, {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("wizard", wizard, {
      frameWidth: 150,
      frameHeight: 195,
    });
  },
  create: function create() {
    this.add.image(400, 300, "background");

    Evilwizard = this.physics.add.image(400, 100, "wizard");

    Evilwizard.scaleX = .5;
    Evilwizard.scaleY = .5;


    const balls = this.physics.add.group({
      key: 'ball',
      repeat: 11,
      setScale: {x: 0.5, y: 0.5 },
      setXY: { x: 425, y: 85 }
    });

    balls.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setVelocityX(150 - Math.random() * 300);
      child.setVelocityY(150 - Math.random() * 300);
      child.setBounce(1, 1);
      //don't want stars to bounce
      child.setCollideWorldBounds(false);
    });

    cursors = this.input.keyboard.createCursorKeys();

    //try physics
    box = this.physics.add.image(400, 600, "tiles", 15);


    const processCollision = (box, ball) => {
      ball.destroy();
      const ballsLeft = balls.countActive();
      if (ballsLeft === 0) {
        this.scene.start('winscreen');
      }
    }

    this.physics.add.collider(
      balls,
      box,
      processCollision,
      null,
      this
    );


    // box.setBounce(1, 1);
    box.setCollideWorldBounds(true);
  },
  update: function () {
    const { velocity, x, y } = box.body;
    // if (cursors.space.isDown) {
    //   const x = decelerate(velocity.x);
    //   const y = decelerate(velocity.y);
    //   box.setVelocity(x, y)
    // }
    
    // if (cursors.up.isDown) box.setVelocityY(accelerate(velocity.y, -1));
    if (cursors.right.isDown) box.x += 15
    // if (cursors.down.isDown) box.seßtVelocityY(accelerate(velocity.y, 1));
    if (cursors.left.isDown) box.x -= 15;
  }
});