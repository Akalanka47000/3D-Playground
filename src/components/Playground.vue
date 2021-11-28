<template>
  <div>
    <b-sidebar
      id="sidebar-1"
      bg-variant="dark"
      text-variant="light"
      no-header
      shadow
    >
      <h3 class="mt-5 ml-3">Controls</h3>
      <v-treeview :items="controlSettings" hoverable dense class="pt-4">
        <template v-slot:label="{ item }">
          <b-col :class="!item.children ? 'mb-3' : ''">
            <span v-if="item.children" class="text-light">{{ item.name }}</span>
            <b-form-group
              v-if="!item.children"
              :label="item.name"
              class="mr-5"
              ref="input1"
            >
              <b-form-input
                v-if="item.type === 'input'"
                type="number"
                size="sm"
                step="0.1"
                v-model="models[selectedModel][item.property][item.axis]"
                @input="change"
              />
              <b-form-checkbox
                v-if="item.type === 'checkbox'"
                v-model="models[selectedModel][item.property]"
                @input="change"
              />
            </b-form-group>
          </b-col>
        </template>
      </v-treeview>
    </b-sidebar>
    <div ref="canvas"></div>
    <b-row
      class="position-fixed bottom-0 vw-100 d-flex justify-content-end align-items-end"
    >
      <div class="position-relative mb-5 mr-5 text-light w-25">
        <input
          type="file"
          class="opacity-0"
          ref="fileInput"
          @change="onFileUpload"
          webkitdirectory
          multiple
        />
        <b-button
          variant="primary"
          size="lg"
          class="mb-5 mr-5 text-light w-100"
          @click="onUploadClick"
        >
          Upload Modal
        </b-button>
      </div>
    </b-row>
  </div>
</template>

<script>
import * as THREE from "three";
import TrackballControls from "three-trackballcontrols";

export default {
  name: "Playground",
  data() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const light = new THREE.DirectionalLight("hsl(0, 100%, 100%)");
    const ambientLight = new THREE.AmbientLight(0x404040);
    const axes = new THREE.AxesHelper(5);

    return {
      scene: scene,
      camera: camera,
      controls: {},
      renderer: renderer,
      light: light,
      ambientLight: ambientLight,
      axes: axes,
      speed: 0.01,
      models: {},
      objectSettings: {},
      modelFile: null,
      selectedModel: "gladiator",
      controlSettings: [
        {
          id: 1,
          name: "Position",
          children: [
            {
              id: 2,
              name: "Position-X",
              type: "input",
              property: "position",
              axis: "x",
            },
            {
              id: 3,
              name: "Position-Y",
              type: "input",
              property: "position",
              axis: "y",
            },
            {
              id: 4,
              name: "Position-Z",
              type: "input",
              property: "position",
              axis: "z",
            },
          ],
        },
        {
          id: 5,
          name: "Rotation",
          children: [
            {
              id: 6,
              name: "Rotation-X",
              type: "input",
              property: "rotation",
              axis: "x",
            },
            {
              id: 7,
              name: "Rotation-Y",
              type: "input",
              property: "rotation",
              axis: "y",
            },
            {
              id: 8,
              name: "Rotation-Z",
              type: "input",
              property: "rotation",
              axis: "z",
            },
            {
              id: 9,
              name: "Auto Rotate",
              type: "checkbox",
              property: "autoRotateEnabled",
            },
          ],
        },
        {
          id: 10,
          name: "Scale",
          children: [
            {
              id: 11,
              name: "Scale-X",
              type: "input",
              property: "scale",
              axis: "x",
            },
            {
              id: 12,
              name: "Scale-Y",
              type: "input",
              property: "scale",
              axis: "y",
            },
            {
              id: 13,
              name: "Scale-Z",
              type: "input",
              property: "scale",
              axis: "z",
            },
          ],
        },
      ],
    };
  },
  async mounted() {
    this.$refs.canvas.appendChild(this.renderer.domElement);
    this.initializeScene();
    this.initializeCamera();
    this.initializeControls();
    this.initializeLighting();
    await this.loadModal("gladiator", "/models/gladiator/gladiator.glb");
    this.animate();
    window.addEventListener("resize", this.onWindowResize, false);
  },
  methods: {
    initializeScene() {
      this.scene.add(this.camera);
      this.scene.add(this.light);
      this.scene.add(this.ambientLight);
      this.scene.add(this.axes);
      this.scene.background = new THREE.Color(0x383838);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      //objects
      const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
      const groundTexture = new THREE.TextureLoader().load(
        "/models/ground.jpg"
      );
      groundTexture.wrapS = THREE.RepeatWrapping;
      groundTexture.wrapT = THREE.RepeatWrapping;
      groundTexture.repeat.x = 9;
      groundTexture.repeat.y = 9;
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: groundTexture,
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.receiveShadow = true;
      this.scene.add(plane);
    },
    initializeCamera() {
      this.camera.position.x = 0;
      this.camera.position.y = 1;
      this.camera.position.z = 5;
    },
    initializeControls() {
      this.controls = new TrackballControls(this.camera, this.$refs.canvas);
      this.controls.rotateSpeed = 2.0;
      this.controls.zoomSpeed = 5;
      this.controls.panSpeed = 0.8;
      this.controls.noZoom = false;
      this.controls.noPan = false;
      this.controls.staticMoving = true;
      this.controls.dynamicDampingFactor = 0.3;
    },
    initializeLighting() {
      this.ambientLight.intensity = 3.5;
      this.light.position.set(1, 1, 1);
      this.light.intensity = 0.4;
      this.light.castShadow = true;
      this.light.shadow.mapSize.width = 512;
      this.light.shadow.mapSize.height = 512;
      this.light.shadow.camera.near = 0.5;
      this.light.shadow.camera.far = 500;
    },
    async loadModal(key, url) {
      const modal = await this.modelLoader(url);
      this.scene.add(modal.scene);
      this.models[key] = modal.scene;
      this.models[key].children.forEach((modalChild) => {
        modalChild.castShadow = true;
      });
      this.models[key].autoRotateEnabled = key === 'gladiator' ? true : false;
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      for (const key in this.models) {
        if (this.models[key].autoRotateEnabled) {
          this.models[key].rotation.y = Number(this.models[key].rotation.y) + this.speed;
        }
      }
      this.controls.update();
    },
    change() {
      console.log(this.$refs.input);
      console.log(this.models[this.selectedModel]);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onUploadClick() {
      const fileInput = this.$refs.fileInput;
      fileInput.click();
    },
    async onFileUpload() {
      const uploadedFiles = this.$refs.fileInput.files;
      console.log(uploadedFiles);
      let gltfURL;
      let gltfFileName;
      for (let i = 0; i < uploadedFiles.length; i++) {
        const url = URL.createObjectURL(uploadedFiles[i]);
        if (uploadedFiles[i].name.endsWith(".gltf")) {
          gltfURL = url;
          gltfFileName = uploadedFiles[i].name;
        }
        console.log(url);
      }
      await this.loadModal(gltfFileName.split(".")[0], gltfURL);
    },
  },
};
</script>
