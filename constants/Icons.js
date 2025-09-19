import React, { Component, Image } from 'react';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconOcticons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
//import { Platform } from 'react-native';

export class IconFeedback extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'feedback'} size={size} color={color} />;
    }
}

export class IconScan extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'scan1'} size={size} color={color} />;
    }
}

export class IconResumeVideo extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'caretright'} size={size} color={color} />;
    }
}

export class IconPauseVideo extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'pause'} size={size} color={color} />;
    }
}

export class IconScreenshot extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'cellphone-screenshot'} size={size} color={color} />;
    }
}

export class IconPlayVideo extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'playcircleo'} size={size} color={color} />;
    }
}

export class IconVideo extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'video'} size={size} color={color} />;
    }
}

export class IconComment extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'comments-o'} size={size} color={color} />;
    }
}

export class IconListAlt extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'list-alt'} size={size} color={color} />;
    }
}

export class IconScore extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'bookmark'} size={size} color={color} />;
    }
}

export class IconAppStore extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'apple-o'} size={size} color={color} />;
    }
}

export class IconAndroid extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'android'} size={size} color={color} />;
    }
}

export class IconNotify extends Component {
    render() {
        const { color, size } = this.props;
        return <SimpleLineIcons name={'bell'} size={size} color={color} />;
    }
}

export class IconOffNotify extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'bell-slash-o'} size={size} color={color} />;
    }
}

export class IconArrowDown extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'arrowdown'} size={size} color={color} />;
    }
}

export class IconSetting extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'setting'} size={size} color={color} />;
    }
}

export class IconChat extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'message1'} size={size} color={color} />;
    }
}

export class IconDot extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'dot-single'} size={size} color={color} />;
    }
}

export class IconCopy extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'copy'} size={size} color={color} />;
    }
}

export class IconLocation extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'my-location'} size={size} color={color} />;
    }
}

export class IconLock extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'lock'} size={size} color={color} />;
    }
}

export class IconFinger extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'fingerprint'} size={size} color={color} />;
    }
}

export class IconGenderFemale extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'gender-female'} size={size} color={color} />;
    }
}

export class IconGenderMale extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'gender-male'} size={size} color={color} />;
    }
}

export class IconGender extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'gender-male-female'} size={size} color={color} />;
    }
}

export class IconRadioCheck extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'radio-button-checked'} size={size} color={color} />;
    }
}

export class IconRadioUnCheck extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'radio-button-unchecked'} size={size} color={color} />;
    }
}

export class IconWarning extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'exclamationcircleo'} size={size} color={color} />;
    }
}

export class IconWarn extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'warning'} size={size} color={color} />;
    }
}

export class IconExclamation extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'exclamation'} size={size} color={color} />;
    }
}

export class IconMinus extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'minus'} size={size} color={color} />;
    }
}

export class IconMinusCircle extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'minus-circle'} size={size} color={color} />;
    }
}

export class IconPrev extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'arrow-back'} size={size} color={color} />;
    }
}

export class IconNextForward extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'arrow-forward'} size={size} color={color} />;
    }
}

export class IconEye extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'eye'} size={size} color={color} />;
    }
}

export class IconEyeOff extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'eye-off'} size={size} color={color} />;
    }
}

export class IconConfirm extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'questioncircleo'} size={size} color={color} />;
    }
}

export class IconQuestion extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'questioncircle'} size={size} color={color} />;
    }
}

export class IconKey extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'key'} size={size} color={color} />;
    }
}

export class IconInfo extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'infocirlceo'} size={size} color={color} />;
    }
}

export class IconLogout extends Component {
    render() {
        const { color, size } = this.props;
        return <SimpleLineIcons name={'logout'} size={size} color={color} />;
    }
}

export class IconLogin extends Component {
    render() {
        const { color, size } = this.props;
        return <SimpleLineIcons name={'login'} size={size} color={color} />;
    }
}

export class IconCamera extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'camera'} size={size} color={color} />;
    }
}

