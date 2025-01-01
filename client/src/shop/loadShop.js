const loadBuilding = () =>
  new Promise((res, rej) => {
    const loader = new THREE.GLTFLoader();
    loader.load(
      "assets/models/shop1/scene.gltf",
      (gltf) => {
        console.log(gltf);
        res([gltf]);
      },
      (xhr) => {
        console.log("Loading... " + (xhr.loaded / xhr.total) * 100 + "%");
      },
      (err) => {
        rej(err);
      }
    );
  });

export default loadBuilding;
