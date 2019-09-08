class Ghost extends Actor {

    constructor(width) {
        //super(50, 150, 'rgba(128, 128, 128, 0.5)', 0.95, 5, 'rgba(128, 128, 128, 0.5)', null, null);
        super(width, width * 3, 'grey', 0.95, 0.5, 'grey', null, null, 'grey');
        this.elem.className = 'ghost';
        this.chooseDir();
        this.ignore = true;
        //$.Game.random(4)
    }

    update() {
        super.update();
        if (($.Game.random(200) == 1) && (this.x > 300) && (this.x < 600)) {
            this.chooseDir();
        }
    }

    hitEdge(edge) {
        super.hitEdge(edge);
        this.chooseDir();
    }

    /**
     * 
     */
    chooseDir() {
        // TODO: Try random heading instead, then convert to direction.
        this.setDirection(Sprite.DIRS[$.Game.random(4) - 1]);
        this.heading = this.dirToHeading(this.direction);
    }

    /**
     * Converts a direction value to a heading value.
     * 
     * @param {*} dir The direction value to convert.
     */
    dirToHeading(dir) {
        return Math.atan2(((dir & 0x08) >> 3) - ((dir & 0x04) >> 2), ((dir & 0x02) >> 1) - (dir & 0x01));
    }
}