class Node {
    constructor(x, y, walkable) {
      this.x = x;
      this.y = y;

      this.walkable = walkable;

      this.g = 0;
      this.h = 0;
      this.f = 0;
    
      this.parent;
    }
}