// Compute a random number between a given min and max value
function randomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },

  computed: {
    // Determine the remaining level in the monster's bar
    monsterBarStyle() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },

    // Determine the remaining level in the player's bar
    playerBarStyle() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },

    // Monitor the number of passed rounds to trigger a special attack
    specialAttackAllowed() {
      return this.currentRound % 3 !== 0;
    },
  },

  watch: {
    // Monitor the level of the player's health to display a game over message
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },

    // Monitor the level of the monster's health to display a game over message
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },

  methods: {
    // Reset the values of the game
    startGame() {
      this.logMessages = [];
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
    },
    // Remove part of the level in the monster's bar and causes the monster to fight back

    attackMonster() {
      this.currentRound++;
      const attackValue = randomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attacked", attackValue);
      this.attackPlayer();
    },

    // Remove part of the level in the player's bar
    attackPlayer() {
      const attackValue = randomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attacked", attackValue);
    },

    // Attack causing higher damage to the monster
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = randomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attacked", attackValue);
      this.attackPlayer();
    },

    // Healing the player causes the monster to attack after.
    healPLayer() {
      this.currentRound++;
      const healValue = randomValue(8, 20);
      // We ensure that we cannot heal the player if the health level is at 100 already
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage("player", "healed", healValue);
      this.attackPlayer();
      console.log(this.logMessages);
    },

    // End the game immediately
    surrender() {
      this.winner = "monster";
    },

    // Record the actions performed by each character
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actor: who,
        action: what,
        damage: value,
      });
    },
  },
});

app.mount("#game");
