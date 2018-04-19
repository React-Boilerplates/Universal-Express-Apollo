import Loader from './Loader';
import {
  createPost,
  createUser,
  createArray,
  createDb
} from '../../../../test_utilities';

jest.mock('dataloader');

describe('Loader', () => {
  describe('loaders', () => {
    it('should run without errors', () => {
      Loader(createUser(), createDb(createArray(40, createPost)));
    });
  });
});
