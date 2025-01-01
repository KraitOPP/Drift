import camera from "./env/Camera.js";
import CharacterController from "./character/character-controller/CharacterController.js";
import machine from "./env/LoopMachine.js";
import renderer from "./env/Renderer.js";
import scene from "./env/Scene.js";
import Ami from "./character/Ami.js";
import Helen from "./character/Helen.js";
import Remy from "./character/Remy.js";
import Henry from "./character/Henry.js";
import texture from "./env/Texture.js";
import sky from "./env/shapes/Sky.js";
import plane from "./env/shapes/Plane.js";
import characterBox from "./collision/characterBox.js";
import coordinates from "./buildings/coordinates.js";
import Npc from "./character/Npc.js";

const boxes = [];
const USER = localStorage.getItem('user');

const buildBoxes = (coords) => {
  const box = new THREE.Box3();
  const { x, y, z } = coords;
  box.set(
    new THREE.Vector3(x - 1, y, z - 0.5),
    new THREE.Vector3(x + 1, y + 2, z + 0.5)
  );
  // const helper = new THREE.Box3Helper(box, "red");
  // console.log(box, helper);
  // scene.add(helper);
  boxes.push(box);
  return box;
};

const chara = new URLSearchParams(window.location.search).get("character");
console.log("Character : " + chara);
let AVATAR = Ami;
switch (chara) {
  case "Helen":
    AVATAR = Helen;
    break;
  case "Ami":
    AVATAR = Ami;
    break;
  case "Henry":
    AVATAR = Henry;
    break;
  case "Remy":
    AVATAR = Remy;
    break;
}

const loadBuilding = () =>
  new Promise((res, rej) => {
    const loader = new THREE.GLTFLoader();
    loader.load(
      "src/buildings/city/scene.gltf",
      (gltf) => {
        res(gltf);
      },
      (xhr) => {
        console.log("Loading... " + (xhr.loaded / xhr.total) * 100 + "%");
      },
      (err) => {
        rej(err);
      }
    );
  });

texture.sky.then((map) => {
  sky.material.map = map;
  sky.material.map.wrapS = THREE.RepeatWrapping;
  sky.material.map.wrapT = THREE.RepeatWrapping;
  sky.material.map.repeat.set(70, 50);
  sky.material.needsUpdate = true;
});

scene.background = new THREE.Color("#ffeded");

texture.ground.then((map) => {
  plane.material.map = map;
  plane.receiveShadow = true;
  plane.material.map.wrapS = THREE.RepeatWrapping;
  plane.material.map.wrapT = THREE.RepeatWrapping;
  plane.material.map.repeat.set(15, 15);
  plane.material.needsUpdate = true;
  plane.rotation.x += Math.PI * 0.5;
});

let characterController = null;
machine.addCallback(() => {
  if (characterController) characterController.run();
  renderer.render(scene, camera);
});

