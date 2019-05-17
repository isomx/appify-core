let _uniqueId = 0;
function uniqueId() {
  return ++_uniqueId;
}
export default uniqueId;