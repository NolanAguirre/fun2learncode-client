import React, {
    Component
} from 'react';
import './Logout.css';
import UserStore from '../../Store';
class ManageStudents extends Component {
    componentDidMount(){
        UserStore.add({authToken:null});
    }
    render() {
        return (<div>Logging Out</div>);
    }
}

export default ManageStudents;
