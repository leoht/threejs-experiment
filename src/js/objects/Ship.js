var Ship = (function(){

    function Ship(){
        THREE.Object3D.call(this);

        this.baloon = new Baloon();
        this.nacelle = new Nacelle();
        this.wires = [];

        this.nacelle.position.set(0, 0, -300);
        this.rotation.x = - Math.PI / 2;

        this.blowApplied = false;
        this.nacelleNeedsReplace = false;

        this.add(this.baloon);
        this.add(this.nacelle);

        this.setupWires();

    }

    Ship.prototype = new THREE.Object3D;
    Ship.prototype.constructor = Ship;

    Ship.prototype.update = function() {
        this.baloon.update();
        this.nacelle.update();

        this.rotation.z += 0.001;
        this.position.z += 1;

        if (this.blowApplied) {
            this.blowApplied.update();

            this.position.x += this.blowApplied.vector.x * this.blowApplied.strength;
            this.position.y += this.blowApplied.vector.y * this.blowApplied.strength;
            this.position.z += this.blowApplied.vector.z * this.blowApplied.strength;

            var factor = this.blowApplied.vector.x > 0 ? 1 : -1;

            for (var i = 0 ; i < 4 ; i++) {
                this.wires[i].geometry.vertices[1].x -= (1.5 * this.blowApplied.strength) * factor;
                this.wires[i].geometry.verticesNeedUpdate = true;
            }

            this.nacelle.position.x -= (1.5 * this.blowApplied.strength) * factor;

            if (this.blowApplied.strength <= 0) {
                this.blowApplied = false;
                this.nacelleNeedsReplace = true;
            }
        }

        if (this.nacelleNeedsReplace) {
            for (var i = 0 ; i < 4 ; i++) {
                this.wires[i].geometry.vertices[1].x += this.nacelle.position.x < 0 ? 0.3 : -0.3;
                this.wires[i].geometry.verticesNeedUpdate = true;
            }

            this.nacelle.position.x += this.nacelle.position.x < 0 ? 0.3 : -0.3;;

            if (this.nacelle.position.x < 0.3 && this.nacelle.position.x > -0.3) this.nacelleNeedsReplace = false;
        }
    };

    Ship.prototype.setupWires = function() {
        var material = new THREE.LineBasicMaterial({
            color: 0x775e22,
            linewidth: 2
        });

        for (var i = 0 ; i < 4 ; i++) {
            var geometry = new THREE.Geometry();

            var xa = (i == 0 || i == 3) ? 40 : -40;
            var xb = (i % 2 == 0 )? 40 : -40;
            var ya = (i == 0 || i == 3) ? 25 : -25;
            var yb = (i % 2 == 0) ? 25 : -25;
            geometry.vertices.push(new THREE.Vector3(xa, xb, -180));
            geometry.vertices.push(new THREE.Vector3(ya, yb, -300));

            var line = new THREE.Line(geometry, material);

            this.wires.push(line);

            this.add(line);
        }
    };

    /*
     * Applies a windblow on the ship object.
     */
    Ship.prototype.applyWindBlow = function (blow) {
        this.blowApplied = blow;
    }

    return Ship;
})();