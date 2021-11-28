<template>
  <div>
    <b-sidebar
      id="sidebar-1"
      bg-variant="dark"
      text-variant="light"
      title="Sidebar"
      shadow
    >
      <div class="px-3 py-2">
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
        <b-img
          src="https://picsum.photos/500/500/?image=54"
          fluid
          thumbnail
        ></b-img>
      </div>
    </b-sidebar>
    <div ref="canvas"></div>
    <b-row
      class="position-fixed bottom-0 vw-100 d-flex justify-content-end align-items-end"
    >
      <div class="position-relative mb-5 mr-5 text-light w-25">
        <input type="file" class="opacity-0" ref="fileInput" @change="onFileUpload" />
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
      modals: {},
      modalFile: null,
    };
  },
  async mounted() {
    this.$refs.canvas.appendChild(this.renderer.domElement);
    this.initializeScene();
    this.initializeCamera();
    this.initializeControls();
    this.initializeLighting();
    await this.loadModal('gladiator', '/models/gladiator/gladiator.glb');
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
      groundTexture.repeat.x = 6;
      groundTexture.repeat.y = 6;
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
      this.modals[key] = modal.scene;
      this.modals[key].children.forEach((modalChild)=>{
        modalChild.castShadow = true;
      })
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.modals.gladiator.rotation.y += this.speed;
      this.controls.update();
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onUploadClick() {
      const fileInput = this.$refs.fileInput
      fileInput.click();
    },
    async onFileUpload() {
      const uploadedFile = this.$refs.fileInput.files[0]
      const url = URL.createObjectURL(uploadedFile);
      await this.loadModal(uploadedFile.name.split('.')[0], url);
    },
  },
};
</script>
