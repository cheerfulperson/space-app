<template>
  <canvas
    id="stage"
    ref="canvas"
    @click="canvasClick"
    @mousemove="canvasHover"
  />
</template>

<script>
/* eslint-disable */
import babylonjs from 'babylonjs';
import colorGenerator from "../helper";

export default {
  props: {
    lowerColor: {
      type: Array,
      default: () => [0, 0.2, 1.0]
    },
    planetCharacteristics: {
      type: Object,
      default: () => {}
    },
    upperColor: {
      type: Array,
      default: () => [2, 1, 0]
    },
    seed: {
      type: [Number, String],
      default: 0.1
    },
    clouds: {
      type: Boolean,
      default: false
    },
    rings: {
      type: Boolean,
      default: false
    },
    planetRadius: {
      type: [Number, String],
      default: 50
    },
    rotationAnimation: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    src: null,
    alfa: 0,
    beta: 0,
    radius: 10,
    angle: 0,
    canvas: null,
    scene: null,
    engine: null,
    camera: null,
    skybox: null,
    light: null,
    mainPlanet: null,
    noiseTexture: null,
    cloudTexture: null,
    dynamicNoiseTexture: null,
    dynamicCloudTexture: null,
    shaderMaterial: null,
    planetOptions: {}
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setMultiWatch(
        ["upperColor", "lowerColor"],
        this.setPlanetPropsColor
      );
      this.setMultiWatch(["seed", "clouds", "rings"], this.setPlanetPropsVal);
      this.setMultiWatch(["planetCharacteristics"], this.setPlanetLowerColor);
      this.setMultiWatch(["planetRadius"], this.setPlanetRadius);

      this.initPlanetOptions();
      this.initDefaultEngine();
      this.generateDefaultTextures();
      this.initSpace();
      this.initLensFlares();
      this.createPlanet();
      this.createMaterial();
      this.generateBiome();
      this.generateNoise();
      this.generateCloud();
      this.setPlanetProperty();

      this.scene.registerBeforeRender(this.registerBeforeSceneRender);
      this.engine.runRenderLoop(this.runSceneRenderLoop);
      window.addEventListener("resize", this.resizeEvent);
    },
    setPlanetRadius(propName, newVal) {
      console.log('scaling');
      console.log(this.mainPlanet.scaling);
      this.mainPlanet.scaling = new BABYLON.Vector3(+newVal, +newVal, +newVal);;
      console.log(this.mainPlanet.scaling);
      this.generateNoise();
      this.generateCloud();
      this.setPlanetProperty();
    },
    setPlanetLowerColor(propName, newVal) {
      const lowerColor = colorGenerator(newVal);
      this.planetOptions.lowerColor = new BABYLON.Color3(...lowerColor),
      this.planetOptions.haloColor = new BABYLON.Color3(...lowerColor),
      this.generateNoise();
      this.generateCloud();
      this.setPlanetProperty();
    },
    setMultiWatch(arr, cb) {
      arr.forEach(val => {
        this.$watch(val, cb.bind(this, val));
      });
    },
    setPlanetPropsColor(propName, newVal) {
      // console.log("update color", newVal);
      this.planetOptions[propName] = new BABYLON.Color3(...newVal);
      this.generateNoise();
      this.generateCloud();
      this.setPlanetProperty();
    },
    setPlanetPropsVal(propName, newVal) {
      this.planetOptions[propName] = newVal;
      this.generateNoise();
      this.generateCloud();
      this.setPlanetProperty();
    },
    initPlanetOptions() {
      const lowerColor = colorGenerator(this.planetCharacteristics);
      // console.log("lowerColor", lowerColor);
      this.planetOptions = {
        biomes: "earth",
        clouds: this.clouds,
        mapSize: 1024,
        maxResolution: 128,
        rings: this.rings,
        upperColor: new BABYLON.Color3(...this.upperColor),
        lowerColor: new BABYLON.Color3(...lowerColor),
        haloColor: new BABYLON.Color3(...lowerColor),
        seed: this.seed,
        cloudSeed: 0.55,
        lowerClamp: new BABYLON.Vector2(0.1, 1),
        groundAlbedo: 1.2,
        cloudAlbedo: 1.0,
        ringsColor: new BABYLON.Color3(0.6, 0.6, 0.6),
        directNoise: false,
        lowerClip: new BABYLON.Vector2(0, 0),
        range: new BABYLON.Vector2(0.3, 0.35)
      };
    },
    initDefaultEngine() {
      this.canvas = this.$refs.canvas;
      // this.engine = new BABYLON.Engine(this.canvas, true);
      this.engine = new BABYLON.Engine(this.canvas, true, {
        preserveDrawingBuffer: true
      });
      this.scene = new BABYLON.Scene(this.engine);

      const camera = new BABYLON.ArcRotateCamera(
        "ArcRotateCamera",
        this.alfa,
        this.beta,
        this.radius,
        BABYLON.Vector3.Zero(),
        this.scene
      );
      camera.setPosition(new BABYLON.Vector3(0, 5, 10));
      camera.attachControl(this.canvas, false);
      camera.lowerRadiusLimit = 150;
      camera.upperRadiusLimit = 150;

      this.camera = camera;
      this.light = new BABYLON.PointLight(
        "light",
        new BABYLON.Vector3(350.0, 350.0, 30.0),
        this.scene
      );

      this.sceneclearColor = new BABYLON.Color3(0, 0, 0);
    },
    initSpace() {
      this.skybox = BABYLON.Mesh.CreateBox("universe", 1000.0, this.scene);

      const skyboxMaterial = new BABYLON.StandardMaterial(
        "universe",
        this.scene
      );
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
        "./universe/universe",
        this.scene
      );
      skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.disableLighting = true;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

      this.skybox.material = skyboxMaterial;
    },
    initLensFlares() {
      BABYLON.Engine.ShadersRepository = "src/shaders";
      const lensFlareSystem = new BABYLON.LensFlareSystem(
        "lensFlareSystem",
        this.light,
        this.scene
      );
      const flare00 = new BABYLON.LensFlare(
        0.1,
        0,
        new BABYLON.Color3(1, 1, 1),
        "flare3.png",
        lensFlareSystem
      );
      const flare01 = new BABYLON.LensFlare(
        0.4,
        0.1,
        new BABYLON.Color3(1, 1, 1),
        "flare.png",
        lensFlareSystem
      );
      const flare05 = new BABYLON.LensFlare(
        0.8,
        1.0,
        new BABYLON.Color3(1, 1, 1),
        "flare.png",
        lensFlareSystem
      );
      const flare02 = new BABYLON.LensFlare(
        0.1,
        1.3,
        new BABYLON.Color3(1, 1, 1),
        "flare.png",
        lensFlareSystem
      );
      const flare03 = new BABYLON.LensFlare(
        0.15,
        1.4,
        new BABYLON.Color3(0.5, 0.5, 1.0),
        "flare.png",
        lensFlareSystem
      );
      const flare04 = new BABYLON.LensFlare(
        0.05,
        1.5,
        new BABYLON.Color3(1, 1, 1),
        "flare3.png",
        lensFlareSystem
      );
    },
    generateDefaultTextures() {
      this.dynamicNoiseTexture = new BABYLON.DynamicTexture(
        "random",
        512,
        this.scene,
        false,
        BABYLON.Texture.NEAREST_SAMPLINGMODE
      );
      this.dynamicCloudTexture = new BABYLON.DynamicTexture(
        "random",
        512,
        this.scene,
        false,
        BABYLON.Texture.NEAREST_SAMPLINGMODE
      );
    },
    createPlanet() {
      this.mainPlanet = BABYLON.Mesh.CreateSphere("planet", 64, 30, this.scene);
      this.planetImpostor = BABYLON.Mesh.CreateSphere(
        "planetImpostor",
        16,
        28,
        this.scene
      );
      this.planetImpostor.isBlocker = true;
      this.planetImpostor.material = new BABYLON.StandardMaterial(
        "impostor",
        this.scene
      );
    },
    createMaterial() {
      this.shaderMaterial = new BABYLON.ShaderMaterial(
        "shader",
        this.scene,
        {
          vertex: "./planet",
          fragment: "./planet"
        },
        {
          attributes: ["position", "normal", "uv"],
          uniforms: [
            "world",
            "worldView",
            "worldViewProjection",
            "view",
            "projection"
          ],
          needAlphaBlending: true
        }
      );
      this.shaderMaterial.setVector3("cameraPosition", this.camera.position);
      this.shaderMaterial.setVector3("lightPosition", this.light.position);

      this.mainPlanet.material = this.shaderMaterial;
    },
    setPlanetProperty() {
      const { clouds, groundAlbedo, cloudAlbedo } = this.planetOptions;
      this.shaderMaterial.setVector3(
        "options",
        new BABYLON.Vector3(clouds, groundAlbedo, cloudAlbedo)
      );
    },
    registerBeforeSceneRender() {
      // const ratio = this.scene.getAnimationRatio();
      // this.mainPlanet.rotation.y += 0.001 * ratio;
      // this.shaderMaterial.setMatrix('rotation', BABYLON.Matrix.RotationY(this.angle));
      // this.angle -= 0.0004 * ratio;
    },
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    generateTexture(texture) {
      const context = texture.getContext();

      const data = context.getImageData(0, 0, 512, 512);

      // ! change this logic
      for (let i = 0; i < 512 * 512 * 4; i += 1) {
        data.data[i] = this.getRndInteger(0, 256); // (Math.random() * 256) | 0; // eslint-disable-line no-bitwise
      }

      context.putImageData(data, 0, 0);
      texture.update();
    },
    generateBiome() {
      if (this.noiseTexture) {
        this.noiseTexture.dispose();
        this.cloudTexture.dispose();
      }

      this.generateTexture(this.dynamicNoiseTexture);
      this.generateTexture(this.dynamicCloudTexture);
    },
    generateNoise() {
      const {
        upperColor,
        lowerColor,
        mapSize,
        maxResolution,
        seed,
        lowerClamp,
        range,
        directNoise,
        lowerClip: { x: lowerClipX, y: lowerClipY }
      } = this.planetOptions;
      const noiseTexture = new BABYLON.ProceduralTexture(
        "noise",
        mapSize,
        "./noise",
        this.scene,
        null,
        true,
        true
      );
      noiseTexture.setColor3("upperColor", upperColor);
      noiseTexture.setColor3("lowerColor", lowerColor);
      noiseTexture.setFloat("mapSize", mapSize);
      noiseTexture.setFloat("maxResolution", maxResolution);
      noiseTexture.setFloat("seed", seed);
      noiseTexture.setVector2("lowerClamp", lowerClamp);
      noiseTexture.setVector2("range", range);
      noiseTexture.setVector3(
        "options",
        new BABYLON.Vector3(directNoise ? 1.0 : 0, lowerClipX, lowerClipY)
      );
      noiseTexture.setTexture("randomSampler", this.dynamicNoiseTexture);
      noiseTexture.refreshRate = 0;

      this.shaderMaterial.setTexture("textureSampler", noiseTexture);
    },
    generateCloud() {
      const { mapSize, cloudSeed, haloColor, clouds } = this.planetOptions;
      if (!clouds) return;
      const cloudTexture = new BABYLON.ProceduralTexture(
        "cloud",
        mapSize,
        "./noise",
        this.scene,
        null,
        true,
        true
      );
      cloudTexture.setFloat("mapSize", mapSize);
      cloudTexture.setFloat("maxResolution", 256);
      cloudTexture.setFloat("seed", cloudSeed);
      cloudTexture.setVector3("options", new BABYLON.Vector3(1.0, 0, 1.0));
      cloudTexture.setTexture("randomSampler", this.dynamicCloudTexture);
      cloudTexture.refreshRate = 0;

      this.shaderMaterial.setTexture("cloudSampler", cloudTexture);
      this.shaderMaterial.setColor3("haloColor", haloColor);
    },
    runSceneRenderLoop() {
      // this.mainPlanet.rotation.y += 5;
      this.scene.render();
    },
    resizeEvent() {
      this.engine.resize();
    },
    createSnapshoot() {
      const { width, height } = this.canvas;
      BABYLON.Tools.CreateScreenshot(
        this.engine,
        this.camera,
        { width, height },
        data => {
          this.src = data;
        }
      );
    },
    canvasClick() {},
    canvasHover() {}
  }
};
</script>

<style>
html,
/* body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
} */

#stage {
  width: 100%;
  height: 100%;
}
</style>
