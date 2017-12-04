var camera, scene, renderer;
var mesh;

var GROW_FACTOR = 20;

// strategy 2c: moving the [shared] geom/material outside of the point constructor
var pointGeometry = new THREE.SphereBufferGeometry(0.15, 4, 4);

init();

function init() {

  // initiate Websockets
  var socket = io('http://localhost:3000');
  socket.on('connect', function () {
    console.log('connected');

  socket.on('setFloor', function (data) {
    try {
      if (!scene || !ground) {
        return;
      }

      ground.position.y = (data.floor * GROW_FACTOR) - 0.3;
    } catch (error) {
      // eat the error
      console.log(error);
    }
  });

  socket.on('points', function (data) {
    // set the new points to the THREE scene
    try {
      data.forEach((point) => {
        if (!scene) {
          return;
        }

        let material;
        if (point.color) {
          material = new THREE.MeshLambertMaterial({ color: new THREE.Color(point.color) });
        } else {
          material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        }
        var sphere = new THREE.Mesh(pointGeometry, material);
        sphere.position.x = point.x * GROW_FACTOR;
        sphere.position.y = point.y * GROW_FACTOR;
        sphere.position.z = point.z * GROW_FACTOR;
        THREE.GeometryUtils.merge(pointGeometry, sphere);
        scene.add(sphere);
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', function () {
    console.log('disconnected');
  });

  // initiate the THREE scene
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  var controls = new THREE.OrbitControls(camera);

  camera.position.z = 50;
  camera.position.y = 5;
  camera.position.x = 50;
  camera.lookAt(0, 0, 0);

  controls.update();

  scene = new THREE.Scene();

  var axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // https://threejs.org/examples/webgl_lights_hemisphere.html
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(1, 1, 1);
  hemiLight.groundColor.setHSL(1, 1, 0.5);
  hemiLight.position.set(0, 300, 0);
  hemiLight.castShadow = true;
  scene.add(hemiLight);

  hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 20);
  scene.add(hemiLightHelper);

  dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -20, 1.75, 1 );
  dirLight.position.multiplyScalar( 30 );
  scene.add( dirLight );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  var d = 50;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;
  dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 )
  scene.add( dirLightHeper );

  /* GROUND PLANE */

  var groundGeo = new THREE.CircleBufferGeometry(500, 50);
  var groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xefefef });

  groundMat.color.setHSL(0.180, 1, 1);
  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -35;
  scene.add(ground);
  ground.receiveShadow = true;


  // scene.background()
  renderer = new THREE.WebGLRenderer({ clearColor: 0x575757, clearAlpha: 1 });
  renderer.setClearColor(0x575757, 1);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
