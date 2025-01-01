class RotationController {
  setUser(user) {
    this.user = user;
    this.user.rotation = this;
    this.rotation = { x: 0, y: 0 };
    this.coord = new THREE.Vector2();
    this.interpolation = 0.1;
  }
  
  run() {
    this.rotation.x = THREE.MathUtils.lerp(
      this.rotation.x,
      -this.user.x,
      this.interpolation
    );
    this.rotation.y = THREE.MathUtils.lerp(
      this.rotation.y,
      this.user.y,
      this.interpolation
    );
    this.user.mesh.rotation.y = this.coord
      .set(this.rotation.y, this.rotation.x)
      .angle(); // +- Math.PI * .25
  }
}

export default RotationController;
