Connection = function (position, destinationID, texture) {
    var geometry = new THREE.PlaneGeometry(1, 2),
        material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });

    THREE.Mesh.call(this, geometry, material);

    this.position = position;
    this.destinationID = destinationID;
};
Connection.prototype = Object.create(THREE.Mesh.prototype);
