export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
  .then(() => console.log('sleep is done!'));
}
