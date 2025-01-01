const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 18);
const material = new THREE.MeshPhongMaterial({ color: "#00D7FF" });
const cylinder = new THREE.Mesh(geometry, material);

export default cylinder;
