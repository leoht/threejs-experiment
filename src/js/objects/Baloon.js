var Baloon = (function(){

    function Baloon(){
        THREE.Object3D.call(this);

        var geometry = new THREE.SphereGeometry(160, 50, 50);
        var material = new THREE.MeshPhongMaterial({color: 0x3facc8, wireframe: false});

        var cylinder = new THREE.CylinderGeometry(150, 60, 170, 32);
        var cylinderMesh = new THREE.Mesh(cylinder, material);
        cylinderMesh.position.set(0, -100, 0);
        cylinderMesh.rotation.y = Math.PI / 2;
        this.add(cylinderMesh);

        var texture = THREE.ImageUtils.loadTexture("assets/img/baloon-texture.png");
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        
        texture.needsUpdate = true;

        material.map = texture;

        material.bumpMap    = THREE.ImageUtils.loadTexture('assets/img/baloon-bump.png');
        material.bumpScale = 15;

        // material.map.offset.set( 15, 15 );
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);

        this.rotation.x += Math.PI / 2;
    }

    Baloon.prototype = new THREE.Object3D;
    Baloon.prototype.constructor = Baloon;

    Baloon.prototype.update = function() {
       // this.rotation.y += 0.003;
    };

    return Baloon;
})();