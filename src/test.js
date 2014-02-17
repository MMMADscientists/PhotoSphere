var PhotoSphere = function (geometry, material) {
    THREE.Mesh.call(this, geometry, material);

    this.material.side = THREE.BackSide;
    this.material.overdraw = true;

    // test object attach
    this.cube = new THREE.Mesh(
            new THREE.CubeGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 }));

    this.cube.position.z = -10;

    this.add(this.cube);
};
PhotoSphere.prototype = Object.create(THREE.Mesh.prototype);

$(document).ready(function () {
    var FOV = 45,
        ASPECT = window.innerWidth / window.innerHeight,
        NEAR = 0.1,
        FAR = 1000,
        RADIUS = 25,
        WIDTH_SEGMENTS = 50,
        HEIGHT_SEGMENTS = 50;

    var scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR),
        projector = new THREE.Projector(),
        renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    $("body").append(renderer.domElement);

    var light = new THREE.AmbientLight(0xffffff);

    scene.add(light)

    var sphere = new PhotoSphere(
            new THREE.SphereGeometry(RADIUS, WIDTH_SEGMENTS, HEIGHT_SEGMENTS),
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture($(".texture")[0].src)
            }));

    scene.add(sphere);

    var rotateStart = new THREE.Vector2(),
        rotateEnd = new THREE.Vector2(),
        rotateDelta = new THREE.Vector2(),
        rotateAngle = new THREE.Vector2(),
        isRotating = false;

    $(renderer.domElement).mousedown(function (e) {
        if (!isRotating) { 
            isRotating = true;
            rotateStart.set(e.pageX, e.pageY);
        }

        var vec = new THREE.Vector3(
            (e.pageX / window.innerWidth) * 2 - 1,
            -(e.pageY / window.innerHeight) * 2 + 1,
            0.5);
        projector.unprojectVector(vec, camera);

        var raycaster = new THREE.Raycaster(camera.position, vec.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects([ sphere.cube ]);
        if (intersects.length > 0) {
            intersects[0].object.material.color.setHex(Math.random() * 0x00ff00);
        }
    });

    $(renderer.domElement).mousemove(function (e) {
        if (isRotating) {
            rotateEnd.set(e.pageX, e.pageY);
            rotateDelta.subVectors(rotateEnd, rotateStart).divideScalar(750);

            rotateStart = rotateEnd.clone();

            sphere.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, sphere.rotation.x - rotateDelta.y));
            sphere.rotation.y -= rotateDelta.x;
        }
    });

    $(renderer.domElement).mouseup(function (e) {
        isRotating = false;
    });

    var scale = 1.25,
        fov_minimum = 5,
        fov_maximum = 90;

    $(renderer.domElement).mousewheel(function (e) {
        e.preventDefault();

        if (e.deltaY > 0) {
            camera.fov = Math.max(fov_minimum, camera.fov / scale);
            camera.updateProjectionMatrix();
        } else if (e.deltaY < 0) {
            camera.fov = Math.min(fov_maximum, camera.fov * scale);
            camera.updateProjectionMatrix();
        }

        console.log(camera.fov);
    });

    var render = function () {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    };

    render();
});
