import React from 'react';
import { View } from 'react-native';
import { EnumStatus } from '../../assets/constant';
import { Size } from '../../constants/styleConfig';
import SkeApprove from './skeletonContent/SkeApprove';
import SkeSubmit from './skeletonContent/SkeSubmit';
import SkeEventHome from './skeletonContent/SkeEventHome';
import { ConfigListFilter } from '../../assets/configProject/ConfigListFilter';

export default class VnrLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSkeleton = () => {
        const { type } = this.props;
        if (type == EnumStatus.E_APPROVE) return <SkeApprove heightModalLayout={this.heightModalLayout} />;
        else if (type == EnumStatus.E_SUBMIT) return <SkeSubmit heightModalLayout={this.heightModalLayout} />;
        else if (type == EnumStatus.E_WAITING) return <SkeEventHome heightModalLayout={this.heightModalLayout} />;
    };

    render() {
        if (this.props.isVisible == false) {
            return null;
        }

        const { screenName } = this.props;
        let isHaveFilter = screenName && ConfigListFilter.value[screenName];

        return (
            <View
                // eslint-disable-next-line react-native/no-inline-styles
                accessibilityLabel={'VnrLoadingScreen-View'}
                style={[{ flex: 1, marginTop: isHaveFilter ? 0 : Size.defineHalfSpace }, this.props.style]}
                onLayout={event => {
                    this.heightModalLayout = event.nativeEvent.layout.height;
                }}
            >
                {this.renderSkeleton(this.heightModalLayout)}
            </View>
        );
    }
}
