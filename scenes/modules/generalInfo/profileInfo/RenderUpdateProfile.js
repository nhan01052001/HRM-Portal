import React, { Component } from 'react';
import { View } from 'react-native';
import VnrText from '../../../../components/VnrText/VnrText';
import { styleSheets } from '../../../../constants/styleConfig';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../components/VnrPicker/VnrPicker';
import Vnr_Function from '../../../../utils/Vnr_Function';
import moment from 'moment';

export default class RenderUpdateProfile extends Component {
    constructor(props) {
        super(props);

        this.las = null;
    }

    onSetState = (field, val) => {
        this.props.setStateTo(field, val);
    };

    initView = config => {
        let renderCtrl;
        if (this.las == null) {
            let { data } = this.props;
            renderCtrl = config.map(item => {
                let control = item['Control'];
                let renderControl;
                if (control) {
                    if (control) {
                        let _fieldName = control['fieldName'];
                        let value = data[_fieldName];
                        let name = control.Name;
                        if (name && name.toLowerCase() === 'vnrtext') {
                            renderControl = (
                                <VnrTextInput
                                    {...control}
                                    value={value}
                                    onChangeText={text => this.onSetState(_fieldName, text)}
                                    key={_fieldName}
                                />
                            );
                        } else if (name && name.toLowerCase() === 'vnrdate') {
                            renderControl = (
                                <VnrDate
                                    key={_fieldName}
                                    {...control}
                                    value={value}
                                    onFinish={value => {
                                        const valueFormat =
                                            !Vnr_Function.CheckIsNullOrEmpty(control.response) &&
                                            control.response == 'string'
                                                ? moment(value).format(control.format)
                                                : value;
                                        this.onSetState(_fieldName, valueFormat);
                                        //this.setState({ [_fieldName]: valueFormat })
                                    }}
                                />
                            );
                        } else if (name && name.toLowerCase() === 'vnrpicker') {
                            renderControl = (
                                <VnrPicker
                                    key={_fieldName}
                                    value={value}
                                    {...control}
                                    onFinish={Item => {
                                        !Vnr_Function.CheckIsNullOrEmpty(Item) &&
                                            this.onSetState(_fieldName, Item[control.valueField]);
                                        //this.setState({ [_fieldName]: Item[control.valueField] }))
                                    }}
                                />
                            );
                        }
                    }

                    return (
                        // eslint-disable-next-line react-native/no-inline-styles, react-native/no-color-literals
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                            <View style={styleSheets.viewLable}>
                                <VnrText style={styleSheets.lable} i18nKey={item['DisplayKey']} />
                            </View>
                            <View style={styleSheets.viewControl}>{renderControl}</View>
                        </View>
                    );
                }
            });

            this.las = renderCtrl;

            return renderCtrl;
        }

        return this.las;
    };

    render() {
        const { config } = this.props;
        return <View>{this.initView(config)}</View>;
    }
}
