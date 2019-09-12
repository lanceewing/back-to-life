class Sprite extends Obj {

    /**
     * Creates a new Sprite. A Sprite is a screen object that uses a canvas for the background.
     */
    constructor(width, height, colour, texture, xzstep) {
        super(width, height, 0);

        this.moved = false;
        this.positions = [];
        this.radius = width / 2;
        this.colour = colour;
        this.texture = texture;
        
        this.elem.classList.add('sprite');
        
        this.cx = 0;
        this.cy = 0;
        this.cz = 0;
        this.maxStep = xzstep;
        this.step = this.stepInc = (this.maxStep / 10);
        this.direction = 0;
        this.directionLast = 1;
        this.heading = null;
        this.backgroundX = 0;
        this.backgroundY = 0;
        this.facing = 1;
        this.destZ = -1;
        this.destX = -1;
        this.destFn = null;
        this.dests = [];
        this.cell = 0;
    }
  
    /**
     * Tests whether the given Sprite is touching this Sprite. There is an optional gap 
     * parameter, which provides more of a "close too" check rather than actually touching.
     *
     * @param {Sprite} obj Another Sprite with which to test whether this Sprite is touching it.
     * @param {number} gap If provided, then if the two Sprites are within this distance, the method returns true.
     * @returns {boolean} true if this Sprite is touching the given Sprite; otherwise false.
     */
    touching(obj, gap) {
        // Some objects are not solid, e.g. ghosts.
        if (this.ignore || obj.ignore) {
            return false;
        }
        if (obj) {
            let dx = this.cx - obj.cx;
            let dy = (this.cy - obj.cy);
            let dz = Math.abs(this.z - obj.z) + 15;
            let dist = (dx * dx) + (dy * dy) + (dz * dz);
            let rsum = (this.radius + obj.radius + (gap | 0));
            return (dist <= (rsum * rsum));
        } else {
            return false;
        }
    }
  
    /**
     * Resets this Sprite's position to its previous position.
     */
    reset() {
        let pos = this.positions.pop();
        
        if (pos) {
            this.setPosition(pos.x, pos.y, pos.z);
            this.positions.pop();
        }
    
        // We need to switch to small steps when we reset position so we can get as close
        // as possible to other Sprites.
        this.step = 1;
        
        return pos;
    }
  
    /**
     * Sets the Sprite's position to the given x, y, and z position.
     * 
     * @param {number} x The x part of the new position.
     * @param {number} y The y part of the new position.
     * @param {number} z The z part of the new position.
     */
    setPosition(x, y, z) {
        // If we have a previous position then z will have a non-zero value. We don't
        // want to push the initially undefined position.
        if (this.z) {
            // Remember the last 5 positions.
            this.positions.push({x: this.x, y: this.y, z: this.z});
            if (this.positions.length > 5) {
                this.positions = this.positions.slice(-5);
            }
        }
    
        // Set the new position and calculate the centre point of the Sprite sphere.
        this.x = x;
        this.y = y;
        this.z = z;
        this.cx = x + this.radius;
        this.cy = y + this.radius;
        this.cz = z - this.radius;
    
        // Update the style of the sprite to reflect the new position.
        let top = Math.floor(this.z / 2) - this.height - Math.floor(this.y);
        this.elem.style.top = top + 'px';
        this.elem.style.left = (this.x) + 'px';
        this.elem.style.zIndex = Math.floor(this.z);
    }
  
    /**
     * Sets the direction of this Sprite to the new direction provided. The direction is
     * a bit mask, and so might be a composite direction. From the direction, the heading
     * is calculated.
     * 
     * @param {number} direction A bit mask that identifies the new direction of the Sprite.
     */
    setDirection(direction) {
        if (direction && direction != this.direction) {
            this.directionLast = this.direction;
            this.direction = direction;
        
            // Convert the direction to a facing direction by shifting right until we find
            // a 1. There are only four facing directions.
            for (var facing = 0; facing <= 4 && !((direction >> facing++) & 1););
            
            this.facing = facing;
        }
  
        // If the canvas width is greater than the Sprite width, it means that the sprite
        // sheet has multiple appearances or costumes, each which relates to a facing direction.
        if (this.canvas && (this.canvas.width > this.width)) {
            // Adjust the background position to show the correct part of the sprite sheet for the direction.
            this.backgroundX = (-((this.facing - 1) * this.width));
            this.elem.style.backgroundPosition = this.backgroundX + 'px ' + (this.backgroundY + (~~(this.cell/10) * this.height)) + 'px';
        }
    }
  
    /**
     * Moves this Sprite based on its current heading, direction, step size and time delta settings. The
     * bounds are checked, and if in moving the Sprite and edge is hit, then the hitEdge method is invoked
     * so that sub-classes can decide what to do.
     */
    move() {
        this.moved = false;
        
        if (this.direction || this.heading != null) {
            var x = this.x;
            var z = this.z;
            var y = this.y;
            var edge = 0;
            
            // Move the position based on the current heading, step size and time delta.
            if (this.heading != null) {
                x += Math.cos(this.heading) * Math.round(this.step * $.Game.stepFactor);
                z += Math.sin(this.heading) * Math.round(this.step * $.Game.stepFactor);
                
                if ($.Game.userInput || (this != $.ego)) {
                    // Check whether a room edge has been hit.
                    if (x < 0) edge = 1;
                    if ((x + this.width) > 960) edge = 6;
                    // This edge number is simply to stop ego. He won't leave the room.
                    if (z > 667) edge = 10;
                } else {
                    // Handle curb jump.
                    if ((z > 680) && (z < 740)) {
                        z = (this.direction == Sprite.OUT? 740 : 680);
                    }
                    if (z > 950) {
                        edge = 7;
                    }
                }
                
                // Check whether ego has walked to a door or path..
                if (z < 530) {
                    if (this == $.ego) {
                        // We stop user input already and allow the user to walk a bit further.
                        if (this == $.ego) $.Game.userInput = false;
                        // Fading effect as ego leaves through the door.
                        this.elem.style.opacity = 1.0 - ((530 - z) / 100);
                    } else {
                        // Non-ego actor has hit wall.
                        edge = (x < 480? (x < 100? 2 : 3) : (x < 860? 4 : 5));
                    }
                }
                if (z < 500) {
                    // Ego has now reached the horizon, so time for a room change. The x value
                    // tells us which exit it was.
                    edge = (x < 480? (x < 100? 2 : 3) : (x < 860? 4 : 5));
                }
                
                // Increment the step size the step increment, capping at the max step.
                if ((this.step += this.stepInc) > this.maxStep) this.step = this.maxStep;
            }
        
            if (edge) {
                this.hitEdge(edge);
            } else {
                // If x or z has changed, update the position.
                if ((x != this.x) || (z != this.z)) {
                    this.setPosition(x, y, z);
                    this.moved = true;
                }
            }
        } else {
            // If stationary then set step size back to 1, which allows closer movement
            // to the props.
            this.step = 1;
        }
    }
  
    /**
     * Updates this Sprite for the current animation frame.
     */
    update() {
        if (!this.moved) {
            this.move();
        }
    }
  
    /**
     * Invokes when this Sprite hits another Sprite. The default behaviour is to simply reset the
     * position. Can be overridden by sub-classes.
     */
    hit(obj) {
        if (this.moved) {
            this.reset();
        }
    }
  
    /**
     * Invoked when this Sprite hits and edge. The default behaviour is to kill off the Sprite. Can
     * be overridden by sub classes.
     *
     * @param {Array} edge If defined then this is an Array identifying the edge. Will be null if the edge is the ground.
     */
    hitEdge(edge) {
        // If the edge is not the ground, then kill off the Sprite.
        if (edge) this.stop();
    }
}

// These are constants use to represent the different directions.
Sprite.LEFT  = 0x01;
Sprite.RIGHT = 0x02;
Sprite.IN    = 0x04;
Sprite.OUT   = 0x08;

Sprite.DIRS = [Sprite.LEFT, Sprite.RIGHT, Sprite.IN, Sprite.OUT];
