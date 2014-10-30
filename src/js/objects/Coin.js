var Coin = (function(){

    function Coin(){
        THREE.Object3D.call(this);

        this.falling = false;
        this.caught = false;

        var geometry = new THREE.CylinderGeometry(25, 25, 5, 32);
        this.material = new THREE.MeshLambertMaterial({
            color: 0xebb614,
            transparent: true
        });

        this.sound = document.getElementById('coin-sound');
        this.sound.volume = 0.2;

        this.onCatchCallback = null;

        // this.torch = new Torch();
        // this.add(this.torch);

        this.add(new THREE.Mesh(geometry, this.material));

        this.position.set(0, 0, 350);

        this.rotation.x = Math.PI / 2;
    }

    Coin.prototype = new THREE.Object3D;
    Coin.prototype.constructor = Coin;

    Coin.prototype.startFalling = function() {
        this.falling = true;
    };

    Coin.prototype.onCatch = function(cb) {
        this.onCatchCallback = cb;
    };

    Coin.prototype.update = function() {
        this.rotation.x += 0.07;

        if (this.falling) {
            this.position.y -= 3;
        }

        if (this.position.z <= this.target.position.z + 100
            && this.position.y <= this.target.position.y
            && this.position.z > this.target.position.z - 100 
            && this.position.y > this.target.position.y - 300
            && this.position.x <= this.target.position.x + 160
            && this.position.x > this.target.position.x - 160) {
            
            if (!this.caught) {
                this.sound.load();
                this.sound.play();
                this.material.opacity = 0;
                this.material.needsUpdate = true;
                this.caught = true;

                this.onCatchCallback();
            }    
        }
    };

    return Coin;
})();