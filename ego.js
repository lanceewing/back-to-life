class Ego extends Actor {

    /**
     * Creates a new Ego. This is the main character whom the player controls. The
     * name originates with the old Sierra On-Line 3D animated adventure games. There
     * should be only one instance of this class.
     * 
     * @constructor
     * @extends Actor
     */
    constructor() {
        //super(50, 150, 'grey', 0.95, 5, 'white', 'grey', 'red');
        super(50, 150, 'black', 0.95, 10, 'black', null, 'black');
        this.elem.classList.add('ego');
        this.elem.id = 'me';
        this.setDirection(Sprite.OUT);
    }

    /**
     * Invoked when Ego has hit another Sprite.
     * 
     * @param obj The Sprite that Ego has hit.
     */
    hit(obj) {
        // Reset the position to the last one that isn't touching another Sprite. Resetting
        // the position prevents Ego from walking through obstacles. 
        for (;this.reset() && this.touching(obj););
    }
  
    /**
     * Invoked by the move method when Ego has hit an edge. If the edge is the ground, then the
     * edge parameter is undefined. If the edge is one of the four directions, then Ego is 
     * attempting to exit the current room. 
     *  
     * @param {Array} edge If defined, it will be an array that represents the edge that was hit.
     */
    hitEdge(edge) {
        if (edge) {
            // Stop moving.
            this.destX = this.destZ = -1;
            this.heading = null;
            this.cell = 0;
            
            // Now check if there is a room on this edge.
            if (edge < 5) {
                let edgeData = $.Game.rooms[this.room - 1][edge];
                if (edgeData) {
                    $.Game.userInput = false;
                    
                    // Hide ego before we reposition him to the new entry point.
                    this.hide();
                    
                    // Set the new room for ego.
                    this.room = edgeData[0];
                    
                    // Work out the new position for ego.
                    switch (edgeData[1]) {
                        case 1: // From the left edge of screen
                            this.setPosition(0 - this.width * 2, this.y, 600);
                            this.setDirection(Sprite.RIGHT);
                            this.moveTo(this.width + 50, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;
                        
                        case 2: // From the left door
                            this.setPosition(268, this.y, 500);
                            this.setDirection(Sprite.OUT);
                            this.moveTo(293, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;
                        
                        case 3: // From the right door
                            this.setPosition(645, this.y, 500);
                            this.setDirection(Sprite.OUT);
                            this.moveTo(670, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;
                        
                        case 4: // From the right edge of screen
                            this.setPosition(960 + this.width, this.y, 600);
                            this.setDirection(Sprite.LEFT);
                            this.moveTo(960 - this.width - 50, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;
                    }
                    
                    this.step = 1;
                }
            }
        }
    }
}