var WindBlow = (function () {

	function WindBlow(vector, strength) {
		this.vector = vector;
		this.strength = strength;
	}

	WindBlow.prototype.update = function() {
		this.strength = Number(this.strength - 0.01).toFixed(2);
	};

	return WindBlow;

})();