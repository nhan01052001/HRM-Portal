import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
    Colors,
    Size,
    styleSafeAreaView,
    styleSheets,
    CustomStyleSheet
} from '../../constants/styleConfig';
import NtfNotificationList from './ntfNotificationfList/NtfNotificationList';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { startTask } from '../../factories/BackGroundTask';
import { EnumName, EnumTask } from '../../assets/constant';
import { NtfNotificationBusinessFunction, generateRowActionAndSelected } from './NtfNotificationBusiness';
import { translate } from '../../i18n/translate';
import store from '../../store';
import badgesNotification from '../../redux/badgesNotification';


class NtfPersonal extends Component {
    constructor(props) {
        super(props);
        // this.checkPosition = null;

        this.state = {
            // isLoading: true,
            listConfigModule: null,
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            rowActions: []
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            NtfNotificationBusinessFunction.setThisForBusiness(this);
            this.initState();
        });

        this.pageSize = 20;

        props.navigation.setParams({
            headerRight: (
                <TouchableOpacity onPress={() => this.handleUpdateAllSeen()}>
                    <View style={[styleSheets.bnt_HeaderRight, CustomStyleSheet.marginRight(8)]}>
                        <Text
                            style={
                                ([styleSheets.lable, CustomStyleSheet.fontSize(Size.text - 1)],
                                CustomStyleSheet.color(Colors.blue))
                            }
                        >
                            {translate('HRM_PortalApp_ReadAllNotify')}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }
    handleUpdateAllSeen = async () => {
        const { rowActions } = this.state
        let totalIDs = this.NtfNotificationListRef.getAllIDNotify()
        // cập nhật trạng thái đã xem tin
        const actionUpdateAllSeen = rowActions.find(item => item.type == EnumName.E_UPDATESTATUS);
        if (actionUpdateAllSeen && actionUpdateAllSeen.onPress) {
            let dataAll = { lstID: totalIDs }
            await actionUpdateAllSeen.onPress(dataAll);
            this.NtfNotificationListRef.updateAllStatusSeen()
            store.dispatch(badgesNotification.actions.setNumberBadgesNotify(0));
        }
    };

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = () => {
        // Gửi yêu cầu lọc dữ liệu
        this.setState(
            {
                keyQuery: EnumName.E_PRIMARY_DATA,
                isRefreshList: !this.state.isRefreshList
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_NtfPersonal,
                    payload: {
                        PageSize: this.pageSize,
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        isCompare: true,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_NtfPersonal,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pagingRequest = (page, pageSize) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_NtfPersonal,
                    payload: {
                        ...dataBody,
                        Page: page,
                        PageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    initState = () => {
        const dataRowActionAndSelected = generateRowActionAndSelected();
        this.setState(
            {
                // listConfigModule: initState,
                rowActions: dataRowActionAndSelected.rowActions,
                keyQuery: EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_NtfPersonal,
                    payload: {
                        PageSize: this.pageSize,
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        isCompare: true,
                        reload: this.reload
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_NtfPersonal) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // trường hợp không filter
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            }
        }
    }

    render() {
        const {
            // listConfigModule,
            keyQuery,
            isLazyLoading,
            isRefreshList,
            dataChange,
            rowActions
        } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.container}>
                    {keyQuery && (
                        <NtfNotificationList
                            ref={(ref) => this.NtfNotificationListRef = ref}
                            //listConfigModule={listConfigModule}
                            reloadScreenList={this.reload.bind(this)}
                            keyDataLocal={EnumTask.KT_NtfPersonal}
                            isLazyLoading={isLazyLoading}
                            isRefreshList={isRefreshList}
                            dataChange={dataChange}
                            keyQuery={keyQuery}
                            valueField="ID"
                            pagingRequest={this.pagingRequest}
                            pullToRefresh={this.pullToRefresh}
                            rowActions={rowActions}
                        />
                    )}
                </View>
            </SafeAreaView>
        );
    }
}
const TABAR_HEIGHT = Size.deviceWidth <= 320 ? Size.deviceheight * 0.09 : Size.deviceheight * 0.075;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: TABAR_HEIGHT
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(NtfPersonal);
