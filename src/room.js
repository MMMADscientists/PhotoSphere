Room = function (id, texture) {
    texture.image.crossOrigin = "anonymous";

    var geometry = new THREE.SphereGeometry(
            Room.RADIUS,
            Room.WIDTH_SEGMENTS,
            Room.HEIGHT_SEGMENTS);

    var material = new THREE.MeshLambertMaterial({ map: texture });

    material.side = THREE.BackSide;
    material.overdraw = true;

    THREE.Mesh.call(this, geometry, material);

    this.id = id;

    this.projector = new THREE.Projector();

    this.isRotating = false;

    this.rotateStart = new THREE.Vector2();

    this.rotateEnd = new THREE.Vector2();
};

Room.prototype = Object.create(THREE.Mesh.prototype);

Room.prototype.getConnectionsClicked = function (x, y, camera, canvas) {
    var canvasParent = canvas.parentNode;

    console.log("click", x, y, canvas.offsetLeft, canvas.offsetTop, canvas.width, canvas.height);

    var mouse3D = new THREE.Vector3(
            ((x - canvas.offsetLeft) / canvas.width) * 2 - 1,
            -((y - canvas.offsetTop) / canvas.height) * 2 + 1,
            0.5);

    this.projector.unprojectVector(mouse3D, camera);

    var raycaster = new THREE.Raycaster(camera.position, mouse3D.sub(camera.position).normalize());

    return { intersections: raycaster.intersectObject(this, true), ray: raycaster.ray };
};

Room.prototype.startRotate = function (x, y) {
    if (!this.isRotating) {
        this.isRotating = true;
        this.rotateStart.set(x, y);
    }
};

Room.prototype.rotate = function (x, y) {
    if (this.isRotating) {
        this.rotateEnd.set(x, y);

        var rotateDelta = new THREE.Vector2().subVectors(this.rotateEnd, this.rotateStart).divideScalar(750);

        this.rotateStart = this.rotateEnd.clone();

        this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x - rotateDelta.y));
        this.rotation.y -= rotateDelta.x;
    }
};

Room.prototype.endRotate = function () {
    this.isRotating = false;
};

Room.RADIUS = 25;

Room.WIDTH_SEGMENTS = 50;

Room.HEIGHT_SEGMENTS = 50;
