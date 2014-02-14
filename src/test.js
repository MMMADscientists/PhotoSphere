var PhotoSphere = function (geometry, material) {
    THREE.Mesh.call(this, geometry, material);

    this.material.side = THREE.BackSide;
    this.material.overdraw = true;
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
    });

    $(renderer.domElement).mousemove(function (e) {
        if (isRotating) {
            rotateEnd.set(e.pageX, e.pageY);
            rotateDelta.subVectors(rotateEnd, rotateStart).divideScalar(750);

            rotateStart = rotateEnd.clone();

            camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateDelta.y);
            camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateDelta.x);

            /*
            camera.rotation.x += rotateDelta.y;
            camera.rotation.y += rotateDelta.x;
            */

            console.log(camera.rotation);
        }
    });

    $(renderer.domElement).mouseup(function (e) {
        isRotating = false;
    });

    var render = function () {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    };

    render();
});
