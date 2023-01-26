  'use strict';
/* global THREE */
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 0);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');



  {
    const color = 0xFFFFFF;
    const intensity = 1.3;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
  }

  {
    var OBJFile = 'https://taiseibutsu.github.io/gs/gs.obj';
    var MTLFile = 'https://taiseibutsu.github.io/gs/gs.mtl';
    var JPGFile = 'https://taiseibutsu.github.io/gs/textura.jpg';

    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load(JPGFile);
    var matmat = new THREE.MeshBasicMaterial({map: map});
    
    var size = 0.8;
    const objLoader = new THREE.OBJLoader2();
    objLoader.loadMtl(MTLFile, null, (materiale) => {
      objLoader.setMaterials(matmat);
      objLoader.load(OBJFile, (event) => {
        var texture = new THREE.TextureLoader().load(JPGFile);
        var root = event.detail.loaderRootNode;
        root.scale.set(size,size,size);
        root.rotateX( 95 * Math.PI / 180 );
        root.rotateY( 35 * Math.PI / 180 );
        root.rotateZ( 5 * Math.PI / 180 );
        root.traverse(function (child){
          if (child instanceof THREE.Mesh) {
            child.material.map = texture;
          }
        });
        scene.add(root);
      });
    });
  }
  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  
  function render() {
    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    
    renderer.render(scene, camera);
    scene.rotation.x += 0.005;
    scene.rotation.y += 0.01;
    scene.rotation.z += 0.002;
    
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();