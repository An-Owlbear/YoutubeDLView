interface Action {
  type: string;
  data: string;
}

export const authReducer = (state = '', action: Action): string => {
  switch (action.type) {
    case 'SET_AUTH':
      return action.data;
    default:
      return state;
  }
};