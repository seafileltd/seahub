import PropTypes from 'prop-types';
import { addRepo } from '../actions';

const AddRepoForm = (props, { store }) => {
    let _name;

    const submit = (e) => {
        e.preventDefault();
        store.dispatch( addRepo(_name.value) );
        _name.value = "";
        _name.focus();
    };

    return (
        <form onSubmit={submit}>
          <label>New library name:</label>
          <input ref={input => _name=input}
            type="text" required/>
            <button>Add</button>
        </form>
    )
};

AddRepoForm.contextTypes = {
    store: PropTypes.object
};

export default AddRepoForm;
