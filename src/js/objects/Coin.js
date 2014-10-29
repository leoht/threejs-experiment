var Coin = (function(){

    function Coin(){
        THREE.Object3D.call(this);

        this.falling = false;

        var geometry = new THREE.CylinderGeometry(25, 25, 5, 32);
        var material = new THREE.MeshLambertMaterial({
            color: 0xebb614
        });

        // this.torch = new Torch();
        // this.add(this.torch);

        this.add(new THREE.Mesh(geometry, material));

        this.position.set(0, 0, 350);

        this.rotation.x = Math.PI / 2;
    }

    Coin.prototype = new THREE.Object3D;
    Coin.prototype.constructor = Coin;

    Coin.prototype.startFalling = function() {
        this.falling = true;
    };

    Coin.prototype.update = function() {
        this.rotation.x += 0.07;

        if (this.falling) {
            this.position.y -= 3;
        }

        if (this.position.z <= this.target.position.z + 100
            && this.position.y <= this.target.position.y
            && this.position.z > this.target.position.z - 100) {
            console.log('Hit!');
        }
    };

    return Coin;
})();