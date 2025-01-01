import camera from "./env/Camera.js";
import eventEmitter from "./env/EventEmitter.js";
import keyListener from "./env/KeyListener.js";
import light from "./env/Light.js";
import machine from "./env/LoopMachine.js";
import renderer from "./env/Renderer.js";
import resize from "./env/Resize.js";
import scene from "./env/Scene.js";
import plane from "./env/shapes/Plane.js";
import sky from "./env/shapes/Sky.js";
import "./Bootstrap.js";

camera.position.set(0, 1.8, -3);
scene.add(light);
scene.add(plane);
scene.add(sky);

// renderer.setClearColor("red");
// renderer.set("red");
// renderer.setClearColor("#FFEDEDC2");
// renderer.setClearColor("#F2F8F7");
renderer.setClearColor("red");

scene.fog = new THREE.Fog("#ffeded", 10, 16);
//// scene.fog = new THREE.FogExp2(0xcce0ff, 0.02);

keyListener.setCaster((data) => {
  console.log(data);
  eventEmitter.dispatch("keyListener", data);
});

keyListener.start();
machine.start();
resize.start(renderer);

// soundHandler.setAsLoop("environment");
// soundHandler.setVolume("environment", 0.3);
// soundHandler.play("environment");

