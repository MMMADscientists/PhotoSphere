PhotoSphere = function (texture) {
    var geometry = new THREE.SphereGeometry(
            PhotoSphere.RADIUS,
            PhotoSphere.WIDTH_SEGMENTS,
            PhotoSphere.HEIGHT_SEGMENTS);

    var material = new THREE.MeshLambertMaterial({ map: texture });

    material.side = THREE.BackSide;
    material.overdraw = true;

    THREE.Mesh.call(this, geometry, material);

    this.projector = new THREE.Projector();

    this.isRotating = false;

    this.rotateStart = new THREE.Vector2();

    this.rotateEnd = new THREE.Vector2();
};

PhotoSphere.prototype = Object.create(THREE.Mesh.prototype);

PhotoSphere.prototype.onMouseDown = function (e, camera) {
    if (!this.isRotating) {
        this.isRotating = true;
        this.rotateStart.set(e.clientX, e.clientY);
    }

    var mouse3D = new THREE.Vector3(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
            0.5);

    this.projector.unprojectVector(mouse3D, camera);

    var raycaster = new THREE.Raycaster(camera.position, mouse3D.sub(camera.position).normalize()),
        intersects = raycaster.intersectObjects(this.children);

    if (intersects.length > 0) {
        console.log("Clicked object");
        
        // Click code here
    }
};

PhotoSphere.prototype.onMouseMove = function (e) {
    if (this.isRotating) {
        this.rotateEnd.set(e.clientX, e.clientY);

        var rotateDelta = new THREE.Vector2().subVectors(this.rotateEnd, this.rotateStart).divideScalar(750);

        this.rotateStart = this.rotateEnd.clone();

        this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x - rotateDelta.y));
        this.rotation.y -= rotateDelta.x;
    }
};

PhotoSphere.prototype.onMouseUp = function (e) {
    this.isRotating = false;
};

PhotoSphere.prototype.intersects = function (camera, x, y) {
    var mouse3D = new THREE.Vector3(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1,
            0.5);

    this.projector.unprojectVector(mouse3D, camera);
};

PhotoSphere.RADIUS = 25;

PhotoSphere.WIDTH_SEGMENTS = 50;

PhotoSphere.HEIGHT_SEGMENTS = 50;
