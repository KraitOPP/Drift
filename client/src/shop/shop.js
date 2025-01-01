import loadBuildings from "./loadShop.js";

const root = document.querySelector("#root");
const KEYS = {
  a: 65,
  s: 83,
  w: 87,
  d: 68,
};

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

class InputController {
  constructor(target) {
    this.target = target || document;
    this.initialize();
  }

  initialize() {
    this.pointer = {
      leftBtn: false,
      rightBtn: false,
      mouseXDelta: 0,
      mouseYDelta: 0,
      mouseX: 0,
      mouseY: 0,
    };
    this.caches = null;
    this.keys = {};
    this.previousKeys = {};
    this.target.addEventListener(
      "mousedown",
      (e) => this.onMouseDown(e),
      false
    );
    this.target.addEventListener(
      "mousemove",
      (e) => this.onMouseMove(e),
      false
    );
    this.target.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
    this.target.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    this.target.addEventListener("keyup", (e) => this.onKeyUp(e), false);
  }

  onMouseMove(event) {
    this.pointer.mouseX = event.pageX - window.innerWidth / 2;
    this.pointer.mouseY = event.pageY - window.innerHeight / 2;

    if (this.caches === null) {
      this.caches = { ...this.pointer };
    }

    this.pointer.mouseXDelta = this.pointer.mouseX - this.caches.mouseX;
    this.pointer.mouseYDelta = this.pointer.mouseY - this.caches.mouseY;
  }

  onMouseDown(e) {
    this.onMouseMove(e);
    switch (e.button) {
      case 0: {
        this.pointer.leftBtn = true;
        break;
      }
      case 2: {
        this.pointer.rightBtn = true;
        break;
      }
    }
  }

  onMouseUp(e) {
    this.onMouseMove(e);
    switch (e.button) {
      case 0: {
        this.pointer.leftBtn = false;
        break;
      }
      case 2: {
        this.pointer.rightBtn = false;
        break;
      }
    }
  }

  onKeyDown(e) {
    this.keys[e.keyCode] = true;
  }

  onKeyUp(e) {
    this.keys[e.keyCode] = false;
  }

  key(keyCode) {
    return !!this.keys[keyCode];
  }

  isReady() {
    return this.caches !== null;
  }

  update() {
    if (this.caches !== null) {
      this.pointer.mouseXDelta = this.pointer.mouseX - this.caches.mouseX;
      this.pointer.mouseYDelta = this.pointer.mouseY - this.caches.mouseY;

      this.caches = { ...this.pointer };
    }
  }
}

class FirstPersonCamera {
  constructor(camera, objects) {
    this.camera = camera;
    this.controller = new InputController();
    this.rotation = new THREE.Quaternion();
    this.translation = new THREE.Vector3(-6, 2, -14);
    this.anglePHI = 0;
    this.phiSpeed = 8;
    this.angleTHETA = 0;
    this.thetaSpeed = 5;
    this.isHeadBobActive = false;
    this.headBobTimer = 0;
    this.objects = objects;
  }

  update(elaspedTimme) {
    this.updateRotation(elaspedTimme);
    this.updateCamera(elaspedTimme);
    this.updateTranslation(elaspedTimme);
    this.updateHeadBob(elaspedTimme);
    this.controller.update(elaspedTimme);
  }

  updateCamera() {
    this.camera.quaternion.copy(this.rotation);
    this.camera.position.copy(this.translation);

    const movement = new THREE.Vector3(0, 0, -1);
    movement.applyQuaternion(this.rotation);

    const dir = movement.clone();

    movement.multiplyScalar(100);
    movement.add(this.translation);

    let nearest = movement;
    const result = new THREE.Vector3();
    const ray = new THREE.Ray(this.translation, dir);
    for (let i = 0; i < this.objects.length; ++i) {
      if (ray.intersectBox(this.objects[i], result)) {
        if (result.distanceTo(ray.origin) < nearest.distanceTo(ray.origin)) {
          nearest = result.clone();
        }
      }
    }

    this.camera.lookAt(nearest);
  }

  updateHeadBob(elapsedTime) {
    if (this.isHeadBobActive) {
      const wavelength = Math.PI;
      const nextStep =
        1 + Math.floor(((this.headBobTimer + 0.000001) * 10) / wavelength);
      const stepTime = (nextStep * wavelength) / 10;
      this.headBobTimer = Math.min(this.headBobTimer + elapsedTime, stepTime);

      if (this.headBobTimer == stepTime) {
        this.isHeadBobActive = false;
      }
    }
  }

