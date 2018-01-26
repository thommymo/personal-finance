import { FETCH_USER } from "../actions/"
export default function authentication(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.user || false
    default:
      return state
  }
}
