Property = function () {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
            Property.FOV,
            Property.ASPECT,
            Property.NEAR,
            Property.FAR);

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.light = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.light);
};

Property.prototype.onMouseDown = function (e) {
    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.onMouseDown(e, this.camera);
        }
    }.bind(this));
};

Property.prototype.onMouseMove = function (e) {
    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.onMouseMove(e);
        }
    });
};

Property.prototype.onMouseUp = function (e) {
    this.scene.children.forEach(function (child) {
        if (child instanceof PhotoSphere) {
            child.onMouseUp(e);
        }
    });
};

Property.prototype.onMouseWheel = function (e) {
    e.preventDefault();

    if (e.deltaY > 0) {
        this.camera.fov = Math.max(Property.FOV_MINIMUM, this.camera.fov / Property.SCALE);

        this.camera.updateProjectionMatrix();
    } else if ( e.deltaY < 0) {
        this.camera.fov = Math.min(Property.FOV_MAXIMUM, this.camera.fov * Property.SCALE);

        this.camera.updateProjectionMatrix();
    }
};

Property.prototype.render = function () {
    this.renderer.render(this.scene, this.camera);
};

Property.FOV = 75;

Property.ASPECT = window.innerWidth / window.innerHeight;

Property.NEAR = 0.1;

Property.FAR = 1000;

Property.SCALE = 1.25;

Property.FOV_MINIMUM = 5;

Property.FOV_MAXIMUM = 75;
