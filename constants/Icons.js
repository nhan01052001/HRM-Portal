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
        return <Ionicons name={'star-sharp'} size={size} color={color} />;
    }
}

export class IconStarOutline extends Component {
    render() {
        const { color, size } = this.props;
        return <Ionicons name={'star-outline'} size={size} color={color} />;
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

export class IconUpload2 extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M22 13a1 1 0 0 0-1 1v4.213A2.79 2.79 0 0 1 18.213 21H5.787A2.79 2.79 0 0 1 3 18.213V14a1 1 0 0 0-2 0v4.213A4.792 4.792 0 0 0 5.787 23h12.426A4.792 4.792 0 0 0 23 18.213V14a1 1 0 0 0-1-1Z" />
                <Path d="M6.707 8.707 11 4.414V17a1 1 0 0 0 2 0V4.414l4.293 4.293a1 1 0 0 0 1.414-1.414l-6-6a1 1 0 0 0-1.414 0l-6 6a1 1 0 0 0 1.414 1.414Z" />
            </Svg>
        );
    }
}

export class IconUserSetting extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 18 15" fill={color}>
                <Path d="M6.375 0.25C7.01302 0.25 7.59635 0.404948 8.125 0.714844C8.65365 1.02474 9.08203 1.45312 9.41016 2C9.72005 2.54688 9.875 3.13021 9.875 3.75C9.875 4.36979 9.72005 4.95312 9.41016 5.5C9.08203 6.04688 8.65365 6.47526 8.125 6.78516C7.59635 7.09505 7.01302 7.25 6.375 7.25C5.73698 7.25 5.15365 7.09505 4.625 6.78516C4.09635 6.47526 3.66797 6.04688 3.33984 5.5C3.02995 4.95312 2.875 4.36979 2.875 3.75C2.875 3.13021 3.02995 2.54688 3.33984 2C3.66797 1.45312 4.09635 1.02474 4.625 0.714844C5.15365 0.404948 5.73698 0.25 6.375 0.25ZM5.11719 8.5625H7.63281H5.11719H7.63281C7.94271 8.5625 8.2526 8.58984 8.5625 8.64453C8.54427 9.19141 8.74479 9.60156 9.16406 9.875C8.92708 10.0208 8.75391 10.2305 8.64453 10.5039C8.53516 10.7591 8.52604 11.0326 8.61719 11.3242C8.72656 11.6888 8.8724 12.0352 9.05469 12.3633C9.25521 12.6914 9.48307 12.9922 9.73828 13.2656C9.95703 13.5026 10.2122 13.6302 10.5039 13.6484C10.7773 13.6849 11.0417 13.6393 11.2969 13.5117V13.5391C11.2969 13.7943 11.3698 14.0312 11.5156 14.25H1.07031C0.833333 14.25 0.641927 14.168 0.496094 14.0039C0.332031 13.8581 0.25 13.6667 0.25 13.4297C0.286458 12.0625 0.760417 10.9141 1.67188 9.98438C2.60156 9.07292 3.75 8.59896 5.11719 8.5625ZM12.1719 6.21094C12.1901 6.01042 12.2904 5.8737 12.4727 5.80078C12.7643 5.74609 13.0651 5.71875 13.375 5.71875C13.6849 5.71875 13.9857 5.74609 14.2773 5.80078C14.4596 5.8737 14.5599 6.01042 14.5781 6.21094V7.05859C14.7969 7.14974 14.9974 7.26823 15.1797 7.41406L15.8633 7.00391C16.0456 6.91276 16.2188 6.9401 16.3828 7.08594C16.5833 7.30469 16.7656 7.55078 16.9297 7.82422C17.0755 8.09766 17.194 8.38021 17.2852 8.67188C17.3398 8.8724 17.276 9.02734 17.0938 9.13672L16.4102 9.54688C16.4284 9.65625 16.4375 9.76562 16.4375 9.875C16.4375 9.98438 16.4284 10.0938 16.4102 10.2031L17.0938 10.5859C17.276 10.7135 17.3398 10.8776 17.2852 11.0781C17.194 11.3698 17.0755 11.6523 16.9297 11.9258C16.7656 12.1992 16.5833 12.4453 16.3828 12.6641C16.2188 12.8099 16.0456 12.8281 15.8633 12.7188L15.1797 12.3359C14.9974 12.4818 14.7969 12.6003 14.5781 12.6914V13.5117C14.5599 13.7305 14.4596 13.8672 14.2773 13.9219C13.9857 13.9948 13.6849 14.0312 13.375 14.0312C13.0651 14.0312 12.7643 13.9948 12.4727 13.9219C12.2904 13.8672 12.1901 13.7305 12.1719 13.5117V12.6914C11.9531 12.6003 11.7526 12.4818 11.5703 12.3359L10.8867 12.7188C10.7044 12.8281 10.5312 12.8099 10.3672 12.6641C10.1667 12.4453 9.98438 12.1992 9.82031 11.9258C9.67448 11.6523 9.55599 11.3698 9.46484 11.0781C9.41016 10.8776 9.47396 10.7135 9.65625 10.5859L10.3398 10.2031C10.3216 10.0938 10.3125 9.98438 10.3125 9.875C10.3125 9.76562 10.3216 9.64714 10.3398 9.51953L9.65625 9.13672C9.47396 9.02734 9.41016 8.8724 9.46484 8.67188C9.53776 8.38021 9.65625 8.09766 9.82031 7.82422C9.98438 7.55078 10.1667 7.30469 10.3672 7.08594C10.513 6.9401 10.6862 6.91276 10.8867 7.00391L11.543 7.41406C11.7435 7.26823 11.9531 7.14974 12.1719 7.05859V6.21094ZM14.6875 9.875C14.6875 9.36458 14.4779 8.96354 14.0586 8.67188C13.6029 8.4349 13.1471 8.4349 12.6914 8.67188C12.2721 8.96354 12.0625 9.36458 12.0625 9.875C12.0625 10.3854 12.2721 10.7773 12.6914 11.0508C13.1471 11.306 13.6029 11.306 14.0586 11.0508C14.4779 10.7773 14.6875 10.3854 14.6875 9.875Z" />
            </Svg>
        );
    }
}