export class IconBack extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'chevron-left'} size={size} color={color} />;
    }
}

export class IconBackRadious extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'back'} size={size} color={color} />;
    }
}

export class IconQrcode extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'qrcode-scan'} size={size} color={color} />;
    }
}

export class IconQrcodeSharp extends Component {
    render() {
        const { color, size } = this.props;
        return <Ionicons name={'qr-code-sharp'} size={size} color={color} />;
    }
}

export class IconTouchID extends Component {
    render() {
        const { color, size } = this.props;
        return <Image source={require('../assets/images/TouchID.png')} size={size} color={color} />;
    }
}

export class IconFaceID extends Component {
    render() {
        const { color, size } = this.props;
        return <Image source={require('../assets/images/FaceID.png')} size={size} color={color} />;
    }
}

export class QRCode extends Component {
    render() {
        const { color, size } = this.props;
        return <Image source={require('../assets/images/QRCode.png')} size={size} color={color} />;
    }
}

export class IconNext extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'chevron-right'} size={size} color={color} />;
    }
}

export class IconCaretdown extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'caretdown'} size={size} color={color} />;
    }
}

export class IconCaretRight extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'caretright'} size={size} color={color} />;
    }
}

export class IconCaretup extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'caretup'} size={size} color={color} />;
    }
}

export class IconCreate extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'plus-circle'} size={size} color={color} />;
    }
}

export class IconPlus extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'plus'} size={size} color={color} />;
    }
}

export class IconPublish extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'save'} size={size} color={color} />;
    }
}

export class IconUndo extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'undo-variant'} size={size} color={color} />;
    }
}

export class IconFilter extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'filter'} size={size} color={color} />;
    }
}

export class IconEdit extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'edit-3'} size={size} color={color} />;
    }
}

export class IconColse extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'closecircleo'} size={size} color={color} />;
    }
}

export class IconCloseCircle extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'closecircle'} size={size} color={color} />;
    }
}

export class IconCancel extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'close'} size={size} color={color} />;
    }
}

export class IconRequestCancel extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'file-cancel-outline'} size={size} color={color} />;
    }
}

export class IconCancelMarker extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'cancel'} size={size} color={color} />;
    }
}

export class IconCheck extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'check'} size={size} color={color} />;
    }
}

export class IconCheckCirlceo extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'checkcircleo'} size={size} color={color} />;
    }
}

export class IconCheckCirlce extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'checkcircle'} size={size} color={color} />;
    }
}

export class IconCheckSquare extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'checksquare'} size={size} color={color} />;
    }
}

export class IconUnCheckSquare extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'square-outline'} size={size} color={color} />;
    }
}

export class IconMail extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'mail'} size={size} color={color} />;
    }
}

export class IconHeart extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'heart'} size={size} color={color} />;
    }
}

export class IconPhone extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'phone'} size={size} color={color} />;
    }
}

export class IconDelete extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'delete'} size={size} color={color} />;
    }
}

export class IconCreditCard extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'creditcard'} size={size} color={color} />;
    }
}

export class IconWifi extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'wifi'} size={size} color={color} />;
    }
}

export class IconNFC extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'cellphone-nfc'} size={size} color={color} />;
    }
}

export class IconMoreHorizontal extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'more-horizontal'} size={size} color={color} />;
    }
}

export class IconMoreVertical extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'more-vertical'} size={size} color={color} />;
    }
}

export class IconAttach extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'attach-file'} size={size} color={color} />;
    }
}

export class IconEditSquare extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'edit'} size={size} color={color} />;
    }
}

export class IconLeaveDay extends Component {
    render() {
        const { color, size } = this.props;
        return <IconOcticons name={'calendar'} size={size} color={color} />;
    }
}

export class IconInOut extends Component {
    render() {
        const { color, size } = this.props;
        return <SimpleLineIcons name={'tag'} size={size} color={color} />;
    }
}

