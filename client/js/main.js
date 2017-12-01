var camera, scene, renderer;
var mesh;

init();

function init() {

  var socket = io('http://localhost:3000');
  socket.on('connect', function () {
    console.log('connected');
  });

  socket.on('event', function (data) {
    console.log('event');
  });

  socket.on('disconnect', function () {
    console.log('disconnected');
  });

  // initiate the THREE scene
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  scene = new THREE.Scene();

  var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
  var material = new THREE.MeshBasicMaterial();
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
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
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.005;

  renderer.render(scene, camera);
}
