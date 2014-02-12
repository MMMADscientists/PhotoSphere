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

    var render = function () {
        requestAnimationFrame(render);

        sphere.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    render();
});
