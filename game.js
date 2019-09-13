/**
 * The is the core Game object that manages the starting of the game loop and the
 * core functions of the game that don't relate directly to an individual screen object.
 */
$.Game = {

    /**
     * The time of the last animation frame. 
     */ 
    lastTime: 0,
    
    /**
     * The time difference between the last animation frame and the current animaton frame.
     */  
    delta: 0,
    
    /**
     * Whether or not the user currently has control.
     */
    userInput: true,

    /**
     * Last random number in the sequence. Always starts with same seed.
     */
    lastRandom: 481731,

    /**
     * Rooms have a region type (see blow), left exit, left path, left door, right door,
     * right path, right exit, down exit.
     * 
     * region type:
     *  bits 0-2: street/ave number
     *  bit  3  : 0=street, 1=avenue
     *  bits 4-6: wall colour
     *  bit  7  : inside/outside
     */
    rooms: [
      // First block.
      [0x19,   ,  2,   ,   ,  8,   , 41 ],  // 1
      [0x11,  3,   ,   ,   ,  1,   , 22 ],  // 2
      [0x11,  4,   ,   ,   ,   ,  2, 21 ],  // 3
      [0x11,   ,  5,   ,   ,   ,  3, 20 ],  // 4
      [0x1B,   ,  6,   ,   ,  4,   , 35 ],  // 5
      [0x14,  7,   ,   ,   ,  5,   , 31 ],  // 6
      [0x14,  8,   ,   ,   ,   ,  6,    ],  // 7
      [0x14,   ,  1,   ,   ,   ,  7, 25 ],  // 8
      
      // Second block.
      [0x29, 10,   ,   ,   , 22,   , 69 ],  // 9
      [0x29, 11,   ,   ,   ,   ,  9, 68 ],  // 10
      [0x29, 12,   ,   ,   ,   , 10,    ],  // 11
      [0x29,   , 13,   ,   ,   , 11, 91 ],  // 12
      [0x23, 14,   ,   ,   , 12,   , 28 ],  // 13
      [0x23, 15,   ,   ,   ,   , 13,    ],  // 14
      [0x23,   , 16,   ,   ,   , 14, 34 ],  // 15
      [0x2B, 17,   ,   ,   , 15,   , 53 ],  // 16
      [0x2B, 18,   ,   ,   ,   , 16,    ],  // 17
      [0x2B, 19,   ,   ,   ,   , 17, 48 ],  // 18
      [0x2B,   , 20,   ,   ,   , 18, 47 ],  // 19
      [0x21, 21,   ,   ,   , 19,   ,  4 ],  // 20
      [0x21, 22,   ,   ,   ,   , 20,  3 ],  // 21
      [0x21,   ,  9,   ,   ,   , 21,  2 ],  // 22

      // Third block.
      [0x39, 24,   ,   ,   , 28,   , 89 ],  // 23
      [0x39,   , 25,   ,   ,   , 23, 88 ],  // 24
      [0x34,   , 26,   ,   , 24,   ,  8 ],  // 25
      [0x3A, 27,   ,   ,   , 25,   ,    ],  // 26
      [0x3A,   , 28,   ,   ,   , 26,    ],  // 27
      [0x33,   , 23,   ,   , 27,   , 13 ],  // 28

      // Fourth block.
      [0x4A, 30,   ,   ,   , 34,   ,    ],  // 29 
      [0x4A,   , 31,   ,   ,   , 29,    ],  // 30 
      [0x44,   , 32,   ,   , 30,   ,  6 ],  // 31
      [0x4B, 33,   ,   ,   , 31,   , 58 ],  // 32
      [0x4B,   , 34,   ,   ,   , 32, 57 ],  // 33
      [0x43,   , 29,   ,   , 33,   , 15 ],  // 34

      // Fifth block.
      [0x3B,   , 36,   ,   , 46,   ,  5 ],  // 35
      [0x31, 37,   ,   ,   , 35,   , 52 ],  // 36
      [0x31, 38,   ,   ,   ,   , 36,    ],  // 37
      [0x31, 39,   ,   ,   ,   , 37, 72 ],  // 38
      [0x31, 40,   ,   ,   ,   , 38, 71 ],  // 39
      [0x31,   , 41,   , 95,   , 39, 70,   ,   , 'black' ],  // 40
      [0x39,   , 42, 93,   , 40,   ,  1,   ,   , 'green' ],  // 41
      [0x34, 43,   ,   ,   , 41,   , 87 ],  // 42
      [0x34, 44,   ,   ,   ,   , 42,    ],  // 43
      [0x34, 45,   , 94,   ,   , 43, 77,   , true, 'red'  ],   // 44
      [0x34, 46,   ,   ,   ,   , 44,    ],  // 45
      [0x34,   , 35,   ,   ,   , 45, 59 ],  // 46

      // Sixth block
      [0x4B, 48,   ,   ,   , 52,   , 19 ],  // 47
      [0x4B,   , 49,   ,   ,   , 47, 18 ],  // 48
      [0x42,   , 50,   ,   , 48,   , 56 ],  // 49
      [0x4C, 51,   ,   ,   , 49,   , 64 ],  // 50
      [0x4C,   , 52,   ,   ,   , 50, 63 ],  // 51
      [0x41,   , 47,   ,   , 51,   , 36 ],  // 52

      // Seventh block.
      [0x0B,   , 54,   ,   , 56,   , 16 ],  // 53
      [0x03,   , 55,   ,   , 53,   , 62 ],  // 54
      [0x0C,   , 56,   ,   , 54,   , 73 ],  // 55
      [0x02,   , 53,   ,   , 55,   , 49 ],  // 56

      // Eighth block.
      [0x1B, 58,   ,   ,   , 62,   , 33 ],  // 57
      [0x1B,   , 59,   ,   ,   , 57, 32 ],  // 58
      [0x14,   , 60,   ,   , 58,   , 46 ],  // 59
      [0x1C, 61,   ,   ,   , 59,   , 76 ],  // 60
      [0x1C,   , 62,   ,   ,   , 60, 75 ],  // 61
      [0x13,   , 57,   ,   , 61,   , 54 ],  // 62

      // Ninth block
      [0x2C, 64,   ,   ,   , 72,   , 51 ],  // 63
      [0x2C,   , 65,   ,   ,   , 63, 50 ],  // 64
      [0x22, 66,   ,   ,   , 64,   , 82 ],  // 65
      [0x22, 67,   ,   ,   ,   , 65,    ],  // 66
      [0x22,   , 68,   ,   ,   , 66, 92 ],  // 67
      [0x29, 69,   ,   ,   , 67,   , 10 ],  // 68
      [0x29,   , 70,   ,   ,   , 68,  9 ],  // 69
      [0x21, 71,   ,   ,   , 69,   , 40 ],  // 70
      [0x21, 72,   ,   ,   ,   , 70, 39 ],  // 71
      [0x21,   , 63,   ,   ,   , 71, 38 ],  // 72

      // Tenth block.
      [0x3C, 74,   ,   ,   , 82,   , 55 ],  // 73
      [0x3C, 75,   ,   ,   ,   , 73,    ],  // 74
      [0x3C, 76,   ,   ,   ,   , 74, 61 ],  // 75
      [0x3C,   , 77,   ,   ,   , 75, 60 ],  // 76
      [0x34,   , 78,   ,   , 76,   , 44 ],  // 77
      [0x3D, 79,   ,   ,   , 77,   , 86 ],  // 78
      [0x3D, 80,   ,   ,   ,   , 78, 85 ],  // 79
      [0x3D, 81,   ,   ,   ,   , 79, 84 ],  // 80
      [0x3D,   , 82,   ,   ,   , 80, 83 ],  // 81
      [0x32,   , 73,   ,   , 81,   , 65 ],  // 82

      // Eleventh block.
      [0x0D, 84,   ,   ,   , 92,   , 81 ],  // 83
      [0x0D, 85,   ,   ,   ,   , 83, 80 ],  // 84
      [0x0D, 86,   ,   ,   ,   , 84, 79 ],  // 85
      [0x0D,   , 87,   ,   ,   , 85, 78 ],  // 86
      [0x04,   , 88,   ,   , 86,   , 42 ],  // 87
      [0x09, 89,   ,   ,   , 87,   , 24 ],  // 88
      [0x09, 90,   ,   ,   ,   , 88, 23 ],  // 89
      [0x09, 91,   ,   ,   ,   , 89,    ],  // 90
      [0x09,   , 92,   ,   ,   , 90, 12 ],  // 91
      [0x02,   , 83,   ,   , 91,   , 67 ],  // 92

      // Inside rooms.
      [0x80,   ,   ,   , 41,   ,   ,    ,   ,    , 'green' ],  // 93
      [0x80,   ,   ,   , 44,   ,   ,    ,   , true, 'red' ],   // 94
    ],

    /*
      8  - Door open
      9  - Door unlocked
      10 - Door colour
      11 - Pulled reaper
      12 - Reaper dead

    */

    /**
     * Boolean flags that remember when certain things have happened in the game.
     */
    flags: {},

    /**
     * Props (things) that are in each room.
     */
    props: [
      
      // Room#, type, name, width, height, x, y, element reference, zindex, colour
      // types: 0 = actor, 1 = item, 2 = prop

      [62, 1, 'green_key', 18, 3, 455, 540, null],

      [1, 2, 'light_beam', 100, 264, 613, 520, null, 900],
      [46, 2, 'light_beam', 100, 264, 613, 520, null, 900],

      [41, 0, 'reaper', 50, 150, 710, 650, null],

      [41, 1, 'time_machine', 20, 15, 680, 510, null],

      [41, 1, 'black_key', 18, 3, 750, 510, null],

      [93, 1, 'backpack', 30, 40, 380, 530, null],

    ],
    
    actors: [],

    inventory: {},
    
    verb: 'Walk to',
    
    command: 'Walk to',   // Current constructed command, either full or partial
    
    thing: '',
    
    itemTop: -1,
    
    _gameOver: true,
    
    score: 0,

    year: 2030,
    
    /**
     * Scales the screen div to fit the whole screen.
     */
    fillScreen: function() {
      $.scaleX = window.innerWidth / $.wrap.offsetWidth;
      $.scaleY = window.innerHeight / $.wrap.offsetHeight;
      $.wrap.style.transform = "scale3d(" + $.scaleX + ", " + $.scaleY + ", 1)";
      $.wrap.style.marginLeft = ((window.innerWidth - 960) / 2) + "px";
      $.screen.style.width = (window.innerWidth > 960? window.innerWidth : 960) + "px";
    },

    /**
     * Starts the game. 
     */
    start: function() {
      // Get a reference to each of the elements in the DOM that we'll need to update.
      $.wrap = document.getElementById('wrap');
      $.screen = document.getElementById('screen');
      $.wall = document.getElementById('wall');
      $.doors = document.getElementsByClassName('door');
      $.drains = document.getElementsByClassName('drain');
      $.paths = document.getElementsByClassName('path');
      $.time = document.getElementById('time');
      $.score = document.getElementById('score');
      $.items = document.getElementById('itemlist');
      $.sentence = document.getElementById('sentence');
      $.controls = document.getElementById('controls');
      $.sign = document.getElementById('sign');
      $.crossing = document.getElementById('crossing');
      $.msg = document.getElementById('msg');

      this.fillScreen();
      
      window.addEventListener("resize", function() { $.Game.fillScreen(); }); 

      // Render the wall texture.
      this.wall = this.renderWall();
      $.screen.style.backgroundImage = 'url(' + this.wall.toDataURL("image/png") + ')';
      
      // Register click event listeners for item list arrow buttons.
      document.getElementById("up").addEventListener("click", function(){
        $.Game.scrollInv(1);
      });
      document.getElementById("down").addEventListener("click", function(){
        $.Game.scrollInv(-1);
      });
      
      var verbs = document.getElementById('commands').children;
      for (var i=0; i<verbs.length; i++) {
        verbs[i].addEventListener("click", function(e) {
          $.Game.command = $.Game.verb = e.target.innerHTML;
        });
      }
      
      // Start in game over mode.
      this.gameOver();
    },
    
    /**
     * 
     */
    gameOver: function(msg) {
      this.userInput = true;
      this.fadeOut($.screen);
      if (msg) {
        $.msg.innerHTML = msg;
      }
      $.msg.style.display = 'block';
      this.fadeIn($.msg);
      if (!msg) {
        window.onclick = function(e) {
          if (document.fullscreenEnabled) {
            document.documentElement.requestFullscreen();
          }
          $.Game.fadeOut($.msg);
          setTimeout(function() {
            $.msg.style.display = 'none';
          }, 200);
          setTimeout(function(e) {
            $.Game.init();
            $.Game.loop();
          }, 500);
        };
      }
    },

    /**
     * Initialised the parts of the game that need initialising on both
     * the initial start and then subsequent restarts. 
     */
    init: function() {
      this._gameOver = false;
      this.userInput = true;

      window.onclick = null;

      $.screen.onclick = function(e) {
        $.Game.processCommand(e);
      };

      // For restarts, we'll need to remove the objects from the screen.
      if (this.objs) {
        for (var i=0; i<this.objs.length; i++) {
          this.objs[i].remove();
        }
      }
      
      // Set the room back to the start, and clear the object map.
      this.objs = [];
      this.room = 41;
      
      // Create Ego (the main character) and add it to the screen.
      $.ego = new Ego();
      $.ego.add();
      $.ego.setPosition(500, 0, 600);
      
      // Start in 2030 AD.
      this.setTime(2030);

      // Add actors into the rooms.
      this.addActors(200);

      // Starting inventory.
      this.getItem('touch of death');
      
      // Enter the starting room.
      this.newRoom();
      
      // Intro text.
      this.userInput = false;
      $.ego.say('Where am I?', 140, function() {
        $.ego.moveTo(500, 600, function() {
          $.ego.say('Who am I?', 140, function() {
            $.ego.moveTo(500, 640, function() {
              $.ego.say('And why is there a body over there that looks like me?', 300, function() {
                $.Game.userInput = true;
              });
            });
          });
        });
      });
      
      // Fade in the whole screen at the start.
      this.fadeIn($.wrap);
    },
    
    /**
     * This is a wrapper around the main game loop whose primary purpose is to make
     * the this reference point to the Game object within the main game loop. This 
     * is the method invoked by requestAnimationFrame and it quickly delegates to 
     * the main game loop.
     *  
     * @param {number} now Time in milliseconds.
     */
    _loop: function(now) {
      $.Game.loop(now);
    },
    
    /**
     * This is the main game loop, in theory executed on every animation frame.
     * 
     * @param {number} now Time. The delta of this value is used to calculate the movements of Sprites.
     */
    loop: function(now) {
      // Immediately request another invocation on the next
      if (!this._gameOver) {
        requestAnimationFrame(this._loop);
      } else {
        return;
      }
      
      // Calculates the time since the last invocation of the game loop.
      this.updateDelta(now);
      
      // Game has focus and is not paused, so execute normal game loop, which is
      // to update all objects on the screen.
      this.updateObjects();

      // Small hack to account for the rotation of the reaper body.
      $.reaper.elem.style.zIndex = 520;
      
      // Update sentence.
      if (!this._gameOver) {
        $.sentence.innerHTML = this.command + ' ' + this.thing;
      } else {
        $.sentence.innerHTML = 'Game Over';
      }
      
      // If after updating all objects, the room that Ego says it is in is different
      // than what it was previously in, then we trigger entry in to the new room.
      if (($.ego.room != this.room) || ($.ego.year != this.year)) {
        this.room = $.ego.room;
        $.Game.setTime($.ego.year);
        this.fadeOut($.screen);
        setTimeout(function() {
          $.Game.newRoom();
        }, 200);
      }

      // Update cursor.
      $.wrap.style.cursor = ($.Game.userInput? 'crosshair' : 'wait');
    },
    
    /**
     * Updates the delta, which is the difference between the last time and now. Both values
     * are provided by the requestAnimationFrame call to the game loop. The last time is the
     * value from the previous frame, and now is the value for the current frame. The difference
     * between them is the delta, which is the time between the two frames. From this value
     * it can calculate the stepFactor, which is used in the calculation of the Sprites' motion.
     * In this way if a frame is skipped for some reason, the Sprite position will be updated to 
     * compensate.
     * 
     * @param {Object} now The current time provided in the invocation of the game loop.
     */
    updateDelta: function(now) {
      this.delta = now - (this.lastTime? this.lastTime : (now - 16));
      this.stepFactor = this.delta * 0.06;
      this.lastTime = now;
    },
    
    /**
     * The main method invoked on every animation frame when the game is unpaused. It 
     * interates through all of the Sprites and invokes their update method. The update
     * method will invoke the move method if the calculated position has changed. This
     * method then tests if the Sprite is touching another Sprite. If it is, it invokes
     * the hit method on both Sprites. 
     */
    updateObjects: function() {
      var i=-1, j, a1=$.ego, a2;
      var objsLen = this.objs.length;
  
      // Iterate over all of the Sprites in the current room, invoking update on each on.
      for (;;) {
        if (a1) {
          a1.update();
  
          // Check if the Sprite is touching another Sprite.
          for (j = i + 1; j < objsLen; j++) {
            a2 = this.objs[j];
            if (a2 && a1.touching(a2)) {
              // If it is touching, then invoke hit on both Sprites. They might take 
              // different actions in response to the hit.
              a1.hit(a2);
              a2.hit(a1);
            }
          }
          
          // Clears the Sprite's moved flag, which is only of use to the hit method.
          a1.moved = false;
        }
        
        if (++i < objsLen) {
          a1 = this.objs[i];
        } else {
          break;
        }
      }
    },
    
    /**
     * Sets the current year in time.
     * 
     * @param {*} year The current year in time.
     */
    setTime: function(year) {
      $.ego.year = this.year = year;
      $.time.innerHTML = '' + year + ' AD';
    },

    /**
     * Adds the given points to the current score.
     */
    addToScore: function(points) {
      this.score += points;
      $.score.innerHTML = '' + this.score + ' of 230';
    },
    
    /**
     * Processes the current user interaction.
     */
    processCommand: function(e) {
      if (this.userInput && !this._gameOver) {
        this.command = $.Logic.process(this.verb, this.command, this.thing, e);
        if (e) e.stopPropagation();
        if (this.command == this.verb) {
          this.command = this.verb = 'Walk to';
        }
      }
    },
    
    /**
     * Adds actors to the game. During the game, actors can be either a normal
     * person, a zombie, or a ghost.
     */
    addActors: function(numOfActors) {
      // Initialise actors for each outside room.
      this.initActors();

      // Now random assign actors to a room.
      for (let i=0; i<numOfActors; i++) {
        // Reserve space for the actor, but don't create yet (lazy instantiation)
        this.actors[this.random(92)].push(null);
      }

      // No ghosts in starting room.
      this.actors[41] = [];
      this.actors[40] = [];
    },

    /**
     * Initialises the actors array.
     */
    initActors: function() {
      for (let a=0; a<=92; a++) {
        this.actors[a] = [];
      }
    },

    /**
     * Returns a random number from 1 to n inclusive. Deliberately uses same seed every run.
     * 
     * @param {*} n a random number from 1 to n inclusive.
     */
    random: function(n) {
      this.lastRandom = (this.lastRandom * 1664525 + 1013904223) & 0xFFFFFFFF;
      let num = (((this.lastRandom & 0xFFFF) % n) + 1);
      return num;
    },

    /**
     * Invoked when Ego is entering a room.  
     */
    newRoom: function() {
      // Remove the previous room's Objs from the screen.
      for (let i=0; i<this.objs.length; i++) {
        this.objs[i].remove();
      }
      this.objs = [];

      $.roomData = this.rooms[this.room - 1];
      
      $.inside = ($.roomData[0] & 0x80);
      $.screen.className = ($.inside? 'inside ' : 'outside ') + 'year' + this.year;

      // Draw the bricks if the region has them.
      $.wall.className = '';

      if (!$.inside) {
        $.wall.classList.add('bricks');
      } 

      let pathClass = '';
      if ($.roomData[2]) {
        pathClass += 'left';
      }
      if ($.roomData[5]) {
        pathClass += 'right';
      }
      if (pathClass) {
        $.wall.classList.add(pathClass);
      }
      $.sign.className = pathClass;
      $.paths[0].style.display = ($.roomData[2]? 'block' : 'none');
      $.paths[1].style.display = ($.roomData[5]? 'block' : 'none');
 
      // Doors (display none, display block)
      $.doors[0].style.display = ($.roomData[3]? 'block' : 'none');
      $.doors[1].style.display = ($.roomData[4]? 'block' : 'none');

      // Only one of the doors is active.
      $.activeDoor = ($.doors[0].style.display == 'block'? $.doors[0] : $.doors[1]);

      // Set colour of the door.
      $.activeDoor.children[0].className = $.roomData[10];

      if ($.inside)  {
        // Inside doors always start out open.
        $.activeDoor.children[0].style.transform = "rotateY(180deg)";
        $.activeDoor.style.overflow = 'visible';
        $.roomData[8] = true;
      }
      else {
        $.activeDoor.style.overflow = 'hidden';
        if ($.roomData[8]) {
          $.activeDoor.children[0].style.transform = "rotateY(-45deg)";
        } else {
          $.activeDoor.children[0].style.transform = "rotateY(0deg)";
        }
      }

      // Crossing (display none, display block)
      $.crossing.style.display = ($.roomData[7]? 'block' : 'none');

      // Set the street sign text.
      // *  bits 0-2: street/ave number
      // *  bit  3  : 0=street, 1=avenue
      // *  bits 4-6: wall colour
      // *  bit  7  : inside/outside
      let streetNum = ($.roomData[0] & 0x07);
      let streetType = (($.roomData[0] & 0x08)? ' Avenue ' : ' Street ') + "NESW".charAt($.ego.nesw);
      $.sign.innerHTML = (pathClass? streetNum + this.nth(streetNum) + streetType : '');
      $.sign.style.display = (pathClass? 'block' : 'none');

      // Add props
      for (let i=0; i<this.props.length; i++) {
        var prop = this.props[i];
        
        // Is this prop in the current room?
        if (prop[0] == this.room) {
          this.addPropToRoom(prop);
        }
      }
      
      // Add actors.
      if (this.room < 93) {
        for (let i=0; i<this.actors[this.room].length; i++) {
          let g = this.actors[this.room][i];
          if (g == null) {
            // One in three ghosts is a child ghost.
            g = this.actors[this.room][i] = new Ghost((this.random(3) == 1? 35 : 48));
          }
          g.add();
          if (g.x == 0) {
            g.setPosition(this.random(880) + 20, 0, this.random(120) + 540);
          }
          this.objs.push(g);
        }
      }

      // Add event listeners for objects in the room.
      var screenObjs = $.screen.children;
      for (let i=0; i<screenObjs.length; i++) {
        this.addObjEventListeners(screenObjs[i]);
      }
      
      $.Game.fadeIn($.screen);
      $.ego.show();
      $.Game.fadeIn($.ego.elem);
    },
    
    nth: function(n) { 
      return["st","nd","rd"][((n+90)%100-10)%10-1]||"th";
    },

    /**
     * Adds the given prop to the current room screen.
     */
    addPropToRoom: function(prop) {
      var obj;
      
      // We cache the obj when it isn't in the dom rather than recreate. It might remember it's state.
      obj = prop[7];
      
      if (!obj) {
        // Switch on the type of prop
        switch (prop[1]) {
          case 0: // Actor
            switch (prop[2]) {
              case 'reaper':
                obj = new Actor(prop[3], prop[4], 'black', 0.95, 10, 'black');
                obj.setDirection(Sprite.LEFT);
                obj.ignore = true;
                break;
            }
            obj.setPosition(prop[5], 0, prop[6]);
            break;
            
          case 1: // Item
            obj = new Obj(prop[3], prop[4], prop[8]);
            obj.item = true;
            break;
            
          case 2: // Prop
            obj = new Obj(prop[3], prop[4], prop[8]);
            break;
        }

        // If the id has a _ then use parts of id to add class names.
        if (prop[2].indexOf('_') > -1) {
          let parts = prop[2].split('_');
          for (let i=0; i<parts.length; i++) {
            obj.elem.classList.add(parts[i]);
          }
        }

        $[prop[2]] = obj;
        obj.elem.id = prop[2];
        obj.propData = prop;
        obj.add();
        obj.setPosition(prop[5], 0, prop[6]);
        prop[7] = obj;
      }
      else {
        obj.add();
      }
      
      this.objs.push(obj);
    },
    
    /**
     * Adds the necessarily event listens to the given element to allow it to be 
     * interacted with as an object in the current room.
     */
    addObjEventListeners: function(elem) {
      // It is important that we don't use addEventListener in this case. We need to overwrite
      // the event handler on entering each room.
      elem.onmouseenter = function(e) {
        $.Game.thing = (e.target.id? e.target.id.replace('_',' ') : e.target.className);
      };
      elem.onmouseleave = function(e) {
        $.Game.thing = '';
      };
      elem.onclick = function(e) {
        let fallback = (!e.target.className || e.target.parentElement.className == 'door');
        $.Game.thing = (e.target.id? e.target.id.replace('_',' ') : (fallback? e.target.parentElement.className: e.target.className));
        $.Game.processCommand(e);
      };
    },
    
    /**
     * Adds the given item to the inventory.
     */
    getItem: function(name) {
      var item = document.createElement('span');
      item.innerHTML = name;
      $.items.appendChild(item);
      
      item.addEventListener("mouseenter", function(e) {
        $.Game.thing = name;
      });
      item.addEventListener("mouseleave", function(e) {
        $.Game.thing = '';
      });
      item.addEventListener("click", function(e) {
        $.Game.thing = name;
        $.Game.processCommand(e);
      });
      
      this.inventory[name] = item;
    },
    
    /**
     * Checks if the given item is in the inventory.
     */
    hasItem: function(name) {
      return this.inventory.hasOwnProperty(name);
    },
    
    /**
     * Removes the given item from the inventory.
     */
    dropItem: function(name) {
      var item = this.inventory[name];
      $.items.removeChild(item);
      delete this.inventory[name];
    },
    
    /**
     * Handles scrolling of the inventory list.
     */
    scrollInv: function(dir) {
      var newTop = this.itemTop + (27 * dir);
      var invCount = $.items.children.length;
      if ((newTop <= -1) && (newTop > -((invCount - 4) * 27))) {
        this.itemTop = newTop;
        $.items.style.top = this.itemTop + 'px';
      }
    },
    
    /**
     * Renders the grass canvas. It does this by randomly setting the luminousity of 
     * each pixel so that it looks like blades of grass from a distance.
     */
    renderWall: function() {
      // Render the base colour over the whole grass area first.
      var ctx = $.Util.create2dContext(960, 260);
      ctx.fillStyle = 'hsl(0, 0%, 10%)';
      ctx.fillRect(0, 0, 960, 260);
      
      // Now randomaly adjust the luminosity of each pixel.
      var imgData = ctx.getImageData(0, 0, 960, 260);
      for (var i=0; i<imgData.data.length; i+=4) {
        var texture = (Math.random() * 0.5);
        if (texture < 0.1) {
          texture = 1.0 - texture;
          imgData.data[i]=Math.floor(imgData.data[i] * texture);
          imgData.data[i+1]=Math.floor(imgData.data[i+1] * texture);
          imgData.data[i+2]=Math.floor(imgData.data[i+2] * texture);
          imgData.data[i+3]=200;
        } else {
          texture = 0.5 + texture;
          imgData.data[i]=Math.floor(imgData.data[i] / texture);
          imgData.data[i+1]=Math.floor(imgData.data[i+1] / texture);
          imgData.data[i+2]=Math.floor(imgData.data[i+2] / texture);
        }
      }
      
      ctx.putImageData(imgData,0,0);
      return ctx.canvas;
    },
    
    /**
     * Fades in the given DOM Element.
     * 
     * @param {Object} elem The DOM Element to fade in.
     */
    fadeIn: function(elem) {
      // Remove any previous transition.
      elem.style.transition = 'opacity 0.5s';
      elem.style.opacity = 1.0;
    },
    
    /**
     * Fades out the given DOM Element.
     * 
     * @param {Object} elem The DOM Element to fade out.
     */
    fadeOut: function(elem) {
      elem.style.transition = 'opacity 0.2s';
      elem.style.opacity = 0.0;
    }
  };
  
  // On load, the game will start.
  window.onload = function() { 
    $.Game.start();
  };