import { createStore, combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import reducers from './reducers';

const create = state => {
  const rootReducer = combineReducers({
    reducers,
    form
  });

  const store = createStore(rootReducer, state);
  return store;
};

export default create;