let avatar;
let avatarController = null;
AVATAR.then((mesh) => {
  console.log(mesh);
  avatar = mesh;
  avatar.player = true;
  avatar.modes = Ami.modes;
  avatar.castShadow = true;
  avatar.receiveShadow = false;
  scene.add(avatar);
  avatarController = new CharacterController(avatar);

  avatarController.start();
  machine.addCallback(() => {
    characterBox.setFromObject(avatar);
  });

  loadBuilding().then((mesh) => {
    console.log(mesh);
    mesh.scene.position.set(-5, 0.01, -35);
    mesh.scene.rotation.set(0, Math.PI, 0);
    mesh.scene.scale.set(0.005, 0.005, 0.005);
    scene.add(mesh.scene);
  });

  Npc.then((npc) => {
    console.log("NPC");
    npc.position.set(36, 0.01, 16);
    npc.rotation.y = -(Math.PI * 0.5);
    const coord = {
      name: "NPC",
      x: 36,
      y: 0,
      z: 16,
    };
    const npcBox = buildBoxes(coord);
    let flag = true,
      current = this;
    const root = document.querySelector(".root");
    const clickCallback = () => {
      if (npcBox.intersectsBox(characterBox)) {
        if (flag) {
          root.innerHTML = `press Enter to Initiate a convo`;
          flag = false;
          window.addEventListener("keydown", clickHandle);
        }
      } else {
        if (!flag && current == this) {
          window.removeEventListener("keydown", clickHandle);
          root.innerHTML = "";
          flag = true;
        }
      }
    };

    const clickHandle = (event) => {
      if (event.keyCode == 13) {
        window.open(`./room.html?room=4c04fe92-5556-4f76-b31c-79c96498f6f4&user=${USER}`);
      }
    };
    machine.addCallback(clickCallback);
    scene.add(npc);
  });

  // new THREE.FBXLoader().load(
  //   "src/buildings/city.fbx",
  //   (mesh) => {
  //     console.log(mesh);
  //     mesh.scale.set(3, 3, 3);
  //     scene.add(mesh);
  //   },
  //   (xhr) => {},
  //   (err) => {
  //     console.log(err);
  //   }
  // );

  for (let i of coordinates) {
    console.log(i);
    const box = buildBoxes(i);
    box.name = i.name;
    scene.add(box);

    // let flag = true,
    //   current = this;
    // const root = document.querySelector(".root");
    // const clickCallback = () => {
    //   if (box.intersectsBox(avatar)) {
    //     if (flag) {
    //       root.innerHTML = `PRESS ENTER`;
    //       flag = false;
    //       window.addEventListener("keydown", clickHandle);
    //     }
    //   } else {
    //     if (!flag && current == this) {
    //       window.removeEventListener("keydown", clickHandle);
    //       root.innerHTML = "";
    //       flag = true;
    //     }
    //   }
    // };

    // const clickHandle = (event) => {
    //   if (event.keyCode == 13) {
    //     console.log("ENTERED");
    //   }
    // };
    // machine.addCallback(clickCallback);
  }

  for (let box of boxes) {
    let flag = true,
      current = this;
    const root = document.querySelector(".root");
    const clickCallback = () => {
      if (box.intersectsBox(characterBox)) {
        if (flag) {
          root.innerHTML = `PRESS ENTER`;
          flag = false;
          window.addEventListener("keydown", clickHandle);
        }
      } else {
        if (!flag && current == this) {
          window.removeEventListener("keydown", clickHandle);
          root.innerHTML = "";
          flag = true;
        }
      }
    };

    const clickHandle = (event) => {
      if (event.keyCode == 13) {
        console.log(box);
        window.open("./shop.html");
      }
    };
    machine.addCallback(clickCallback);
  }

  // buildingBox();

  // Building[0].mesh.then((mesh) => addBuilding(mesh, Building[0]));
  // Building[1].mesh.then((mesh) => addBuilding(mesh, Building[1]));
  // Building[2].mesh.then((mesh) => addBuilding(mesh, Building[2]));
  // Building[3].mesh.then((mesh) => addBuilding(mesh, Building[3]));

  // console.log(scene);
});

// let helen;
// let helenController = null;
// Helen.then((mesh) => {
//   helen = mesh;
//   helen.modes = Helen.modes;
//   scene.add(helen);
//   helenController = new CharacterController(helen);
//   helenController.start();
// });

// Building.forEach((building) => {
//   building.then((group) => {
//     scene.add(group);
//     group.scale.set(0.003, 0.003, 0.003);
//     group.position.set(-10, 0, 20);
//     buildings.push(group);
//     // texture.building1.then((map) => {
//     //   group.children[0].receiveShadow = true;
//     //   group.children[1].receiveShadow = true;
//     //   group.children[0].material.forEach((element) => {
//     //     element.map = map;
//     //   });
//     //   group.children[1].material.forEach((element) => {
//     //     element.map = map;
//     //   });
//     //   group.children[0].material.forEach((element) => {
//     //     element.map.wrapS = THREE.RepeatWrapping;
//     //   });
//     //   group.children[1].material.forEach((element) => {
//     //     element.map.wrapS = THREE.RepeatWrapping;
//     //   });
//     //   group.children[0].material.forEach((element) => {
//     //     element.map.wrapT = THREE.RepeatWrapping;
//     //   });
//     //   group.children[1].material.forEach((element) => {
//     //     element.map.wrapT = THREE.RepeatWrapping;
//     //   });
//     //   group.children[0].material.forEach((element) => {
//     //     element.needsUpdate = true;
//     //   });
//     //   group.children[1].material.forEach((element) => {
//     //     element.needsUpdate = true;
//     //   });
//     // });
//   });
// });

// Building.forEach((building) => {
//   building.mesh.then((group) => {
//     let scale = building.scale || 0.003;
//     group.scale.set(scale, scale, scale);
//     group.position.set(building.coordinates.x, 0, building.coordinates.z);
//     buildings.push(group);
//     scene.add(group);
//   });
// });

// window.addEventListener("keydown", (e) => {
//   if (e.keyCode == 13) console.log(avatar.position);
// });