export class IconDate extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={'#fff'}>
                <Path
                    d="M18.2222 5H5.77778C4.79594 5 4 5.79594 4 6.77778V19.2222C4 20.2041 4.79594 21 5.77778 21H18.2222C19.2041 21 20 20.2041 20 19.2222V6.77778C20 5.79594 19.2041 5 18.2222 5Z"
                    stroke={color}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path d="M4 10H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M16 3V7" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M8 3V7" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        );
    }
}

export class IconTime extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'access-time'} size={size} color={color} />;
    }
}

export class IconTimer extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'timer'} size={size} color={color} />;
    }
}

export class IconRefresh extends Component {
    render() {
        const { color, size } = this.props;
        return <SimpleLineIcons name={'refresh'} size={size} color={color} />;
    }
}

export class IconMap extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'map-marker-outline'} size={size} color={color} />;
    }
}

export class IconListRow extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'format-list-bulleted'} size={size} color={color} />;
    }
}

export class IconListColumn extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'format-columns'} size={size} color={color} />;
    }
}

export class IconUpload extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'upload'} size={size} color={color} />;
    }
}

export class IconImage extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'image'} size={size} color={color} />;
    }
}

export class IconDownload extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'download'} size={size} color={color} />;
    }
}

export class IconFile extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'file1'} size={size} color={color} />;
    }
}

export class IconFilePdf extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'pdffile1'} size={size} color={color} />;
    }
}

export class IconFileWord extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'wordfile1'} size={size} color={color} />;
    }
}

export class IconFileExcel extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'exclefile1'} size={size} color={color} />;
    }
}

export class IconContacts extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'contacts'} size={size} color={color} />;
    }
}

export class IconDown extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'chevron-down'} size={size} color={color} />;
    }
}

export class IconUp extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'chevron-up'} size={size} color={color} />;
    }
}

export class IconRight extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'chevron-right'} size={size} color={color} />;
    }
}

export class IconArrowRight extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'arrowright'} size={size} color={color} />;
    }
}

export class IconRest extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'rest'} size={size} color={color} />;
    }
}

export class IconSwapright extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'swapright'} size={size} color={color} />;
    }
}

export class IconFileZipRar extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'file-zip-o'} size={size} color={color} />;
    }
}

export class IconFileCsv extends Component {
    render() {
        const { color, size } = this.props;
        return <Foundation name={'page-csv'} size={size} color={color} />;
    }
}

export class IconSend extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'send'} size={size} color={color} />;
    }
}

export class IconSave extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'save'} size={size} color={color} />;
    }
}

export class IconError extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'error-outline'} size={size} color={color} />;
    }
}

export class IconSearch extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'search'} size={size} color={color} />;
    }
}

export class IconSearchOutline extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'feature-search-outline'} size={size} color={color} />;
    }
}

export class IconGroupUser extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'account-group-outline'} size={size} color={color} />;
    }
}

export class IconPositionName extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'chair-rolling'} size={size} color={color} />;
    }
}

export class IconStructure extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'flow-tree'} size={size} color={color} />;
    }
}

export class IconMoney extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'money'} size={size} color={color} />;
    }
}

export class IconUSD extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'currency-usd'} size={size} color={color} />;
    }
}

export class IconUser extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'user'} size={size} color={color} />;
    }
}

export class IconUserFullColor extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'user'} size={size} color={color} />;
    }
}

export class IconStar extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'star'} size={size} color={color} />;
    }
}

export class IconUserPlus extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'user-plus'} size={size} color={color} />;
    }
}

export class IconUserCheck extends Component {
    render() {
        const { color, size } = this.props;
        return <IconFeather name={'user-check'} size={size} color={color} />;
    }
}

export class IconEvaluate extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'like2'} size={size} color={color} />;
    }
}

export class IconProgressCheck extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialCommunityIcons name={'progress-check'} size={size} color={color} />;
    }
}

export class IconSuitcase extends Component {
    render() {
        const { color, size } = this.props;
        return <SimpleLineIcons name={'briefcase'} size={size} color={color} />;
    }
}

