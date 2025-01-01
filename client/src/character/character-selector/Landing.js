import camera from "../../env/Camera.js";
import light from "../../env/Light.js";
import loopMachine from "../../env/LoopMachine.js";
import renderer from "../../env/Renderer.js";
import resize from "../../env/Resize.js";
import scene from "../../env/Scene.js";
import cylinder from "../../env/shapes/Cylinder.js";
import characterSelector from "./characterSelector.js";

class Landing {
  constructor() {
    this.previous = null;
    // this.scene = scene;
    // document.querySelector(".landing button").addEventListener("click", () => {
      this.clean();
      //   this.scene = lazyLoad("./characterSelector.js");
      //   if (this.previous != null) {
      //     console.log("scene closing", this.previous.constructor.name);
      //     this.previous.close();
      //   }
      //   this.scene[scene].then((scene) => {
      //       console.log("scene loaded", scene.constructor.name);
      //       this.previous = scene;
      //     });
      this.open();
      //   this.setSceneList(
      //     lazyLoad("./characterSelector.js")
      //   );
      //   this.goTo("default"); //test
    // });
  }

  open() {
    scene.add(cylinder);
    cylinder.position.y = -0.1;
    characterSelector.start();
    scene.add(light);
    loopMachine.addCallback(this.render);
    loopMachine.start();
    const displacement = -0.5;
    camera.position.set(displacement, 2, 4);
    camera.lookAt(displacement, 1, 0);
    resize.start(renderer);
    const elem = document.querySelector("body");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  render() {
    renderer.render(scene, camera);
  }

  close() {
    scene.remove(cylinder);
    loopMachine.removeCallback(this.render);
    characterSelector.stop();
  }

  clean() {
    const landing = document.querySelector(".landing");
    landing.parentNode.removeChild(landing);
  }
}

export default Landing;