  updateTranslation(elapsedTime) {
    const forwardSpeed =
      (this.controller.key(KEYS.w) ? 1 : 0) +
      (this.controller.key(KEYS.s) ? -1 : 0);
    const strafeSpeed =
      (this.controller.key(KEYS.a) ? 1 : 0) +
      (this.controller.key(KEYS.d) ? -1 : 0);

    const quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.anglePHI);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(quaternionX);
    forward.multiplyScalar(forwardSpeed * elapsedTime * 10);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(quaternionX);
    left.multiplyScalar(strafeSpeed * elapsedTime * 10);

    this.translation.add(forward);
    this.translation.add(left);

    if (forwardSpeed != 0 || strafeSpeed != 0) {
      this.isHeadBobActive = true;
    }
  }

  updateRotation(elapsedTime) {
    const xh = this.controller.pointer.mouseXDelta / window.innerWidth;
    const yh = this.controller.pointer.mouseYDelta / window.innerHeight;

    this.anglePHI += -xh * this.phiSpeed;
    this.angleTHETA = clamp(
      this.angleTHETA + -yh * this.thetaSpeed,
      -Math.PI / 3,
      Math.PI / 3
    );

    const quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.anglePHI);
    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.angleTHETA);

    const q = new THREE.Quaternion();
    q.multiply(quaternionX);
    q.multiply(qz);

    this.rotation.copy(q);
  }
}

class __Init__ {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.initializeRenderer();
    this.initializeLights();
    this.initializeScene();
    this.initializeDemo();
    this.initializeCasters();

