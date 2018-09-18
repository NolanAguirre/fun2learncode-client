import React, {
    Component
} from 'react';
import './Logout.css';
import UserStore from '../../UserStore';
class ManageStudents extends Component {
    componentDidMount(){
        UserStore.set('authToken', null);
        window.location.reload();
    }
    render() {
        return (<div>Logging Out</div>);
    }
}

export default ManageStudents;
