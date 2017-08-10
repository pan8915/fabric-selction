
  var container, stats;
  var camera, scene, renderer, controls;
  var geometry, group;
  var intersection = null;
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var light, dirLight, hemiLight, spotLight, cloth, textureLoader, raycaster, mouse;

  document.addEventListener('mousemove',onDocumentMouseMove, false);
   $(document).ready(function(){
    init();
    animate();
   });

  function init() {
    $(".popup").hide();
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x =1000;
    camera.position.y =1000;
    camera.position.z =1000;

    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 5.3;
    controls.zoomSpeed = 2.2;
    controls.panSpeed = 5.7;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMooving = 2.2;
    controls.dynamicDampingFactor = 0.5;
    //controls.keys = [65,83,68];
    controls.addEventListener('change',render);

    group = new THREE.Group();
    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xffffff, 0.2, 16000);
    //fabric json
    $.getJSON("fabric.json", function(data) {
      for (var i = 0; i < 98; i++) {
        console.log(data.filename[i]);
        var textureLoader = new THREE.TextureLoader();
        var geometry = new THREE.BoxGeometry(200, 200, 3);
        var texture = textureLoader.load('image/' + data.filename[i]);
        var material = new THREE.MeshBasicMaterial({
          map: texture
        });

        //  var color = new THREE.Color('#ffffff');
        //  var material = new THREE.MeshPhongMaterial({color:color.getHex(), bumpMap:texture});

        // var faceMaterial = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        //mesh.position.x = -Math.random() * 1000;
        mesh.position.x = (Math.random()-0.5) * 3800;
        mesh.position.y = (Math.random()-0.5) * 3800;
        mesh.position.z = (Math.random()-0.5)* 3800;

        mesh.rotation.x = Math.random() * 1.01 * Math.PI;
        mesh.rotation.y = Math.random() * 1.01 * Math.PI;
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        mesh.name = data.filename[i];
        group.add(mesh);
      }
      scene.add(group);
    });

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor('rgb(91,103,121)');
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.sortObjects = false;
    container.appendChild(renderer.domElement);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    window.addEventListener('resize', onWindowResize, false);

    //lights
    var light = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(light);
    var light2 = new THREE.PointLight(0xffffff,0.5);
    scene.add(light2);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      controls.handleResize();
    }

    function onDocumentTouchStart(event) {
      // event.preventDefault();
      event.clientX = event.touches[0].clientX;
      event.clientY = event.touches[0].clientY;
      onDocumentMouseDown(event);
    }

    function onDocumentMouseDown(event) {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
      // event.preventDefault();
      mouse.x = +(event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      var intersections = raycaster.intersectObjects(group.children);
      intersection = (intersections.length) > 0 ? intersections[0] : null;
      if (intersection) {
        for (var i = 0; i < intersections.length; i++) {
          var intersection = intersections[i],
            obj = intersection.object;
            var imgUrl = 'image/' + obj.name;
            $(".text").empty();
            $(".popup").append("<img class='fabricImg' width = 100%'><span class='close'>&times;</span>");
            $('.fabricImg').attr('src',imgUrl);
            var textureLoader = new THREE.TextureLoader();
            $(".popup").show();
            //obj.material.color.setRGB(1.0 - i / intersections.length, 0, 0);
          console.log('I am here');
          //alert("I am a fabric!"+ 'data.filename[i]');
        }
      }
      $('.close').click(function(){
        $('.popup').hide()});
    }
  }

  function onDocumentMouseMove(event){
   mouseX = (event.clientX - windowHalfX)*2 ;
   mouseY = (event.clientY - windowHalfY)*2 ;
 }
  //
  function animate() {
    requestAnimationFrame(animate);
    render();
    controls.update();
    //stats.update();
  }

  function getSpotLight(intensity, color){
    color = color === undefined ?'rgb(255,255,255)' :color;
    var light = new THREE.SpotLight(color, intensity);
    light.castshadow = true;
    light.penumbra = 0.5;
    return light;
  }

  function render() {
    TWEEN.update();
    camera.position.x += (mouseX - camera.position.x);
    camera.position.y += (-mouseY - camera.position.y);
    camera.lookAt(scene.position);

    var time = Date.now() * 0.0001;
    scene.rotation.x = Math.sin(time)*1.008;
    scene.rotation.y = Math.sin(time)*1.008;
    scene.rotation.z = Math.sin(time)*1.008;
    renderer.render(scene, camera);
  }
