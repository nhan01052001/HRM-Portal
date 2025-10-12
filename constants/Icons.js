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
import Ionicons from 'react-native-vector-icons/Ionicons'
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
        return <IconAntDesign name={'checksquareo'} size={size} color={color} />;
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
        return <MaterialIcons name={'date-range'} size={size} color={color} />;
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

export class BackgroundUpdateApp extends Component {
    render() {
        const { color, width, height } = this.props;
        return <Svg width={width} height={height} viewBox="0 0 351 286" fill="none">
            <Ellipse
                opacity="0.2"
                cx="175.5"
                cy="159"
                rx="77.5"
                ry="77"
                fill={color}
                fillOpacity="0.3"
            />
            <Circle
                opacity="0.2"
                cx="175.501"
                cy="167.02"
                r="104.011"
                fill={color}
                fillOpacity="0.15"
            />
            <Circle
                opacity="0.2"
                cx="175.501"
                cy="167.02"
                r="120.878"
                fill={color}
                fillOpacity="0.2"
            />
            <Circle
                opacity="0.2"
                cx="175.5"
                cy="167.02"
                r="137.744"
                fill={color}
                fillOpacity="0.17"
            />
            <Circle
                opacity="0.2"
                cx="175.5"
                cy="162"
                r="158"
                fill={color}
                fillOpacity="0.2"
            />
            <Circle
                opacity="0.2"
                cx="175.5"
                cy="154"
                r="180"
                fill={color}
                fillOpacity="0.2"
            />
            <Path
                opacity="0.2"
                d="M384.5 161.5C384.5 277.204 290.704 371 175 371C59.2963 371 -34.5 277.204 -34.5 161.5C-34.5 45.7963 59.2963 -48 175 -48C290.704 -48 384.5 45.7963 384.5 161.5Z"
                fill={color}
                fillOpacity="0.2"
            />
        </Svg>;
    }
}

export class IconSun extends Component {
    render() {
        const { color, size } = this.props;
        return <Svg width={size} height={size} viewBox="0 0 45.16 45.16" fill={color}>
            <Path
                d="M22.58 11.269c-6.237 0-11.311 5.075-11.311 11.312s5.074 11.312 11.311 11.312c6.236 0 11.311-5.074 11.311-11.312S28.816 11.269 22.58 11.269zM22.58 7.944a2.207 2.207 0 0 1-2.207-2.206V2.207a2.207 2.207 0 1 1 4.414 0v3.531a2.207 2.207 0 0 1-2.207 2.206zM22.58 37.215a2.207 2.207 0 0 0-2.207 2.207v3.53a2.207 2.207 0 1 0 4.414 0v-3.53a2.208 2.208 0 0 0-2.207-2.207zM32.928 12.231a2.208 2.208 0 0 1 0-3.121l2.497-2.497a2.207 2.207 0 1 1 3.121 3.121l-2.497 2.497a2.207 2.207 0 0 1-3.121 0zM12.231 32.93a2.205 2.205 0 0 0-3.121 0l-2.497 2.496a2.207 2.207 0 0 0 3.121 3.121l2.497-2.498a2.204 2.204 0 0 0 0-3.119zM37.215 22.58c0-1.219.988-2.207 2.207-2.207h3.531a2.207 2.207 0 1 1 0 4.413h-3.531a2.206 2.206 0 0 1-2.207-2.206zM7.944 22.58a2.207 2.207 0 0 0-2.207-2.207h-3.53a2.207 2.207 0 1 0 0 4.413h3.531a2.206 2.206 0 0 0 2.206-2.206zM32.928 32.93a2.208 2.208 0 0 1 3.121 0l2.497 2.497a2.205 2.205 0 1 1-3.121 3.12l-2.497-2.497a2.205 2.205 0 0 1 0-3.12zM12.231 12.231a2.207 2.207 0 0 0 0-3.121L9.734 6.614a2.207 2.207 0 0 0-3.121 3.12l2.497 2.497a2.205 2.205 0 0 0 3.121 0z"
            />
        </Svg>;
    }
}

