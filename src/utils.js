export default {
  proceedToState(state, ctx = game) {
    ctx.state.start(state);
  },

  shuffle(array) {
    let current = array.length, temp, random;

    while (0 !== current) {
      random = Math.floor(Math.random() * current);
      current -= 1;

      temp = array[current];
      array[current] = array[random];
      array[random] = temp;
    }

    return array;
  }
}