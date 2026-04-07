// step.reducer.ts
export type StepState = { index: number };

export type StepAction =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "RESET" };

export function stepReducer(
  state: StepState,
  action: StepAction
): StepState {
  switch (action.type) {
    case "NEXT":
      return { index: state.index + 1 };
    case "BACK":
      return { index: Math.max(0, state.index - 1) };
    case "RESET":
      return { index: 0 };
    default:
      return state;
  }
}
