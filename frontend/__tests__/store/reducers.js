import C from '../../assets/js/constants';
import { repo } from '../../assets/js/store/reducers';

describe("repo Reducer", () => {

    it("ADD_REPO success", () => {
      const state = {}
      const action = {
        type: C.ADD_REPO,
        name: 'test',
        mtime_relative:'just now',
        size_formatted: '0 B'
      }

      const results = repo(state, action)
      expect(results)
      .toMatchObject({
        name: 'test',
        mtime_relative:'just now',
        size: 0,
        size_formatted: '0 B'
      })

    })

})
