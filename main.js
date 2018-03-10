var container, stats;
var camera, scene, renderer, controls;
var geometry, group;
var intersection = null;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var light, dirLight, hemiLight, spotLight, cloth, textureLoader, raycaster, mouse;
var colorSelection = 'rgb(91,103,112)';

document.addEventListener('mousemove', onDocumentMouseMove, false);
$(document).ready(function () {
    rendering();
    init();
    animate();
});

function setBlack() {
    colorSelection = 'rgb(0,0,0)';
    console.log('black');
    rendering()
}

function setGrey() {
    colorSelection = 'rgb(91,103,112)';
    console.log('grey');
    rendering();
}

function setWhite() {
    colorSelection = 'rgb(255,255,255)';
    rendering();
}

function rendering() {
    group = new THREE.Group();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colorSelection);
    //lights
    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.1, 0.8, 1);
    hemiLight.position.set(0, 10000, 0);
    scene.add(hemiLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.color.setHSL(0, 1, 1);
    dirLight.position.set(0, 0.55, 1);
    dirLight.position.multiplyScalar(50);
    scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    $.getJSON("fabric.json", function (data) {
        for (var i = 0; i < data.filename.length; i++) {
            console.log(data.filename[i]);
            //  var textureLoader = new THREE.TextureLoader();
            //  var geometry = new THREE.BoxGeometry(400,300,15);
            //  var fabricMaterial = new THREE.MeshStandardMaterial('rgb(255,255,255)');
            // fabricMaterial.map = textureLoader.load('image/'+data.filename[i]);
            // fabricMaterial.bumpMap = textureLoader.load('image/'+data.filename[i]);
            // fabricMaterial.bumpScale = 0.01;
            //
            // var maps = ['map','bumpMap'];
            // maps.forEach(function(mapName){
            //   var texture = fabricMaterial[mapName];
            //   texture.wrapS = THREE.RepeatWrapping;
            //   texture.wrapT = THREE.RepeatWrapping;
            //   texture.repeat.set(1.5,1.5);
            // })
            //material
            var textureLoader = new THREE.TextureLoader();
            var geometry = new THREE.BoxGeometry(700, 700, 5);
            var texture = textureLoader.load('image/' + data.filename[i]);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1.5, 1.5);

            var material = new THREE.MeshPhongMaterial({
                map: texture
            });

            var mesh = new THREE.Mesh(geometry, material);
            //mesh.position.x = -Math.random() * 1000;
            mesh.position.x = (Math.random() - 0.5) * 9800;
            mesh.position.y = (Math.random() - 0.5) * 9800;
            mesh.position.z = (Math.random() - 0.5) * 9800;

            mesh.rotation.x = Math.random() * 2.01 * Math.PI;
            mesh.rotation.y = Math.random() * 2.01 * Math.PI;
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            mesh.name = data.filename[i];
            group.add(mesh);
        }
        scene.add(group);
    });
}

function init() {
    $(".popup").hide();
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 17000);
    camera.position.x = 6000;
    camera.position.y = 6000;
    camera.position.z = 6000;

    controls = new THREE.TrackballControls(camera);
    // controls.rotateSpeed = 0.3;
    // controls.zoomSpeed = 0.2;
    // controls.panSpeed = 0.3;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMooving = 0.2;
    // controls.dynamicDampingFactor = 0.5;
    //controls.keys = [65,83,68];
    //controls.addEventListener('change', render);

    // scene.fog = new THREE.Fog(0xffffff, 0.2, 16000);
    //fabric json

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(colorSelection);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.sortObjects = false;
    container.appendChild(renderer.domElement);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    window.addEventListener('resize', onWindowResize, false);

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
                $(".popup").append("<img class='fabricImg' ><span class='close'>&times;</span>");
                $('.fabricImg').attr('src', imgUrl);
                $(".popup").show();
                //obj.material.color.setRGB(1.0 - i / intersections.length, 0, 0);
                console.log('I am here');
                //alert("I am a fabric!"+ 'data.filename[i]');
            }
        }
        $('.close').click(function () {
            $('.popup').hide()
        });
    }
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 1.03;
    mouseY = (event.clientY - windowHalfY) * 1.03;
}

//
function animate() {
    requestAnimationFrame(animate);
    render();

    //stats.update();
}

function render() {
    //TWEEN.update();
    // camera.position.x += (mouseX - camera.position.x);
    // camera.position.y += (-mouseY - camera.position.y);
    // camera.lookAt(scene.position);

    var time = Date.now() * 0.00001;
    // scene.rotation.x = Math.sin(time) * 1.008;
    // scene.rotation.y = Math.sin(time) * 1.008;
    // scene.rotation.z = Math.sin(time) * 1.008;

    controls.update();
    renderer.render(scene, camera);
}