export class IconHourGlass extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'hour-glass'} size={size} color={color} />;
    }
}

export class IconHome extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'home'} size={size} color={color} />;
    }
}

export class IconLanguage extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'language'} size={size} color={color} />;
    }
}

export class IconGift extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'gift'} size={size} color={color} />;
    }
}

export class IconSliders extends Component {
    render() {
        const { color, size } = this.props;
        return <FontAwesome name={'sliders'} size={size} color={color} />;
    }
}

export class IconEyeBlack extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'eye'} size={size} color={color} />;
    }
}

export class IconShowDown extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'down'} size={size} color={color} />;
    }
}

export class IconShowUp extends Component {
    render() {
        const { color, size } = this.props;
        return <IconAntDesign name={'up'} size={size} color={color} />;
    }
}

export class IconShowDownChevron extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'chevron-down'} size={size} color={color} />;
    }
}

export class IconShowUpChevron extends Component {
    render() {
        const { color, size } = this.props;
        return <IconEntypo name={'chevron-up'} size={size} color={color} />;
    }
}

export class IconFullScreen extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'fullscreen'} size={size} color={color} />;
    }
}

export class IconFullScreenExit extends Component {
    render() {
        const { color, size } = this.props;
        return <MaterialIcons name={'fullscreen-exit'} size={size} color={color} />;
    }
}

export class IconEyeV2 extends Component {
    render() {
        const { color, size } = this.props;
        return <Ionicons name={'eye'} size={size} color={color} />;
    }
}

export class IconEyeOffV2 extends Component {
    render() {
        const { color, size } = this.props;
        return <Ionicons name={'eye-off'} size={size} color={color} />;
    }
}

export class IconReturnUpBack extends Component {
    render() {
        const { color, size } = this.props;
        return <Ionicons name={'return-up-back'} size={size} color={color} />;
    }
}

export class IconCriclePlay extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
                <Path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
            </Svg>
        );
    }
}

export class IconTimerRecruitment extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 512.04 512" fill={color}>
                <Path d="M282.523 1.344C273.723.457 264.883.016 256.04.02h-.266c-14.636.242-26.34 12.242-26.214 26.882v105.532a25.057 25.057 0 0 0 2.117 10.328 26.391 26.391 0 0 0 27.597 15.965c13.555-2.032 23.5-13.793 23.25-27.493V54.75c98.891 12.98 173.727 95.84 176.594 195.54 2.867 99.698-67.078 186.726-165.058 205.366-97.98 18.645-195-36.613-228.946-130.398-33.945-93.785 5.227-198.34 92.442-246.73 11.593-6.567 16.445-20.77 11.289-33.055l-.032-.075a26.528 26.528 0 0 0-37.378-13.058C21.086 93.824-27.918 226.61 16.03 345.035c43.946 118.43 167.711 187.098 291.453 161.711C431.227 481.36 517.957 369.508 511.723 243.34c-6.23-126.164-103.559-228.926-229.2-241.996zm0 0" />
                <Path d="M159.3 170.95c10.653 28.05 45.505 94.28 71.575 122.48 16.027 18.093 43.395 20.515 62.352 5.523a44.176 44.176 0 0 0 15.738-31.894 44.176 44.176 0 0 0-12.88-33.149c-27.265-27.262-96.464-63.383-125.48-74.398a8.814 8.814 0 0 0-9.363 2.05 8.808 8.808 0 0 0-1.941 9.387zm0 0" />
            </Svg>
        );
    }
}

export class IconPause extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
                <Path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM192 160l128 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32z" />
            </Svg>
        );
    }
}

