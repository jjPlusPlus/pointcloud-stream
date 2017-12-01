var camera, scene, renderer;
var mesh;

init();

function init() {

  // initiate Websockets
  var socket = io('http://localhost:3000');
  socket.on('connect', function () {
    console.log('connected');
  });

  socket.on('points', function (data) {
    // set the new points to the THREE scene
    try {
      data.forEach((point) => {
        var geometry = new THREE.SphereBufferGeometry(2, 5, 5);
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = point.x;
        sphere.position.y = point.y;
        sphere.position.z = point.z;
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
  camera.position.z = 400;

  scene = new THREE.Scene();

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

  renderer.render(scene, camera);
}
