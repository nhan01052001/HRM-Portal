import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, styleSwipeableAction } from '../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../utils/Vnr_Function';
import { translate } from '../../../i18n/translate';
import { IconDelete, IconCheckCirlceo } from '../../../constants/Icons';
import VnrText from '../../../components/VnrText/VnrText';
import { EnumName } from '../../../assets/constant';
import Color from 'color';
import { dataVnrStorage } from '../../../assets/auth/authentication';
import DrawerServices from '../../../utils/DrawerServices';
import { ConfigVersionBuild } from '../../../assets/configProject/ConfigVersionBuild';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import badgesNotification from '../../../redux/badgesNotification';
import NotificationsService from '../../../utils/NotificationsService';
import { AlertSevice } from '../../../components/Alert/Alert';
class NtfNotificationListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataGroup: null,
            isRefresh: false,
            isShowMore: false,
            dataGroupRemain: null
        };

        this.Swipe = null;

        this.languageApp = dataVnrStorage.currentUser.headers.languagecode;
        this.lengthDatAllow = 4;
        this.onPress = this.onPress.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.reload(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
      nextProps.isSelect !== this.props.isSelect ||
      nextProps.isOpenAction !== this.props.isOpenAction ||
      nextProps.isDisable !== this.props.isDisable ||
      nextProps.Status !== this.props.Status ||
      nextState.isRefresh !== this.state.isRefresh
        ) {
            return true;
        } else {
            return false;
        }
    }

  reload = nextProps => {
      const { dataGroupItem } = nextProps ? nextProps : this.props;
      if (dataGroupItem) {
          if (dataGroupItem.length > this.lengthDatAllow) {
              this.setState({
                  dataGroup: dataGroupItem,
                  // dataGroup: [...dataGroupItem].slice(0, this.lengthDatAllow),
                  // dataGroupRemain: [...dataGroupItem].slice(this.lengthDatAllow - 1, dataGroupItem.length - 1),
                  isShowMore: false,
                  isRefresh: !this.state.isRefresh
              });
          } else {
              this.setState({
                  dataGroup: dataGroupItem,
                  isRefresh: !this.state.isRefresh
              });
          }
      }
  };

  componentDidMount() {
      this.reload();
  }

  openActionSheet = () => {
      this.ActionSheet.show();
  };

  actionSheetOnCLick = index => {
      const { dataItem } = this.props;
      !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
      this.sheetActions[index].onPress(dataItem);
  };

  rightActionsEmpty = () => {
      return <View style={CustomStyleSheet.width(0)} />;
  };

  rightActions = (dataItem, indexItem) => {
      return (
          <View
              style={[
                  styleSheets.rightActions,
                  dataItem.Status != 'E_SEEN' && {
                      backgroundColor: Colors.green_3
                  }
              ]}
          >
              <View style={styleSwipeableAction.viewIcon}>
                  <TouchableOpacity
                      onPress={() => this.deleteItem(dataItem, indexItem)}
                      style={styleSwipeableAction.bnt_icon}
                  >
                      <View style={[styleSwipeableAction.icon, { backgroundColor: Colors.danger }]}>
                          <IconDelete size={Size.iconSize} color={Colors.white} />
                      </View>
                      <VnrText style={[styleSheets.text]} i18nKey={'HRM_Common_Delete'} />
                  </TouchableOpacity>
              </View>
          </View>
      );
  };

  deleteItem = (dataItem) => {
      const { rowActions } = this.props;
      // Xoa du lieu
      const actionDelete = rowActions.find(item => item.type == EnumName.E_DELETE);
      if (actionDelete && actionDelete.onPress) {
          actionDelete.onPress(dataItem, 'HRM_Notification_Confirm_Delete_Item');
      }
  };

  convertTextToColor = value => {
      const [num1, num2, num3, opacity] = value.split(',');
      return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
  };

  handerOpenSwipeOut = itemID => {
      const { handerOpenSwipeOut } = this.props;

      handerOpenSwipeOut(itemID);
  };

  handleTimeDate = dataItem => {
      //Nếu ngày hôm nay thì hiển thì giờ, còn lại hiển thị ngày
      const isToday = moment().format('DD/MM/YYYY') === moment(dataItem.DateUpdate).format('DD/MM/YYYY'),
          date = dataItem.DateUpdate;

      let dateFormat = '';
      if (isToday) {
          const now = moment(new Date()), //todays date
              end = moment(date), // time check in
              duration = moment.duration(now.diff(end)),
              { hours, minutes } = duration._data;

          if (hours > 0) {
              dateFormat = `${hours} ${translate('HRM_PortalApp_Hours_Ago')}`;
          } else if (minutes > 0) {
              dateFormat = `${minutes} ${translate('HRM_PortalApp_Minutes_Ago')}`;
          } else {
              dateFormat = translate('HRM_PortalApp_Fewseconds_Ago');
          }
      } else {
          dateFormat = `${translate(`E_${moment(date).format('dddd')}`.toUpperCase())}, ${moment(date).format(
              'DD'
          )} ${translate('Month_Lowercase')} ${moment(date).format('M')}`;
      }
      return dateFormat;
  };

  handleTitle = title => {
      if (title == null || title == '') return;

      title = title.trim();
      let fullTextView = <View />;
      try {
          const styleTextTitle = [styleSheets.text, styles.styTextNotify];
          const cutstring =
        title.includes('<title>') || title.includes('<strong>')
            ? title
                .replace(new RegExp(/<strong>/g, 'g'), '&lt;strong&gt; @@BOLD@@')
                .replace(new RegExp(/<\/strong>/g, 'g'), ' &lt;/strong&gt;')
            // eslint-disable-next-line no-useless-escape
                .split(/&lt;strong&gt;.|.\&lt;\/strong&gt;/)
            : title;

          // title
          //   .replace(new RegExp(/&lt;strong&gt;/g, 'g'), '&lt;strong&gt; @@BOLD@@')
          //   .replace(new RegExp(/&lt;\/strong&gt;/g, 'g'), ' &lt;/strong&gt;')
          //   .replace(new RegExp(/&lt;title&gt;/g, 'g'), '&lt;strong&gt; ')
          //   .replace(new RegExp(/&lt;\/title&gt;/g, 'g'), ' &lt;/strong&gt;')
          //   .split(/&lt;strong&gt;.|.\&lt;\/strong&gt;/)
          // : title;

          if (cutstring && Array.isArray(cutstring) && cutstring.length > 1) {
              fullTextView = (
                  <Text style={styleTextTitle}>
                      {cutstring.map(string => {
                          if (string.includes('@@BOLD@@')) {
                              const stringRep = string.includes('@@BOLD@@') ? string.replace('@@BOLD@@', '') : string;
                              return <Text style={[styleSheets.lable, styles.styTextNotify]}>{stringRep}</Text>;
                          } else return <Text style={styleTextTitle}>{string}</Text>;
                      })}
                  </Text>
              );
          } else if (cutstring && cutstring.length == 1) {
              fullTextView = <Text style={styleTextTitle}>{cutstring[0]}</Text>;
          } else {
              fullTextView = <Text style={styleTextTitle}>{title}</Text>;
          }

          return <Text style={styleTextTitle}>{fullTextView}</Text>;
      } catch (error) {
          DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
      }
  };

  onPress = (dataItem, indexItem) => {
      const { dataGroup, isRefresh } = this.state;
      const { pushScreenName, recordIDs, screenName, CutOffDuration, CutOffDurationID, businessType } = dataItem;
      const { rowActions } = this.props;

      // cập nhật trạng thái đã xem tin
      const actionUpdateIsSeen = rowActions.find(item => item.type == EnumName.E_UPDATESTATUS);
      if (actionUpdateIsSeen && actionUpdateIsSeen.onPress) {
          const findItem = dataGroup[indexItem];

          if (findItem && findItem.Status !== 'E_SEEN') {
              actionUpdateIsSeen.onPress(dataItem);
              findItem.Status = 'E_SEEN';

              // trừ số thông báo xuống khi bấm vô dòng chưa xem
              const { countBadgesNotify, setNumberBadgesNotify } = this.props;
              const lengthItemIsSeen = Array.isArray(dataItem.lstID) ? dataItem.lstID.length : 0;
              if (countBadgesNotify != null && countBadgesNotify > 0) setNumberBadgesNotify(countBadgesNotify - lengthItemIsSeen);
          }
      }
      if (businessType === 'E_PLAN_HEADCOUNT') {
          AlertSevice.alert({
              iconType: 'E_WARNING',
              title: 'Hrm_Notification',
              message: 'HRM_PortalApp_PleaseAccessPortalToApprove',
              showConfirm: false,
              showCancel: false
          });
          return;
      }

      if (pushScreenName && pushScreenName !== null) {
      // xử lý điều hướng đên trang detail đúng module đang chạy.
          let finalPushScreenName = pushScreenName,
              finalScreenNameConfig = screenName;
          if (finalPushScreenName != null && finalPushScreenName.includes('ViewDetail')) {
              finalPushScreenName = NotificationsService.handleViewDetailFormNotification(finalPushScreenName, finalScreenNameConfig);
              if (finalPushScreenName != null && finalPushScreenName.includes('TopTab')) {
                  finalPushScreenName = finalPushScreenName.split('TopTab')[1];
                  finalScreenNameConfig = finalPushScreenName;
                  finalPushScreenName = `${finalPushScreenName}ViewDetail`;
              } else {
                  finalPushScreenName = pushScreenName;
              }
          }
          const checkVersion = ConfigVersionBuild.value;
          const navigateAction = NavigationActions.navigate({
              routeName: `Main${checkVersion}`,
              params: {},
              action: NavigationActions.navigate({
                  routeName: NotificationsService.mappingScreenNameV3(finalPushScreenName),
                  params: {
                      dataId: recordIDs,
                      screenName: finalScreenNameConfig,
                      NotificationID: recordIDs,
                      NotificationIDs: recordIDs,
                      CutOffDuration: CutOffDuration ? CutOffDuration : null,
                      CutOffDurationID: CutOffDurationID ? CutOffDurationID : null,
                      businessType: businessType
                  }
              })
          });
          DrawerServices.setNavigateFromNotify(true);
          DrawerServices.getDrawercontainer().dispatch(navigateAction);
      }

      this.setState({
          dataGroup: dataGroup,
          isRefresh: !isRefresh
      });
  };

  toggleShowMore = () => {
      const { dataGroup, dataGroupRemain, isShowMore, isRefresh } = this.state;
      const { dataGroupItem } = this.props;
      const _isShowMore = !isShowMore;
      this.setState({
          dataGroup: _isShowMore ? [...dataGroup, ...dataGroupRemain] : dataGroupItem.slice(0, this.lengthDatAllow),
          isShowMore: _isShowMore,
          isRefresh: !isRefresh
      });
  };

  renderHeaderGroup = () => {
      const { dataGroup, dataGroupRemain, isShowMore } = this.state;
      const fristItem = dataGroup[0];
      const showMore = !isShowMore;
      if (fristItem.titeGroup && fristItem.totalGroupRecord) {
          return (
              <View style={styles.styViewTitleGroup}>
                  <View style={styles.styViewTitleText}>
                      <VnrText
                          style={[styleSheets.lable, styles.styTextTitleGroup]}
                          value={`${fristItem.titeGroup} (${fristItem.totalGroupRecord})`}
                      />
                  </View>
                  {dataGroupRemain != null && (
                      <TouchableOpacity style={styles.styBntShowMore} onPress={this.toggleShowMore}>
                          {showMore ? (
                              <VnrText
                                  i18nKey={'HRM_Common_Showmore'}
                                  style={[styleSheets.textFontMedium, styles.styBnt__text]}
                              />
                          ) : (
                              <VnrText
                                  i18nKey={'HRM_Common_Showless'}
                                  style={[styleSheets.textFontMedium, styles.styBntShowMoreText]}
                              />
                          )}
                      </TouchableOpacity>
                  )}
              </View>
          );
      } else {
          return <View />;
      }
  };

  onPressOption = typeGroup => {
      const { onLongPressDelete } = this.props;
      onLongPressDelete({ typeGroup: typeGroup });
  };

  render() {
      const { listItemOpenSwipeOut, isOpenAction, isDisable } = this.props;

      const { dataGroup } = this.state;
      let viewContent = <View />;
      if (dataGroup != null && dataGroup.length > 0) {
      // Chuaw làm cho giao việc

          viewContent = (
              <View style={styles.container}>
                  {this.renderHeaderGroup()}
                  {dataGroup.map((dataItem, index) => {
                      const makeID = `${dataItem.lstID ? dataItem.lstID.join('') : dataItem.recordID}${index}`;
                      const { openPage } = dataItem;
                      return (
                          <Swipeable
                              key={index}
                              ref={ref => {
                                  this.Swipe = ref;
                                  const checkIndex = listItemOpenSwipeOut[makeID];
                                  if (!checkIndex) {
                                      listItemOpenSwipeOut[makeID] = { ID: makeID, value: ref };
                                  } else {
                                      listItemOpenSwipeOut[makeID].value = ref;
                                  }
                              }}
                              overshootRight={false}
                              renderRightActions={() => this.rightActions(dataItem, index)}
                              friction={0.6}
                              containerStyle={styles.swipeable}
                          >
                              <TouchableWithoutFeedback
                                  // onLongPress={this.onLongPress}
                                  onPress={() => this.onPress(dataItem, index)}
                                  onPressIn={() => this.handerOpenSwipeOut(makeID)}
                              >
                                  <View
                                      style={[
                                          styles.swipeableLayout,
                                          dataItem.Status !== 'E_SEEN' && {
                                              backgroundColor: Colors.primary_transparent_8
                                          }
                                      ]}
                                  >
                                      {isOpenAction && (
                                          <View
                                              style={[
                                                  styles.leftContent,
                                                  isDisable ? styleSheets.opacity05 : styleSheets.opacity1
                                              ]}
                                          >
                                              <TouchableOpacity
                                                  activeOpacity={isDisable ? 1 : 0.8}
                                                  onPress={() => {
                                                      !isDisable ? this.props.onClick() : null;
                                                  }}
                                              >
                                                  <View
                                                      style={[
                                                          styles.circle,
                                                          !this.props.isSelect && {
                                                              ...CustomStyleSheet.borderColor(Colors.primary),
                                                              ...CustomStyleSheet.borderWidth(1)
                                                          }
                                                      ]}
                                                  >
                                                      {this.props.isSelect && (
                                                          <IconCheckCirlceo
                                                              size={Size.iconSize - 4}
                                                              color={Colors.primary}
                                                          />
                                                      )}
                                                  </View>
                                              </TouchableOpacity>
                                          </View>
                                      )}
                                      <View style={styles.styLeftIcon}>
                                          <Image style={styles.styIcon} source={{ uri: openPage.iconUrl }} />
                                      </View>
                                      <View style={[styles.container]} key={index}>
                                          <Text style={[styleSheets.text, styles.styTextNotify]}>
                                              {this.handleTitle(dataItem.title)}
                                          </Text>
                                          <Text style={[styleSheets.text, styles.styTextTime]}>
                                              {this.handleTimeDate(dataItem)}
                                          </Text>
                                      </View>
                                  </View>
                              </TouchableWithoutFeedback>
                          </Swipeable>
                      );
                  })}
              </View>
          );
      }
      return viewContent;
  }
}

