export default {
  proceedToState(state, ctx = game) {
    ctx.state.start(state);
  }
}