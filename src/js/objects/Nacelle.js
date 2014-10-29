var Nacelle = (function(){

    function Nacelle(){
        THREE.Object3D.call(this);

        var geometry = new THREE.CylinderGeometry(50, 30, 50, 32);
        var material = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa,
            wireframe: false,
            map: THREE.ImageUtils.loadTexture('assets/img/wicker.jpg')
        });

        // this.torch = new Torch();
        // this.add(this.torch);

        this.add(new THREE.Mesh(geometry, material));

        this.position.set(0, 0, -350);

        this.rotation.x = Math.PI / 2;
    }

    Nacelle.prototype = new THREE.Object3D;
    Nacelle.prototype.constructor = Nacelle;

    Nacelle.prototype.update = function() {
        // this.torch.update();
    };

    return Nacelle;
})();