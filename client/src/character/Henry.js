import Loader from "../env/Loader.js";
import fileList from "./FileList.js";

const folder = "src/character/";

const list = [];

Object.keys(fileList).forEach((element, index) => {
  list[index] = folder + "animations/" + fileList[index];
});

const modes = {
  normal: {
    idle: [0, 1, false],
    jump: [1, 1, true],
    left: [2, 1, false],
    right: [5, 1, false],
    ahead: [9, 1, false],
    back: [9, -1, false],
    clap: [10, -1, false],
  },
  run: {
    idle: [0, 1, false],
    left: [3, 1, false],
    right: [6, 1, false],
    ahead: [8, 1, false],
    back: [9, -1, false],
  },
};

const Henry = new Loader(folder + "henry.fbx", list, 0.02).getModel();
Henry.modes = modes;

export default Henry;
