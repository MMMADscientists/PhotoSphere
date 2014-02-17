$(document).ready(function () {
    var FOV = 75,
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
    scene.add(light);

    var texture = THREE.ImageUtils.loadTexture($(".texture")[0].src),
        sphere = new PhotoSphere(RADIUS, WIDTH_SEGMENTS, HEIGHT_SEGMENTS, texture);
    scene.add(sphere);

    var DOOR_ROUNDED_TEXTURE = THREE.ImageUtils.loadTexture($("#door")[0].src),
        connection = new Connection(new THREE.Vector3(0, 0, -10), 0, DOOR_ROUNDED_TEXTURE);
    sphere.add(connection);

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
        fov_maximum = 75;

    $(renderer.domElement).mousewheel(function (e) {
        e.preventDefault();

        if (e.deltaY > 0) {
            camera.fov = Math.max(fov_minimum, camera.fov / scale);
            camera.updateProjectionMatrix();
        } else if (e.deltaY < 0) {
            camera.fov = Math.min(fov_maximum, camera.fov * scale);
            camera.updateProjectionMatrix();
        }
    });

    var render = function () {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    };

    render();
});
