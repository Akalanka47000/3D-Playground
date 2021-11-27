import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function modelLoader(url) {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data), null, reject);
  });
}
