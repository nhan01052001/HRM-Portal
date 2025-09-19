import React from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Text } from 'react-native';
import { Colors, styleSheets, Size, stylesVnrPicker, styleViewTitleForGroup, CustomStyleSheet } from '../../constants/styleConfig';
import { SafeAreaView } from 'react-navigation';
import VnrText from '../VnrText/VnrText';
import { ScrollView } from 'react-native-gesture-handler';
const api = {};
export const ModalCheckEmpsSevices = api;

export default class ModalCheckEmps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            stateProps: {
                titleModal: 'Modal'
            }
        };
        this.show = this.showModal.bind(this);
        this.hide = this.hideModal.bind(this);
    }

    showModal = objProps => {
        this.setState({ isVisible: true, stateProps: objProps });
    };

    hideModal = () => {
        const { onClose } = this.state.stateProps;
        this.setState({ isVisible: false, stateProps: {} }, () => {
            onClose && onClose();
        });
    };

    onFinish = () => {
        const { onFinish } = this.state.stateProps;

        this.setState({ isVisible: false }, () => {
            onFinish && onFinish();
        });
    };

    renderListItem = dataSource => {
        const { styleViewTitleGroup } = styleViewTitleForGroup,
            RenderItemAction = styles;

        return dataSource.map((dataItem, index) => {
            let viewContent = <View />;

            if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                viewContent = (
                    <View
                        style={[
                            styleViewTitleGroup,
                            styles.styViewContent
                        ]}
                    >
                        <VnrText
                            style={[styleSheets.text, styles.styTitleGp]}
                            i18nKey={dataItem['TitleGroup']}
                        />
                    </View>
                );
            } else {
                viewContent = (
                    <View style={RenderItemAction.viewInfo}>
                        <View style={RenderItemAction.Line}>
                            <Text style={[styleSheets.lable, { fontSize: Size.text - 2 }]}>{dataItem['Employee']}</Text>
                        </View>

                        <View style={RenderItemAction.Line}>
                            <VnrText
                                numberOfLines={1}
                                style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                i18nKey={'HRM_common_Frames'}
                            />
                            <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                            <View style={CustomStyleSheet.flex(1)}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                    {dataItem['FrameHours']}
                                </Text>
                            </View>
                        </View>

                        <View style={RenderItemAction.Line}>
                            <VnrText
                                numberOfLines={1}
                                style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                i18nKey={'E_ATT_AUDITLIMIT'}
                            />
                            <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                            <View style={CustomStyleSheet.flex(1)}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                    {dataItem['InFrameConfig']}
                                </Text>
                            </View>
                        </View>

                        <View style={RenderItemAction.Line}>
                            <VnrText
                                numberOfLines={1}
                                style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                i18nKey={'HRM_common_Current_Number'}
                            />
                            <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                            <View style={CustomStyleSheet.flex(1)}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                    {dataItem['CurrentEmployeeCount']}
                                </Text>
                            </View>
                        </View>

                        <View style={RenderItemAction.Line}>
                            <VnrText
                                numberOfLines={1}
                                style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                i18nKey={'HRM_FIN_TravelRequest_Status'}
                            />
                            <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                            <View style={CustomStyleSheet.flex(1)}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                    {dataItem['StatusView']}
                                </Text>
                            </View>
                        </View>
                    </View>
                );
            }

            return <View key={index} style={styles.styleViewBorderButtom}>{viewContent}</View>;
        });
    };

    componentDidMount() {
        api.show = this.show;
        api.hide = this.hide;
    }

    render() {
        const { bnt_Cancel, bnt_Ok, ScroollviewModal } = stylesVnrPicker.VnrPicker,
            { stateProps } = this.state,
            { dataSource, isShowLeftButton, textLeftButton, textRightButton } = stateProps;

        let viewListItem = <View />;

        if (dataSource && Array.isArray(dataSource)) {
            viewListItem = <ScrollView>{this.renderListItem(dataSource)}</ScrollView>;
        }
        this.renderListItem;
        return (
            <View style={{}}>
                {this.state.isVisible === true && (
                    <Modal
                        visible={this.state.isVisible}
                        animationType="none"
                        onShow={this.onShowModal}
                        transparent={false}
                        onRequestClose={this.closeModal}
                    >
                        <SafeAreaView style={ScroollviewModal}>
                            <View style={styles.styleHeaderTitle}>
                                <VnrText
                                    i18nKey={'Warning'}
                                    style={[styleSheets.lable, styles.styTextLable]}
                                />
                            </View>

                            <View style={styles.styFlex9}>
                                <View
                                    style={styles.styListItem}
                                >
                                    {viewListItem}
                                </View>
                                <View style={styles.styFlex1}>
                                    {isShowLeftButton && (
                                        <TouchableOpacity onPress={this.onFinish} style={bnt_Ok}>
                                            <VnrText i18nKey={textLeftButton != null ? textLeftButton : 'Confirm'} />
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity onPress={this.hideModal} style={bnt_Cancel}>
                                        <VnrText i18nKey={textRightButton != null ? textRightButton : 'Cancel'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styViewContent:{
        marginHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 10
    },
    styTitleGp : { fontWeight: '500', color: Colors.primary },
    styListItem : {
        flex: 9,
        flexDirection: 'column',
        borderBottomColor: Colors.grey,
        borderBottomWidth: 1
    },
    styFlex9 : { flex: 9, flexDirection: 'column' },
    styFlex1 : { flex: 1, flexDirection: 'row' },
    styTextLable : { fontWeight: '700', color: Colors.warning },
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    styleHeaderTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        paddingVertical: 10
    }
});
