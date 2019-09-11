class Ghost extends Actor {

    constructor(width) {
        super(width, width * 3, 'grey', 0.95, 0.5, 'grey', null, null, 'grey');
        this.elem.className = 'ghost';
        this.chooseDir();
        this.ignore = true;
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