export class IconCalendarEdit extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 14 15" fill={color}>
                <Path d="M4.375 0.25C4.77604 0.286458 4.99479 0.505208 5.03125 0.90625V2H8.96875V0.90625C9.00521 0.505208 9.22396 0.286458 9.625 0.25C10.026 0.286458 10.2448 0.505208 10.2812 0.90625V2H11.375C11.8672 2.01823 12.2773 2.19141 12.6055 2.51953C12.9336 2.84766 13.1068 3.25781 13.125 3.75V4.1875V5.5V12.5C13.1068 12.9922 12.9336 13.4023 12.6055 13.7305C12.2773 14.0586 11.8672 14.2318 11.375 14.25H2.625C2.13281 14.2318 1.72266 14.0586 1.39453 13.7305C1.06641 13.4023 0.893229 12.9922 0.875 12.5V5.5V4.1875V3.75C0.893229 3.25781 1.06641 2.84766 1.39453 2.51953C1.72266 2.19141 2.13281 2.01823 2.625 2H3.71875V0.90625C3.75521 0.505208 3.97396 0.286458 4.375 0.25ZM11.8125 5.5H2.1875H11.8125H2.1875V12.5C2.20573 12.7734 2.35156 12.9193 2.625 12.9375H11.375C11.6484 12.9193 11.7943 12.7734 11.8125 12.5V5.5ZM9.32422 6.89453C9.52474 7.11328 9.625 7.35938 9.625 7.63281C9.625 7.90625 9.52474 8.14323 9.32422 8.34375L8.91406 8.75391L7.46484 7.30469L7.875 6.89453C8.07552 6.69401 8.3125 6.59375 8.58594 6.59375C8.85938 6.59375 9.10547 6.69401 9.32422 6.89453ZM4.86719 9.90234L6.83594 7.93359L4.86719 9.90234L6.83594 7.93359L8.28516 9.38281L6.31641 11.3516C6.20703 11.4609 6.07943 11.5339 5.93359 11.5703L4.92188 11.8164C4.75781 11.8529 4.62109 11.8164 4.51172 11.707C4.40234 11.5977 4.36589 11.4609 4.40234 11.2969L4.64844 10.2852C4.6849 10.1393 4.75781 10.0026 4.86719 9.875V9.90234Z" />
            </Svg>
        );
    }
}

export class BackgroundUpdateApp extends Component {
    render() {
        const { color, width, height } = this.props;
        return (
            <Svg width={width} height={height} viewBox="0 0 351 286" fill="none">
                <Ellipse opacity="0.2" cx="175.5" cy="159" rx="77.5" ry="77" fill={color} fillOpacity="0.3" />
                <Circle opacity="0.2" cx="175.501" cy="167.02" r="104.011" fill={color} fillOpacity="0.15" />
                <Circle opacity="0.2" cx="175.501" cy="167.02" r="120.878" fill={color} fillOpacity="0.2" />
                <Circle opacity="0.2" cx="175.5" cy="167.02" r="137.744" fill={color} fillOpacity="0.17" />
                <Circle opacity="0.2" cx="175.5" cy="162" r="158" fill={color} fillOpacity="0.2" />
                <Circle opacity="0.2" cx="175.5" cy="154" r="180" fill={color} fillOpacity="0.2" />
                <Path
                    opacity="0.2"
                    d="M384.5 161.5C384.5 277.204 290.704 371 175 371C59.2963 371 -34.5 277.204 -34.5 161.5C-34.5 45.7963 59.2963 -48 175 -48C290.704 -48 384.5 45.7963 384.5 161.5Z"
                    fill={color}
                    fillOpacity="0.2"
                />
            </Svg>
        );
    }
}

export class IconOclock extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 55.668 55.668" fill={color}>
                <Path d="M27.833 0C12.487 0 0 12.486 0 27.834s12.487 27.834 27.833 27.834c15.349 0 27.834-12.486 27.834-27.834S43.182 0 27.833 0zm0 51.957c-13.301 0-24.122-10.821-24.122-24.123S14.533 3.711 27.833 3.711c13.303 0 24.123 10.821 24.123 24.123S41.137 51.957 27.833 51.957z" />
                <Path d="M41.618 25.819H29.689V10.046a1.856 1.856 0 0 0-1.855-1.856 1.856 1.856 0 0 0-1.854 1.856v19.483h15.638a1.856 1.856 0 0 0 0-3.71z" />
            </Svg>
        );
    }
}