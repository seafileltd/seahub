import { connect } from 'react-redux';

import { addRepo } from '../actions';
import AddRepoForm from '../components/AddRepoForm';

export const NewRepo = connect(
    null,
    (dispatch) => ({
        onNewRepo(name) {
            dispatch( addRepo(name) );
        }
    })
)(AddRepoForm);
