import React, { Component } from 'react';
import { styleSafeAreaView } from '../../constants/styleConfig';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { SafeAreaView } from 'react-navigation';
import MessagingImageList from './messagingImageList/MessagingImageList';

export default class ImageLibary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEnabled: false,
            pageIndex: 1,
            pageSize: 20
        };

        this.chatEndpointApi = dataVnrStorage.apiConfig.chatEndpointApi;
    }

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
    };

    toggleSwitchNotify = () => {
        this.setState({
            isSwichNotify: !this.state.isSwichNotify
        });
    };

    render() {
        const { dataItem } = this.props.navigation.state.params;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <MessagingImageList
                    api={{
                        urlApi: `${this.chatEndpointApi}/restapi/chat/GetImageByTopicID`,
                        type: 'E_POST',
                        dataBody: {
                            TopicID: dataItem.TopicID,
                            PageSize: 20
                        }
                    }}
                    valueField="ID"
                />
            </SafeAreaView>
        );
    }
}