    this.previousRAF = null;
    this.raf();
    this.onWindowResize();
  }

  initializeDemo() {
    this.fpsCamera = new FirstPersonCamera(this.camera, this.objects);
  }

  initializeRenderer() {
    const fov = 60;
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const aspect = size.width / size.height;
    const near = 1.0;
    const far = 1000.0;

    this.webGLRenderer = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.webGLRenderer.shadowMap.enabled = true;
    this.webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.webGLRenderer.setSize(size.width, size.height);
    this.webGLRenderer.physicallyCorrectLights = true;
    this.webGLRenderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(this.webGLRenderer.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(-20, 2, -10);

    this.scene = new THREE.Scene();

    this.uiCamera = new THREE.OrthographicCamera(
      -1,
      1,
      1 * aspect,
      -1 * aspect,
      1,
      1000
    );
    this.uiScene = new THREE.Scene();
  }

  initializeScene() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "assets/env/posx.jpg",
      "assets/env/negx.jpg",
      "assets/env/posy.jpg",
      "assets/env/negy.jpg",
      "assets/env/posz.jpg",
      "assets/env/negz.jpg",
    ]);

    texture.encoding = THREE.sRGBEncoding;
    this.scene.background = texture;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200, 10, 10),
      new THREE.MeshStandardMaterial({})
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;

    loadBuildings(this.scene).then(([mesh]) => {
      mesh.scene.scale.set(2, 2, 2);
      this.scene.add(mesh.scene);
    });

    window.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) console.log(this.camera.position);
    });

    const concreteMaterial = this.loadMaterial("concrete3-", 4);

    const wall1 = new THREE.Mesh(
      new THREE.BoxGeometry(250, 150, 4),
      concreteMaterial
    );
    wall1.position.set(0, -40, -100);
    wall1.castShadow = true;
    wall1.receiveShadow = true;
    this.scene.add(wall1);

    const wall2 = new THREE.Mesh(
      new THREE.BoxGeometry(250, 150, 4),
      concreteMaterial
    );
    wall2.position.set(0, -40, 100);
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    this.scene.add(wall2);

    const wall3 = new THREE.Mesh(
      new THREE.BoxGeometry(4, 150, 250),
      concreteMaterial
    );
    wall3.position.set(100, -40, 0);
    wall3.castShadow = true;
    wall3.receiveShadow = true;
    this.scene.add(wall3);

    const wall4 = new THREE.Mesh(
      new THREE.BoxGeometry(4, 150, 250),
      concreteMaterial
    );
    wall4.position.set(-100, -40, 0);
    wall4.castShadow = true;
    wall4.receiveShadow = true;
    this.scene.add(wall4);

    const meshes = [plane, wall1, wall2, wall3, wall4];

    this.objects = [];

    for (let i = 0; i < meshes.length; ++i) {
      const b = new THREE.Box3();
      b.setFromObject(meshes[i]);
      this.objects.push(b);
    }
  }

  initializeCasters() {
    this.coords =
      [
        {
          name: "Chocolate",
          description: "This is a tasty chocolate",
          x: -19.101692605853742,
          y: 2,
          z: -25.45750386192209,
        },
        {
          name: "Bakery Snacks",
          description: "This is a tasty chocolate",
          x: -19.539050594125772,
          y: 2,
          z: -22.61754425216628,
        },
        {
          name: "Drink",
          description: "This is a tasty chocolate",
          x: -19.727536144903684,
          y: 2,
          z: -18.668555746298356,
        },
        {
          name: "Snacks",
          description: "This is a tasty chocolate",
          x: -2.922929969706132,
          y: 2,
          z: -16.42277773358027,
        },
        {
          name: "Toileteries",
          description: "This is a tasty chocolate",
          x: -2.7905911672521038,
          y: 2,
          z: -21.707519739362045,
        },
        {
          name: "Chips",
          description: "This is a tasty chocolate",
          x: -7.105888728592489,
          y: 2,
          z: -24.075620137927643,
        },
      ] || [];

    this.boxes = [];
    for (let i of this.coords) {
      const box = new THREE.Box3();
      const { x, y, z } = i;
      box.set(
        new THREE.Vector3(x - 1, y, z - 0.5),
        new THREE.Vector3(x + 1, y, z + 0.5)
      );
      box.name = i.name;
      box.description = i.description;
      // const helper = new THREE.Box3Helper(box, "red");
      // console.log(box, helper);
      // this.scene.add(helper);
      this.boxes.push(box);
    }
  }

  initializeLights() {
    const distance = 50.0;
    const angle = Math.PI / 4.0;
    const penumbra = 0.5;
    const decay = 1.0;

    let light = new THREE.SpotLight(
      0xffffff,
      100.0,
      distance,
      angle,
      penumbra,
      decay
    );
    light.castShadow = true;
    light.shadow.bias = -0.00001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 100;

    light.position.set(25, 25, 0);
    light.lookAt(0, 0, 0);
    this.scene.add(light);

    const upColour = 0xffff80;
    const downColour = 0x808080;
    light = new THREE.HemisphereLight(upColour, downColour, 0.5);
    light.color.setHSL(0.6, 1, 0.6);
    light.groundColor.setHSL(0.095, 1, 0.75);
    light.position.set(0, 4, 0);
    this.scene.add(light);
  }

  loadMaterial(name, tiling) {
    const mapLoader = new THREE.TextureLoader();
    const maxAnisotropy = this.webGLRenderer.capabilities.getMaxAnisotropy();

    const metalMap = mapLoader.load("assets/textures/" + name + "metallic.png");
    metalMap.anisotropy = maxAnisotropy;
    metalMap.wrapS = THREE.RepeatWrapping;
    metalMap.wrapT = THREE.RepeatWrapping;
    metalMap.repeat.set(tiling, tiling);

    const albedo = mapLoader.load("assets/textures/" + name + "albedo.png");
    albedo.anisotropy = maxAnisotropy;
    albedo.wrapS = THREE.RepeatWrapping;
    albedo.wrapT = THREE.RepeatWrapping;
    albedo.repeat.set(tiling, tiling);
    albedo.encoding = THREE.sRGBEncoding;

    const normalMap = mapLoader.load("assets/textures/" + name + "normal.png");
    normalMap.anisotropy = maxAnisotropy;
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(tiling, tiling);

    const roughnessMap = mapLoader.load(
      "assets/textures/" + name + "roughness.png"
    );
    roughnessMap.anisotropy = maxAnisotropy;
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(tiling, tiling);

    const material = new THREE.MeshStandardMaterial({
      metalnessMap: metalMap,
      map: albedo,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
    });

    return material;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.uiCamera.left = -this.camera.aspect;
    this.uiCamera.right = this.camera.aspect;
    this.uiCamera.updateProjectionMatrix();

    this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  raf() {
    requestAnimationFrame((t) => {
      if (this.previousRAF === null) {
        this.previousRAF = t;
      }

      this.step(t - this.previousRAF);
      this.webGLRenderer.autoClear = true;
      this.webGLRenderer.render(this.scene, this.camera);
      this.webGLRenderer.autoClear = false;
      this.webGLRenderer.render(this.uiScene, this.uiCamera);
      this.previousRAF = t;
      this.raf();

      var flag = false;
      this.boxes.forEach((ele) => {
        if (Math.floor(ele.distanceToPoint(this.camera.position)) == 0) {
          flag = true;
          root.innerHTML = `<div class="product__box"><div class="product__box_inner" data-deep-animate="false" data-deep-animate-time=".7" data-deep-ui="true" ><div class="product__box_inner__title" data-depth="20">${ele.name}</div><div class="product__box_inner__decal"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/decalBg.png"/></div><div class="product__box_inner__text" data-depth="10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum itaqueid culpa, iusto dolorum voluptates aspernatur ducimus vel incidunteius laborum? Molestias suscipit voluptate provident!</div><div class="product__box_inner__cta" data-depth="31">Press Enter</div></div></div>`;
          // this.scene.remove(this.sprite);
        }
      });
    });
  }

  step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    // this.controls.update(timeElapsedS);
    this.fpsCamera.update(timeElapsedS);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new __Init__();
});