export class IconRemoveUser extends Component {
    render() {
        const { color, size } = this.props;
        return (
            <Svg width={size} height={size} viewBox="0 0 32 32" fill={color}>
                <Path d="M29.238 27.824A3.94 3.94 0 0 0 29.7 26c0-.19-.01-.38-.03-.57-.27-3.41-3-6.14-6.41-6.41-.19-.02-.38-.03-.57-.03h-2.286l-2.567-2.568a7.068 7.068 0 0 0 1.983-.842c2.1-1.28 3.51-3.6 3.51-6.25C23.33 5.29 20.04 2 16 2a7.27 7.27 0 0 0-6.24 3.52 6.83 6.83 0 0 0-.844 1.982L3.707 2.293a1 1 0 1 0-1.414 1.414l26 26a.997.997 0 0 0 1.414 0 1 1 0 0 0 0-1.414zM9.31 18.99c-3.86 0-7.01 3.14-7.01 7.01 0 2.21 1.79 4 4 4h19.46L14.75 18.99z" />
            </Svg>
        );
    }
}

export class IconArrowDownSupperLong extends Component {
    render() {
        return <Svg width={7} height={40} viewBox="0 0 7 40" fill="none">
            <Path d="M3.5 40L6.38675 35H0.613249L3.5 40ZM3 0V35.5H4V0H3Z" fill="#BFBFBF" />
        </Svg>;
    }
}

export class IconPencil extends Component {
    render() {
        const { color, size } = this.props;
        return <Svg width={size} height={size} viewBox="0 0 15 15" fill={color}>
            <Path d="M10.9258 0.769531C11.2904 0.441406 11.7005 0.277344 12.1562 0.277344C12.6302 0.277344 13.0404 0.441406 13.3867 0.769531L14.4805 1.86328C14.8086 2.22786 14.9727 2.63802 14.9727 3.09375C14.9727 3.56771 14.8086 3.97786 14.4805 4.32422L13.1406 5.66406L9.58594 2.10938L10.9258 0.769531ZM8.98438 2.71094L12.5391 6.26562L6.14062 12.6641C5.84896 12.9375 5.51172 13.138 5.12891 13.2656L2.42188 14.2383C2.24219 14.2852 2.08333 14.263 1.94531 14.1719C1.80729 14.0807 1.73438 13.9531 1.72656 13.7891C1.71094 13.6406 1.73438 13.5 1.79688 13.3672L2.76953 10.6602C2.88932 10.2943 3.08138 9.96419 3.3457 9.66992L8.98438 2.71094Z" fill={color} />
        </Svg>;
    }
}