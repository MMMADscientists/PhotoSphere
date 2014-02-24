Property = function () {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
            Property.FOV,
            Property.ASPECT,
            Property.NEAR,
            Property.FAR);

    this.renderer = new THREE.WebGLRenderer();

    // This may need to change when we start moving to embedding the canvas into websites
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.add(new THREE.AmbientLight(0xffffff));
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

    if (e.deltaY < 0) {
        this.camera.fov = Math.max(Property.FOV_MINIMUM, this.camera.fov / Property.SCALE);

        this.camera.updateProjectionMatrix();
    } else if ( e.deltaY > 0) {
        this.camera.fov = Math.min(Property.FOV_MAXIMUM, this.camera.fov * Property.SCALE);

        this.camera.updateProjectionMatrix();
    }
};

Property.prototype.bind = function () {
    this.renderer.domElement.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this));

    this.renderer.domElement.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this));

    this.renderer.domElement.addEventListener(
            "mouseup",
            this.onMouseUp.bind(this));

    this.renderer.domElement.addEventListener(
            "mousewheel",
            this.onMouseWheel.bind(this));
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
