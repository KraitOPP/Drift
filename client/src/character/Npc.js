import Loader from "../env/Loader.js";

const folder = "src/character/";
const animation = folder + "animations/idle.fbx";

const Npc = new Loader(folder + "npc.fbx", [animation], 0.02).getModel();

export default Npc;
