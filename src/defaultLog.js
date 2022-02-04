export default function (state, action, props, actionResult) {
  console.group("%c action", "color: gray; font-weight: lighter;", action.name);
  console.log("%c state", "color: #9E9E9E; font-weight: bold;", state);
  console.log("%c props", "color: #03A9F4; font-weight: bold;", props);
  console.log(
    "%c action result",
    "color: #4CAF50; font-weight: bold;",
    actionResult
  );
  console.groupEnd();
}
