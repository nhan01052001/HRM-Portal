import React, { Component } from 'react';
import HreTaskTopTabViewDetail from './HreTaskTopTabViewDetail';

export default class HreTaskViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const _params = this.props.navigation.state.params,
            { screenName, listActions, dataItem, reloadScreenList } = _params;

        return (
            <HreTaskTopTabViewDetail
                screenProps={{
                    dataItem: dataItem,
                    screenName: screenName,
                    listActions: listActions,
                    reloadScreenList: reloadScreenList
                }}
            />
        );
    }
}