export class IconSunCloud extends Component {
    render() {
        const { color, size } = this.props;
        return <Svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
            <Path
                d="M205.746 77.478a10 10 0 0 0 10-10V29.846a10 10 0 0 0-20 0v37.632a10 10 0 0 0 10 10zM118.029 93.661a10 10 0 0 0 17.321-10l-18.817-32.59a10 10 0 0 0-17.32 10zM31.226 136.379 63.815 155.2a10 10 0 1 0 10-17.32l-32.589-18.821a10 10 0 1 0-10 17.32zM57.632 225.592a10 10 0 0 0-10-10H10a10 10 0 0 0 0 20h37.632a10 10 0 0 0 10-10zM77.476 299.649a10 10 0 0 0-13.661-3.66l-32.589 18.816a10 10 0 1 0 10 17.32l32.589-18.815a10 10 0 0 0 3.661-13.661zM342.688 156.536a9.953 9.953 0 0 0 4.99-1.341l32.59-18.816a10 10 0 1 0-10-17.32l-32.59 18.816a10 10 0 0 0 5.01 18.661zM279.8 97.321a10 10 0 0 0 13.66-3.66l18.815-32.59a10 10 0 0 0-17.32-10l-18.815 32.59a10 10 0 0 0 3.66 13.66zM162.525 290.2q5.259 0 10.478.515a85.595 85.595 0 0 1 99.564-41.8 105.477 105.477 0 0 1 42.621-34.329A109.99 109.99 0 1 0 122.873 297.9a105.421 105.421 0 0 1 39.652-7.7z"
            />
            <Path
                d="M438.936 338.585a85.6 85.6 0 0 0-158.164-64.635 65.622 65.622 0 0 0-95.433 39.313 85.985 85.985 0 1 0-22.814 168.891h267.4a72.067 72.067 0 0 0 9.011-143.569z"
            />
        </Svg>;
    }
}

export class IconMoon extends Component {
    render() {
        const { color, size } = this.props;
        return <Svg width={size} height={size} viewBox="0 0 312.812 312.812" fill={color}>
            <Path
                d="M305.2 178.159c-3.2-.8-6.4 0-9.2 2-10.4 8.8-22.4 16-35.6 20.8-12.4 4.8-26 7.2-40.4 7.2-32.4 0-62-13.2-83.2-34.4-21.2-21.2-34.4-50.8-34.4-83.2 0-13.6 2.4-26.8 6.4-38.8 4.4-12.8 10.8-24.4 19.2-34.4 3.6-4.4 2.8-10.8-1.6-14.4-2.8-2-6-2.8-9.2-2-34 9.2-63.6 29.6-84.8 56.8-20.4 26.8-32.4 60-32.4 96 0 43.6 17.6 83.2 46.4 112s68 46.4 112 46.4c36.8 0 70.8-12.8 98-34 27.6-21.6 47.6-52.4 56-87.6 1.6-5.6-1.6-11.2-7.2-12.4z"
            />
        </Svg>;
    }
}

export class IconMoonStar extends Component {
    render() {
        const { color, size } = this.props;
        return <Svg width={size} height={size} viewBox="0 0 511.999 511" fill={color}>
            <Path
                d="M504.754 305.828c-5.824-3.594-13.344-2.933-18.387 1.676-36.726 33.312-84.234 51.668-133.746 51.668-109.894 0-199.305-89.41-199.305-199.305 0-49.515 18.356-97.02 51.668-133.746a15.337 15.337 0 0 0 1.676-18.387c-3.61-5.808-10.676-8.504-17.203-6.66C77.898 32.664 0 135.79 0 251.852 0 395.57 116.918 512.484 260.633 512.484c116.062 0 219.191-77.898 250.781-189.453a15.313 15.313 0 0 0-6.66-17.203zm0 0"
            />
            <Path
                d="m253.883 202.82 36.32 18.145 18.145 36.324a15.32 15.32 0 0 0 13.715 8.473c5.812 0 11.109-3.278 13.714-8.473l18.164-36.324 36.305-18.145a15.338 15.338 0 0 0 0-27.43l-36.305-18.148-18.164-36.32c-5.21-10.39-22.246-10.39-27.43 0l-18.144 36.32-36.32 18.149a15.324 15.324 0 0 0-8.477 13.714 15.324 15.324 0 0 0 8.477 13.715zM413.945 83.207h15.332v15.332c0 8.473 6.86 15.332 15.332 15.332s15.332-6.86 15.332-15.332V83.207h15.332c8.473 0 15.332-6.855 15.332-15.332 0-8.473-6.859-15.328-15.332-15.328h-15.332V37.215c0-8.477-6.859-15.332-15.332-15.332s-15.332 6.855-15.332 15.332v15.332h-15.332c-8.472 0-15.328 6.855-15.328 15.328 0 8.477 6.856 15.332 15.328 15.332zm0 0"
            />
        </Svg>;
    }
}