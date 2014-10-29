var WindBlow = (function () {

	function WindBlow(scene, wind, vector, strength, constant) {
		this.vector = vector;
		this.strength = strength;
		this.proportionalStrength = this.strength;
		this.updateCount = 0;
		this.scene = scene;
		this._wind = wind;

		if (!constant) {
			this.constant = false;
		} else {
			this.constant = constant;
		}

		this.particleCount = 4000;
		this.particles = new THREE.Geometry();
	    var pMaterial = new THREE.PointCloudMaterial({
	      color: 0xededed,
	      transparent: true,
	      map: THREE.ImageUtils.loadTexture('assets/img/wind-particle.png'),
	      size: 12
	    });

		// now create the individual particles
		for (var p = 0; p < this.particleCount; p++) {

		 startOffset = this.vector.x < 0 ? 2000 : -2000;

		  var pX = startOffset + Math.random() * 4000,
		      pY = Math.random() * 10000,
		      pZ = Math.random() * 10000 ,

		      particle = new THREE.Vector3(pX, pY, pZ);
		      particle.velocity = Math.random() * 10;

		  // add it to the geometry
		  this.particles.vertices.push(particle);
		}

		// create the particle system
		this.particleSystem = new THREE.PointCloud( this.particles, pMaterial);

		this.particleSystem.position.y = this.scene._main.ship.position.y ;
		this.particleSystem.position.z = this.scene._main.ship.position.z - 5000;

		if (this._wind.useParticles) {
			scene.add(this.particleSystem);
			this._wind.useParticles = false;
		}
	}

	WindBlow.prototype.update = function() {
		this.updateCount++;

		if (!this.constant) {
			
			this.proportionalStrength = this.strength * this.updateCount / 70;
			this.strength = Number(this.strength - 0.01).toFixed(2);
		} else {
			this.proportionalStrength = this.strength * this.updateCount / 100 + 0.2;
			// if (this.proportionalStrength > this.strength) this.proportionalStrength = this.strength;

			if (this.updateCount > 40) {
				this.constant = false;
			}
		}

		for (var i = 0 ; i < this.particleCount ; i++) {
			this.particles.vertices[i].x -= (this.vector.x < 0 ? 5 : -5) * this.particles.vertices[i].velocity;
		}

		this.particleSystem.geometry.verticesNeedUpdate = true;

		if (this.strength <= 0) {
			this.particleSystem.visible = false;
			this._wind.useParticles = true;
		}

		this.particleSystem.material.opacity -= 0.005;
		this.particleSystem.material.needsUpdate = true;
	};

	return WindBlow;

})();