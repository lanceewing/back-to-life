class Ego extends Actor {

    /**
     * Creates a new Ego. This is the main character whom the player controls. The
     * name originates with the old Sierra On-Line 3D animated adventure games. There
     * should be only one instance of this class.
     */
    constructor() {
        super(50, 150, 'black', 0.95, 5, 'black', null, null);//'rgb(20, 30, 20)');
        this.elem.classList.add('ego');
        this.elem.id = 'me';
        this.nesw = 2;
        this.setDirection(Sprite.OUT);
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
            if (edge < 10) {
                let edgeData = $.Game.rooms[this.room - 1][edge];
                if (edgeData) {
                    $.Game.userInput = false;
                    
                    // Hide ego before we reposition him to the new entry point.
                    this.hide();
                    
                    // Set the new room for ego.
                    this.room = edgeData;
                    
                    // Work out the new position for ego.
                    switch (edge) {
                        case 1: // Hit left edge, so come in on right edge.
                            this.setPosition(960 + this.width, this.y, 600);
                            this.setDirection(Sprite.LEFT);
                            this.moveTo(960 - this.width - 50, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;

                        case 2: // Hit left path, so come in from right path.
                            this.setPosition(885, this.y, 500);
                            this.setDirection(Sprite.OUT);
                            this.moveTo(910, 600, function() {
                                $.Game.userInput = true;
                            });
                            this.nesw = ((this.nesw + 1) & 0x03);
                            break;

                        case 3: // Hit left door, so come in through right door.
                            this.setPosition(645, this.y, 500);
                            this.setDirection(Sprite.OUT);
                            this.moveTo(670, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;

                        case 4: // Hit right door, so come in through left door.
                            this.setPosition(268, this.y, 500);
                            this.setDirection(Sprite.OUT);
                            this.moveTo(293, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;

                        case 5: // Hit right path, so come in from left path.
                            this.setPosition(25, this.y, 500);
                            this.setDirection(Sprite.OUT);
                            this.moveTo(50, 600, function() {
                                $.Game.userInput = true;
                            });
                            this.nesw = ((this.nesw - 1) & 0x03);
                            break;

                        case 6: // Hit right edge, so come in on left edge.
                            this.setPosition(0 - this.width * 2, this.y, 600);
                            this.setDirection(Sprite.RIGHT);
                            this.moveTo(this.width + 50, 600, function() {
                                $.Game.userInput = true;
                            });
                            break;

                        case 7: // Hit road edge, so come in at road edge.
                            this.setDirection(Sprite.IN);
                            this.moveTo($.ego.x, 600, function() {
                                $.Game.userInput = true;
                            });
                            this.nesw = ((this.nesw + 2) & 0x03);
                            break;
                    }
                    
                    this.step = 1;
                }
            }
        }
    }
}