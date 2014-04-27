Connection = function (position, destinationID, id, texture) {
    texture = texture || THREE.ImageUtils.loadTexture($("#door")[0].src);

    var geometry = new THREE.PlaneGeometry(1, 2),
        material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });

    material.side = THREE.DoubleSide;

    THREE.Mesh.call(this, geometry, material);

    this.position = position;
    this.destinationID = destinationID;
    this.connectionID = id;

    var direction = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 1), this.position);

    this.lookAt(direction);
};

Connection.prototype = Object.create(THREE.Mesh.prototype);