const mapStateToProps = state => {
    return {
        countBadgesNotify: state.badgesNotification.countBadgesNotify
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setNumberBadgesNotify: number => {
            dispatch(badgesNotification.actions.setNumberBadgesNotify(number));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NtfNotificationListItem);

const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        backgroundColor: Colors.white
    },
    swipeableLayout: {
        flex: 1,
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingVertical: Size.defineSpace * 0.9,
        paddingHorizontal: Size.defineSpace
    },
    container: {
        flex: 1,
        marginBottom: 4
    },
    styLeftIcon: {
        marginRight: Size.defineSpace
    },
    styIcon: {
        width: Size.deviceWidth * 0.15,
        height: Size.deviceWidth * 0.15,
        resizeMode: 'cover',
        maxWidth: 100,
        maxHeight: 120
    },
    styTextNotify: {
        fontSize: Size.text - 1,
        marginBottom: 2
    },
    styTextTime: {
        fontSize: Size.text - 2,
        color: Colors.gray_7
    },
    styViewTitleGroup: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        paddingVertical: Size.defineSpace / 2
    },
    styViewTitleText: {
        flex: 1,
        justifyContent: 'center'
    },
    styBntShowMore: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: Size.defineHalfSpace,
        height: 30,
        justifyContent: 'center',
        borderRadius: 6
    },
    styBntShowMoreText: {
        fontWeight: '600',
        color: Colors.gray_10
    },

    styTextTitleGroup: {
        fontWeight: '600',
        color: Colors.gray_10,
        fontSize: Size.text + 2
    }
});
