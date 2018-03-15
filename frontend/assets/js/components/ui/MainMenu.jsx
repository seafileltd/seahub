import { NavLink } from 'react-router-dom'

const selectedStyle = {
    backgroundColor: "#feac74",
}

export const MainMenu = () =>
    <ul className="side-tabnav-tabs col-md-3">
    <li className="tab"><NavLink activeStyle={selectedStyle} to='/'>My Liraries</NavLink></li>
    <li className="tab"><NavLink activeStyle={selectedStyle} to='/shared'>Shared with me</NavLink></li>
    </ul>
