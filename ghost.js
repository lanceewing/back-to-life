class Ghost extends Actor {

    constructor() {
        //super(50, 150, 'rgba(128, 128, 128, 0.5)', 0.95, 5, 'rgba(128, 128, 128, 0.5)', null, null);
        super(50, 150, 'grey', 0.95, 5, 'grey', null, null, 'grey');
        this.elem.className = 'ghost';
        this.setDirection(Sprite.LEFT);
    }

    touching(obj, gap) {
        return false;
    }

}