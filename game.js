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
     * Regions have a name, wall type, wall colour, and water colour
     */
    regions: [
      ['Sewers',     1, '108,141,36', '108,141,36'],    // Greenish tint, green water, bricks
      ['Caves',      1, '0,0,0', '68,136,187'],         // Grey walls, blue water
      ['Mines',      0, '#000000', ''],                 // Brown walls, no water
      ['Catacombs',  1, '#000000', ''],                 // Grey walls, no water, bricks
      ['Underworld', 0, '255,0,0', '207,16,32']         // Red tint, lava
    ],

    /**
     * Rooms have a region type (inside or outside), left exit, left path, left door, right door,
     * right path, right exit, down exit.
     */
    rooms: [
      // First block.
      [0,   ,  2,999,   ,  8,   , 41 ],  // 1
      [0,  3,   ,   ,   ,  1,   , 22 ],  // 2
      [0,  4,   ,   ,   ,   ,  2, 21 ],  // 3
      [0,   ,  5,   ,   ,   ,  3, 20 ],  // 4
      [0,   ,  6,   ,   ,  4,   , 35 ],  // 5
      [0,  7,   ,   ,   ,  5,   , 31 ],  // 6
      [0,  8,   ,   ,   ,   ,  6,    ],  // 7
      [0,   ,  1,   ,   ,   ,  7, 25 ],  // 8
      
      // Second block.
      [0, 10,   ,   ,   , 22,   , 69 ],  // 9
      [0, 11,   ,   ,   ,   ,  9, 68 ],  // 10
      [0, 12,   ,   ,   ,   , 10,    ],  // 11
      [0,   , 13,   ,   ,   , 11, 91 ],  // 12
      [0, 14,   ,   ,   , 12,   , 28 ],  // 13
      [0, 15,   ,   ,   ,   , 13,    ],  // 14
      [0,   , 16,   ,   ,   , 14, 34 ],  // 15
      [0, 17,   ,   ,   , 15,   , 53 ],  // 16
      [0, 18,   ,   ,   ,   , 16,    ],  // 17
      [0, 19,   ,   ,   ,   , 17, 48 ],  // 18
      [0,   , 20,   ,   ,   , 18, 47 ],  // 19
      [0, 21,   ,   ,   , 19,   ,  4 ],  // 20
      [0, 22,   ,   ,   ,   , 20,  3 ],  // 21
      [0,   ,  9,   ,   ,   , 21,  2 ],  // 22

      // Third block.
      [0, 24,   ,   ,   , 28,   , 89 ],  // 23
      [0,   , 25,   ,   ,   , 23, 88 ],  // 24
      [0,   , 26,   ,   , 24,   ,  8 ],  // 25
      [0, 27,   ,   ,   , 25,   ,    ],  // 26
      [0,   , 28,   ,   ,   , 26,    ],  // 27
      [0,   , 23,   ,   , 27,   , 13 ],  // 28

      // Fourth block.
      [0, 30,   ,   ,   , 34,   ,    ],  // 29 
      [0,   , 31,   ,   ,   , 29,    ],  // 30 
      [0,   , 32,   ,   , 30,   ,  6 ],  // 31
      [0, 33,   ,   ,   , 31,   , 58 ],  // 32
      [0,   , 34,   ,   ,   , 32, 57 ],  // 33
      [0,   , 29,   ,   , 33,   , 15 ],  // 34

      // Fifth block.
      [0,   , 36,   ,   , 46,   ,  5 ],  // 35
      [0, 37,   ,   ,   , 35,   , 52 ],  // 36
      [0, 38,   ,   ,   ,   , 36,    ],  // 37
      [0, 39,   ,   ,   ,   , 37, 72 ],  // 38
      [0, 40,   ,   ,   ,   , 38, 71 ],  // 39
      [0,   , 41,   ,   ,   , 39, 70 ],  // 40
      [0,   , 42,   ,   , 40,   ,  1 ],  // 41
      [0, 43,   ,   ,   , 41,   , 87 ],  // 42
      [0, 44,   ,   ,   ,   , 42,    ],  // 43
      [0, 45,   ,   ,   ,   , 43, 77 ],  // 44
      [0, 46,   ,   ,   ,   , 44,    ],  // 45
      [0,   , 35,   ,   ,   , 45, 59 ],  // 46

      // Sixth block
      [0, 48,   ,   ,   , 52,   , 19 ],  // 47
      [0,   , 49,   ,   ,   , 47, 18 ],  // 48
      [0,   , 50,   ,   , 48,   , 56 ],  // 49
      [0, 51,   ,   ,   , 49,   , 64 ],  // 50
      [0,   , 52,   ,   ,   , 50, 63 ],  // 51
      [0,   , 47,   ,   , 51,   , 36 ],  // 52

      // Seventh block.
      [0,   , 54,   ,   , 56,   , 16 ],  // 53
      [0,   , 55,   ,   , 53,   , 62 ],  // 54
      [0,   , 56,   ,   , 54,   , 73 ],  // 55
      [0,   , 53,   ,   , 55,   , 49 ],  // 56

      // Eighth block.
      [0, 58,   ,   ,   , 62,   , 33 ],  // 57
      [0,   , 59,   ,   ,   , 57, 32 ],  // 58
      [0,   , 60,   ,   , 58,   , 46 ],  // 59
      [0, 61,   ,   ,   , 59,   , 76 ],  // 60
      [0,   , 62,   ,   ,   , 60, 75 ],  // 61
      [0,   , 57,   ,   , 61,   , 54 ],  // 62

      // Ninth block
      [0, 64,   ,   ,   , 72,   , 51 ],  // 63
      [0,   , 65,   ,   ,   , 63, 50 ],  // 64
      [0, 66,   ,   ,   , 64,   , 82 ],  // 65
      [0, 67,   ,   ,   ,   , 65,    ],  // 66
      [0,   , 68,   ,   ,   , 66, 92 ],  // 67
      [0, 69,   ,   ,   , 67,   , 10 ],  // 68
      [0,   , 70,   ,   ,   , 68,  9 ],  // 69
      [0, 71,   ,   ,   , 69,   , 40 ],  // 70
      [0, 72,   ,   ,   ,   , 70, 39 ],  // 71
      [0,   , 63,   ,   ,   , 71, 38 ],  // 72

      // Tenth block.
      [0, 74,   ,   ,   , 82,   , 55 ],  // 73
      [0, 75,   ,   ,   ,   , 73,    ],  // 74
      [0, 76,   ,   ,   ,   , 74, 61 ],  // 75
      [0,   , 77,   ,   ,   , 75, 60 ],  // 76
      [0,   , 78,   ,   , 76,   , 44 ],  // 77
      [0, 79,   ,   ,   , 77,   , 86 ],  // 78
      [0, 80,   ,   ,   ,   , 78, 85 ],  // 79
      [0, 81,   ,   ,   ,   , 79, 84 ],  // 80
      [0,   , 82,   ,   ,   , 80, 83 ],  // 81
      [0,   , 73,   ,   , 81,   , 65 ],  // 82

      // Eleventh block.
      [0, 84,   ,   ,   , 92,   , 81 ],  // 83
      [0, 85,   ,   ,   ,   , 83, 80 ],  // 84
      [0, 86,   ,   ,   ,   , 84, 79 ],  // 85
      [0,   , 87,   ,   ,   , 85, 78 ],  // 86
      [0,   , 88,   ,   , 86,   , 42 ],  // 87
      [0, 89,   ,   ,   , 87,   , 24 ],  // 88
      [0, 90,   ,   ,   ,   , 88, 23 ],  // 89
      [0, 91,   ,   ,   ,   , 89,    ],  // 90
      [0,   , 92,   ,   ,   , 90, 12 ],  // 91
      [0,   , 83,   ,   , 91,   , 67 ],  // 92
    ],

    /**
     * Street map of the city.
     */
    //map:  '          '
    //    + '# #### ## '
    //    + '# ####    '
    //    + '# #### ## '
    //    + '          '
    //    + '# ## # ## '
    //    + '#         '
    //    + '# ## #### '
    //    + '# ##      '
    //    + '# ## #### '
    //    ,

    props: [
      
      // Room#, type, name, width, height, x, y, element reference
      // types: 0 = actor, 1 = item, 2 = prop
      [4, 0, 'reaper', 50, 150, 455, 540, null],
      
      [8, 0, 'man', 50, 150, 455, 540, null],
      
      [8, 2, 'blanket', 160, 15, 400, 550, null, 530],
      
      [8, 0, 'doll', 20, 60, 523, 540, null],
      
      [0, 2, 'phone', 15, 6, 800, 600, null, 530],
      
      [6, 2, 'book', 25, 10, 475, 560, null, 530] 
      
      //[2, 2, 'cupboard', 100, 200, 200, 530, null],
      
      /* Things I hoped to add to the game.
      'fishing pole',
      'eel flashlight',
      'poisoned rat',
      'poisoned cheese',
      'wine bottle',
      'empty bottle',
      'old batteries',
      'vinyl tape',
      'pipe',
      'lighter',
      'suit of armour',
      'worm',
      'nylon string',
      'hammer',
      'nails',
      'mop'
      */
    ],
    
    inventory: {},
    
    verb: 'Walk to',
    
    command: 'Walk to',   // Current constructed command, either full or partial
    
    thing: '',
    
    itemTop: -1,
    
    gameOver: false,
    
    score: 0,

    time: 2030,
    
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
      //$.wall = document.getElementById('wall');
      $.bricks = document.getElementById('bricks');
      //$.sides = document.getElementById('sides');
      //$.water = document.getElementById('water');
      $.region = document.getElementById('region');
      $.doors = document.getElementsByClassName('door');
      $.drains = document.getElementsByClassName('drain');
      $.paths = document.getElementsByClassName('path');
      $.time = document.getElementById('time');
      $.score = document.getElementById('score');
      $.items = document.getElementById('itemlist');
      $.sentence = document.getElementById('sentence');
      $.controls = document.getElementById('controls');
      $.sign = document.getElementById('sign');
      
      this.fillScreen();

      //this.buildRooms();
      
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
      
      $.screen.onclick = function(e) {
        $.Game.processCommand(e);
      };
      
      // Initialise and then start the game loop.
      $.Game.init();
      $.Game.loop();
    },
    
    /**
     * Initialised the parts of the game that need initialising on both
     * the initial start and then subsequent restarts. 
     */
    init: function() {
      this.setTime(2030);

      // For restarts, we'll need to remove the objects from the screen.
      if (this.objs) {
        for (var i=0; i<this.objs.length; i++) {
          this.objs[i].remove();
        }
      }
      
      // Set the room back to the start, and clear the object map.
      this.objs = [];
      this.room = 1;
      
      // Create Ego (the main character) and add it to the screen.
      $.ego = new Ego();
      $.ego.add();
      $.ego.setPosition(500, 0, 600);
      
      // Starting inventory.
      this.getItem('chocolate coins');
      
      // Enter the starting room.
      this.newRoom();
      
      // // Intro text.
      // this.userInput = false;
      // $.ego.say('Hello!!', 100, function() {
      //   $.ego.say('My name is Pip.', 200, function() {
      //     $.ego.say('I accidentally dropped my phone down a curbside drain...   Duh!!', 300, function() {
      //       $.ego.moveTo(600, 600, function() {
      //         $.ego.say('I climbed down here through that open drain to search for it.', 300, function() {
      //           $.ego.moveTo(600, 640, function() {
      //             $.ego.say('Unfortunately this is blocks away from where it fell in.', 300, function() {
      //               $.ego.say('Please help me to find it down here.', 200, function() {
      //                 $.Game.userInput = true;
      //               });
      //             });
      //           });
      //         });
      //       });
      //     });
      //   });
      // });
      
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
      requestAnimationFrame(this._loop);
      
      // Calculates the time since the last invocation of the game loop.
      this.updateDelta(now);
      
      // Game has focus and is not paused, so execute normal game loop, which is
      // to update all objects on the screen.
      this.updateObjects();
      
      // Update sentence.
      if (!this.gameOver) {
        $.sentence.innerHTML = this.command + ' ' + this.thing;
      } else {
        $.sentence.innerHTML = 'Game Over';
      }
      
      // If after updating all objects, the room that Ego says it is in is different
      // than what it was previously in, then we trigger entry in to the new room.
      if ($.ego.room != this.room) {
        this.room = $.ego.room;
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
     * @param {*} time The current year in time.
     */
    setTime: function(time) {
      $.time.innerHTML = '' + time + ' AD';
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
      if (this.userInput && !this.gameOver) {
        this.command = $.Logic.process(this.verb, this.command, this.thing, e);
        if (e) e.stopPropagation();
        if (this.command == this.verb) {
          this.command = this.verb = 'Walk to';
        }
      }
    },
    
    /**
     * Invoked when Ego is entering a room.  
     */
    newRoom: function() {
      // Remove the previous room's Objs from the screen.
      for (i=0; i<this.objs.length; i++) {
        this.objs[i].remove();
      }
      this.objs = [];
      
      var roomData = this.rooms[this.room - 1];
      this.region = this.regions[roomData[0]];
      
      // Draw the bricks if the region has them.
      $.bricks.className = '';
      if (this.region[1]) {
        $.bricks.classList.add('bricks');
      }

      // TODO: Add left and right paths depending on available directions.
      let pathClass = '';
      if (roomData[2]) {
        pathClass += 'left';
      }
      if (roomData[5]) {
        pathClass += 'right';
      }
      if (pathClass) {
        $.bricks.classList.add(pathClass);
      }
      $.paths[0].style.display = (roomData[2]? 'block' : 'none');
      $.paths[1].style.display = (roomData[5]? 'block' : 'none');

      // Room colouring
      //$.wall.style.backgroundColor = 'rgb(' + this.region[2] + ')';
      //$.water.style.backgroundColor = 'rgb(' + this.region[3] + ')';
      
      // // Sides
      // $.sides.className = "";
      // if (!roomData[1]) {
      //   $.sides.classList.add('left');
      // }
      // if (!roomData[4]) {
      //   $.sides.classList.add('right');
      // }
 
      // Doors (display none, display block)
      $.doors[0].style.display = (roomData[3]? 'block' : 'none');
      $.doors[1].style.display = (roomData[4]? 'block' : 'none');
      
      // Set the street sign text.
      // TODO: Hide this when there isn't a corner.
      // TODO: Avenue vs Street
      $.sign.innerHTML = this.room + this.nth(this.room) + ' Avenue';

      // Add props
      for (var i=0; i<this.props.length; i++) {
        var prop = this.props[i];
        
        // Is this prop in the current room?
        if (prop[0] == this.room) {
          this.addPropToRoom(prop);
        }
      }
      
      // Add event listeners for objects in the room.
      var screenObjs = $.screen.children;
      for (var i=0; i<screenObjs.length; i++) {
        this.addObjEventListeners(screenObjs[i]);
      }
      
      $.Game.fadeIn($.screen);
      $.ego.show();
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
                obj.setDirection(Sprite.OUT);
                break;
              case 'man':
                obj = new Actor(prop[3], prop[4], '#614126', 0.95, 5, '#ccffcc', '#926239');
                obj.setDirection(Sprite.OUT);
                break;
              case 'doll':
                obj = new Actor(prop[3], prop[4], '#111', 0.95, 5, '#111');
                obj.setDirection(Sprite.OUT);
                break;
              case 'engineer':
                break;
            }
            obj.setPosition(prop[5], 0, prop[6]);
            break;
            
          case 1: // Item
            break;
            
          case 2: // Prop
            obj = new Obj(prop[3], prop[4], prop[8]);
            break;
        }
        
        $[prop[2]] = obj;
        obj.elem.id = prop[2];
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
        $.Game.thing = (e.target.id? e.target.id : e.target.className);
      };
      elem.onmouseleave = function(e) {
        $.Game.thing = '';
      };
      elem.onclick = function(e) {
        $.Game.thing = (e.target.id? e.target.id : e.target.className);
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
      if ((newTop <= -1) && (newTop > -((this.invCount - 4) * 27))) {
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
      elem.style.transition = 'opacity 0.2s';
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