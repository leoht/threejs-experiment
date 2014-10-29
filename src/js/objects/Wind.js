var Wind = (function () {

	function Wind(strength, direction, aggressivity) {
		this.strength = strength;
		this.direction = direction;
		this.aggressivity = aggressivity;
		this.useParticles = true;
	}

	Wind.prototype.blowOnScene = function(scene) {
		this.scene = scene;
	};

	Wind.prototype.applyWindBlow = function(vector, strength) {
		var blow = new WindBlow(this.scene, this, vector, strength);
		this.scene._main.ship.applyWindBlow(blow);
	}

	Wind.prototype.update = function() {
		if (!this.scene) return;

		if (this.aggressivity * Math.random() * 0.001 > 0.001) {
			for (var i = 0 ; i < this.scene.children.length ; i++) {
				var object = this.scene.children[i];

				// If object is receptive to wind blows
				if (typeof object.applyWindBlow === 'function') {
					object.applyWindBlow(new WindBlow(this.direction, this.strength));
				}
			}
		}
	};

	return Wind;
})();