var Ship = (function(){

    function Ship(camera, id, main){
        THREE.Object3D.call(this);

        this.baloon = new Baloon(id);
        this.nacelle = new Nacelle();
        this.wires = [];

        this.camera = camera;
        this._main = main;

        this.nacelle.position.set(0, 0, -300);
        this.rotation.x = - Math.PI / 2;

        this.positionBeforeEnteringScene = null;
        this.enteringScene = false;
        this.blowApplied = false;
        this.ascendingForce = 0;
        this.nacelleNeedsReplace = false;
        this.baloonNeedsReplace = false;

        this.add(this.baloon);
        this.add(this.nacelle);

        this.setupWires();

        // this.applyAscendingForce(5);
    }

    Ship.prototype = new THREE.Object3D;
    Ship.prototype.constructor = Ship;

    Ship.prototype.update = function() {

        // If the ship is autonomous (non playable),
        // make it move along its directional vector
        // and stay near the main ship so we can still see it
        if (this.autoMoveVector) {
            this.position.x += this.autoMoveVector.x;
            this.position.y += this.autoMoveVector.y;
            this.position.z += this.autoMoveVector.z;

            // if ((this.position.x - this._main.ship.position.x >= 4000 && this.autoMoveVector.x > 0) || (this._main.ship.position.x - this.position.x <= 4000 && this.autoMoveVector.x < 0)) {
            //     this.autoMoveVector.x = - this.autoMoveVector.x;
            // }
            // if ((this._main.ship.position.y - this.position.y >= 2500 && this.autoMoveVector.y > 0)  || (this._main.ship.position.y - this.position.y <= -2500 && this.autoMoveVector.y < 0)) {
            //     this.autoMoveVector.y = - this.autoMoveVector.y;
            // } 
            // if ((this.position.z - this._main.ship.position.z >= 5000 && this.autoMoveVector.z > 0)  || (this._main.ship.position.z - this.position.z <= 5000 && this.autoMoveVector.z < 0)) {
            //     this.autoMoveVector.z = - this.autoMoveVector.z;
            // }
        }

        this.baloon.update();
        this.nacelle.update();

        this.baloon.rotation.y += 0.001;

        this.simulateWindForce();
        this.simulateAscendingForce();
        this.simulateBalancing();

        if (this.enteringScene) {
            if (this.position.y < this.positionBeforeEnteringScene + 800) {
                this.position.y += 2;
            } else {
                this.position.y += 1;
            }

            if (this.position.y - this.positionBeforeEnteringScene >= 1000) this.enteringScene = false;

            // console.log(this.position.y, this.positionBeforeEnteringScene);
        }
        
    };

    Ship.prototype.enterScene = function() {
        this.enteringScene = true;
        this.positionBeforeEnteringScene = this.position.y;
    };

    Ship.prototype.setupWires = function() {
        var material = new THREE.LineBasicMaterial({
            color: 0x775e22,
            linewidth: 1.5
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
        if (this.blowApplied) {
            return;
        }

        this.blowApplied = blow;
    }


    Ship.prototype.applyAscendingForce = function(strength) {
        this.originalAscendingForce = strength;
        this.ascendingForce = strength;
    };

    Ship.prototype.applyDescendingForce = function(strength) {
        this.originalAscendingForce = - strength;
        this.ascendingForce = - strength;
    };

    Ship.prototype.simulateBalancing = function () {
        if (this.nacelle.rotation.z > 0.1) {
            this.nacelle.rotation.z -= 0.001;
        }
        if (this.nacelle.rotation.z <= -0.1) {
            this.nacelle.rotation.z += 0.001;
        }
    }

    Ship.prototype.simulateWindForce = function() {
        if (this.blowApplied) {
            this.blowApplied.update();

            this.position.x += this.blowApplied.vector.x * this.blowApplied.proportionalStrength;
            this.position.y += this.blowApplied.vector.y * this.blowApplied.proportionalStrength;
            this.position.z += this.blowApplied.vector.z * this.blowApplied.proportionalStrength;

            var factor = this.blowApplied.vector.x > 0 ? 1 : -1;

            for (var i = 0 ; i < 4 ; i++) {
                this.wires[i].geometry.vertices[1].x -= (1.5 * this.blowApplied.proportionalStrength) * factor;
                this.wires[i].geometry.verticesNeedUpdate = true;
            }

            this.nacelle.position.x -= (1.5 * this.blowApplied.proportionalStrength) * factor;
            this.nacelle.rotation.z += factor * -0.003;

            if (this.blowApplied.proportionalStrength <= 0) {
                this.blowApplied = false;
                this.nacelleNeedsReplace = true;
            }

        }

        if (this.nacelleNeedsReplace) {

            for (var i = 0 ; i < 4 ; i++) {
                this.wires[i].geometry.vertices[1].x += this.nacelle.position.x < 0 ? 0.3 : -0.3;
                this.wires[i].geometry.verticesNeedUpdate = true;
            }

            this.nacelle.position.x += this.nacelle.position.x < 0 ? 0.3 : -0.3;

            if (this.nacelle.rotation.z < -0.05) {
                this.nacelle.rotation.z += 0.002;
            }

            if (this.nacelle.rotation.z > -0.05) {
                this.nacelle.rotation.z -= 0.002;
            }


            if (this.nacelle.position.x < 0.3 && this.nacelle.position.x > -0.3) this.nacelleNeedsReplace = false;
        }
    };


    Ship.prototype.simulateAscendingForce = function() {
        if (this.ascendingForce) {

            // console.log(this.ascendingForce);

            if (this.originalAscendingForce > 0) {
                this.baloon.rotation.x += 0.0004;

                for (var i = 0 ; i < this.wires.length ; i++) {
                    this.wires[i].geometry.vertices[0].y += 0.08;
                    this.wires[i].geometry.verticesNeedUpdate = true;
                }
            }

            factor = this.originalAscendingForce < 0 ? -1 : 1;

            if (this.ascendingForce > this.originalAscendingForce - 1 ) {
                this.position.y += (this.ascendingForce * (0.6 / (this.ascendingForce))) * factor;
            }
            if (this.ascendingForce < this.originalAscendingForce - 1 && this.ascendingForce > 1 ) {
                this.position.y += (this.ascendingForce * (1 / (this.ascendingForce))) * factor;
            }
            if (this.ascendingForce < 1 ) {
                this.position.y += (this.ascendingForce * (0.4 / (this.ascendingForce))) * factor;
            }
            
            this.ascendingForce -= this.originalAscendingForce > 0 ? 0.02 : -0.02;

            if (this.ascendingForce <= 0 && this.originalAscendingForce > 0) {
                this.ascendingForce = 0;
                this.baloonNeedsReplace = true;
            }

            if (this.ascendingForce >= 0 && this.originalAscendingForce < 0) {
                this.ascendingForce = 0;
                this.baloonNeedsReplace = true;
            }

            if (this.camera) this.camera.position.y -= 0.5;
        }

        if (this.baloonNeedsReplace) {
            this.baloon.rotation.x -= 0.001;

            var rot = this.baloon.rotation.x - Math.PI / 2;

            if (rot < 0) this.baloonNeedsReplace = false;

            for (var i = 0 ; i < this.wires.length ; i++) {
                this.wires[i].geometry.vertices[0].y -= 0.2;
                this.wires[i].geometry.verticesNeedUpdate = true;
            }

            // Update the camera slowly
            if (this.camera && this.camera.position.y <= this.position.y + 300) this.camera.position.y += 2;
        }
    };

    return Ship;
})();