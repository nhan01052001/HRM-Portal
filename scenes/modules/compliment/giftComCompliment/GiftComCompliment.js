import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import ListGiftComCompliment from './ListGiftComCompliment';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3,
    Colors,
    Size
} from '../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../components/safeAreaView/SafeAreaViewDetail';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import moment from 'moment';
import VnrMonthYear from '../../../../components/VnrMonthYear/VnrMonthYear';
import { ConfigListFilter } from '../../../../assets/configProject/ConfigListFilter';
import {
    generateRowActionAndSelected,
    HistoryOfComComplimentBusinessFunction
} from '../historyOfComCompliment/HistoryOfComComplimentBusiness';

export const DATA = [
    {
        Title: 'GIFTSET VĂN PHÒNG CAO CẤP',
        Description:
            '- Giftset văn phòng cao cấp là sự kết hợp linh hoạt từ các quà tặng khác nhau như: Sạc pin dự phòng, Hộp đựng namecard, Sổ bìa da, Móc chìa khóa, USB, Ring đỡ điện thoại, Bút bi , Bút ký, … để tạo nên các bộ quà tặng khác nhau mang đến phong cách riêng, phù hợp với từng đối tượng khách hàng và concept chủ đạo trong mỗi sự kiện.\n- Bộ quà tặng (Giftset) 5 sản phẩm Bình giữ nhiệt, Bút ký cao cấp, tập sổ cao cấp, usb, ốp điện thoại.\n- Màu sắc: như hình ảnh.\n- In/khắc logo theo yêu cầu.\n- Là Công ty chuyên sản xuất bộ giftset quà tặng và các sản phẩm quà tặng khác. Qùa tặng BĂNG DƯƠNG luôn cam kết với khách hàng lấy ” Chất lượng làm đầu “, giá thành cạnh tranh nhất, ông vua giao hàng. Bên cạnh đó, chúng tôi cung cấp dịch vụ : Tư vấn thiết kế, vận chuyển toàn quốc miễn phí tại 1 điểm , sản xuất & giao hàng đúng hạn, chính xác.',
        Cost: 20,
        Remaining: 20,
        Exchange: 15,
        Image: 'https://quatangthuonghieu.vn/wp-content/uploads/2019/05/Bo-gift-cao-cap-7.png'
    },
    {
        Title: 'GIFTSET NƯỚC HOA NỮ YVES SAINT LAURENT LIBRE EDP',
        Description:
            '- Giftset nước hoa nữ Yves Saint Laurent Libre EDP 3 món là món quà tinh tế dành cho những cô nàng yêu thích sự sang trọng, quý phái, quyền lực. Gift set hội tụ đủ những gì bạn cần cho một vẻ ngoài đầy cuốn hút. Một chút hương thơm nữ tính, sang chảnh cùng một đôi môi đỏ quyến rũ, ắt hẳn sẽ làm cánh mày râu ấn tượng ngay từ lần gặp đầu tiên.\n- YSL hay Yves Saint Laurent hay thương hiệu thời trang đến từ nước Pháp. Thương hiệu này được thành lập trong những năm 1960 đến năm 1970 bởi hai nhà thiết kế Pierre Bergé và Yves Saint Laurent. Thoát ra khỏi những sự xa hoa phù phiếm thường thấy nay thương hiệu YSL cho ra đời nước hoa YSL Libre. Sản phẩm mang đến hình ảnh hiện đại của người phụ nữ tự do và mạnh mẽ. Yves Saint Laurent Libre miêu tả sự tự do của người phụ nữ với mùi hương ấm áp đến từ nhóm hương hoa cỏ phương đông. Khiến các nàng trở nên ngọt ngào, cuốn hút hơn và vẫn giữ được thành thái sang chảnh, kiêu sa của mình. \n- Nước hoa nữ Yves Saint Laurent Libre EDP mở đầu với sự bùng nổ từ cam Mandarin, lý chua đen và tinh dầu lá cam. Thành phần hương hoa oải hương xuất hiện để tô thêm nét mềm mại cho vị tươi mát từ cam chanh. Hoa nhài ở hương giữa tạo nên vẻ đẹp tinh tế, có thể khiến người khác mê mẩn hàng giờ, khi đi cùng với hương lavender thanh lịch. Vì mang phong cách phương Đông nên nốt cuối của YSL Libre không thể thiếu các thành phần xạ hương, vanilla và tuyết tùng. Mang đến hương vị nồng nàn, ấm áp và giúp cô nàng Yves Saint Laurent Libre EDP trở nên ngọt ngào và quyến rũ hơn, nhưng vẫn giữ được độ thanh lịch và tươi mới khi note hương cam vẫn hiện hữu. Sự sang trọng, gợi cảm và cá tính là điều hãng Yves Saint Laurent muốn gửi gắm đến cô nàng kiêu kỳ này.',
        Cost: 30,
        Remaining: 18,
        Exchange: 12,
        Image: 'https://www.boshop.vn/uploads/2022/12/27/63aaaada81a88-gift-set-nuoc-hoa-nu-yves-saint-laurent-libre-edp-3-mon-boshop.jpg'
    },
    {
        Title: 'ĐỒNG HỒ ĐỂ BÀN CAO CẤP',
        Description:
            '- Thiết kế đồng hồ để bàn hình con hươu này sẽ rất hợp với những không gian có phòng khách nhỏ nhưng vẫn muốn tạo dấu ấn đặc biệt hoặc để bàn làn việc mang lại tài lộc, may mắn.\n- Cặp hươu tài lộc bằng đồng gắn đá thạch anh decor tủ rượu\n- Decor để bàn tượng đại bàng tung cánh decor tủ rượu, bàn làm việc\n- Cặp quả cầu pha lê sang trọng trang trí nội thất\n- Cặp thiên nga trang trí phòng ngủ đơn giản\n- Tượng đầu ngựa trang trí phong cách vintage\n- Kích thước: 29cm x 23cm\n- Chất liệu: Đồng hồ sừng hươu làm bằng đồng nguyên chất kết hợp chân đế bằng dất sét nhân tạo PolyClay siêu bền siêu nét với công nghệ phủ màu mới \n- Trọng lượng: 1,7kg',
        Cost: 25,
        Remaining: 25,
        Exchange: 10,
        Image: 'https://salt.tikicdn.com/ts/product/02/89/26/67a5b3a43ed10f6b70778cf93671c612.png'
    },
    {
        Title: 'BỘ ẤM TRÀ TỬ SA BÁT TRÀNG',
        Description:
            '- Bộ ấm trà tử sa Bát Tràng kèm phụ kiện là kết tinh của óc sáng tạo cũng như sự lao động miệt mài của các nghệ nhân Bát Tràng. Chính sự thành công khi nghiên cứu ra ấm tử sa của Việt Nam đã khiến cho danh tiếng nghề gốm của chúng ta vươn ra ngoài thế giới. \n- Trà được pha bằng ấm tử sa thì ngon hơn, thanh hơn so với ấm trà gốm sứ. Bởi lẽ đây là loại ấm được làm bằng nguyên liệu đặc biệt, chỉ có tại một địa phương nhất định. Trong loại đất này có các khoáng chất đặc trưng, có thể làm giảm độ gắt, khô của nước trà. Đồng thời làm trà có hương dịu hơn, giúp cải thiện hương vị của trà so với khi pha bằng các ấm thủy tinh hoặc gốm sứ thông thường.\n- Bộ sản phẩm ấm trà vẽ sen nâu full phụ kiện là món quà tặng sang trọng, đẳng cấp dành tặng ông bà, bố mẹ và đồng nghiệp. Chắc hẳn mọi người sẽ rất hài lòng khi nhận được món quà độc đáo này.',
        Cost: 50,
        Remaining: 14,
        Exchange: 1,
        Image: 'https://battrangvn.vn/wp-content/uploads/2020/09/am-tu-sa-bat-trang.jpg'
    },
    {
        Title: 'TRANH THUYỀN THUẬN BUỒM XUÔI GIÓ MẠ VÀNG',
        Description:
            '- Trong đời sống thường ngày của người xưa thì khi phương tiện buôn bán, giao thương được sử dụng nhiều hàng hải, từ Quốc gia, vùng này đến vùng kia của các thương nhân là những còn thuyền. Một hải trình luôn gặp nhiều sóng to, bão lớn gây nhiều khó khăn cho các thuỷ đoàn. Mọi người đều thầm ước chuyến đi thành công, gặp nhiều thuận lợi để vượt qua giông bão, nên hình tượng con thuyền vẫn được người xưa gọi là thuyền doanh nhân.\n- Ngày nay cũng vậy, hình ảnh con thuyền đang căng buồm ra khơi ví như hình ảnh của những thương nhân trên thị trường trường, cả cuộc đời luôn gặp vượt qua sóng gió, những trở ngại trong công việc làm ăn kinh doanh.\n- Từ những tích đó, ngày nay nhiều doanh nhân thường treo một bức tranh thuận buồm xuôi gió mạ vàng hoặc mô hình thuyền buồm trong nhà, phòng khách kỳ mong sự may mắn thuận lợi trong công việc, ước mong sự bình an cho người thân trong gia đình.',
        Cost: 20,
        Remaining: 17,
        Exchange: 3,
        Image: 'https://product.hstatic.net/200000017614/product/tranh-thuyen-1_c39e1bedfccf4f9093d0b25462a065f6_master.jpg'
    },
    {
        Title: 'GIFTSET PHỤ KIỆN TRANG PHỤC',
        Description:
            '- Combo Special 5 trong 1 bao gồm năm món phụ kiện thời trang. Bộ quà tặng này không chỉ sang trọng mà còn có tính thiết thực cao. Điểm đặc biệt nhất của set quà tặng này là chiếc cà vạt lụa cao cấp được dệt từ 100% sợi tơ tằm tự nhiên mang đến cảm giác mềm mại và dễ chịu cho người sử dụng. Không chỉ người Việt Nam mà người nước ngoài cũng vô cùng thích các sản phẩm được làm từ tơ tằm.\n- Chất liệu: 100% lụa tơ tằm mềm nhẹ, bền đẹp, có độ bóng nhẹ tự nhiên đặc trưng của vải. Đây là loại sợi tơ protein động vật chắc chắn nhất được dùng trong thời trang cho đến thời điểm hiện tại và là dòng sản phẩm cao cấp nhất hiện có tại cửa hàng.\n- Bao gồm: 1 cà vạt lụa tơ tằm, 1 khăn cài túi áo, 1 ghim cài áo, 1 kẹp cà vạt, 2 khuy măng sét. Bộ quà tặng được đựng trong hộp và túi cao cấp.\n- Đặc điểm: Mẫu combo thiết kế độc đáo, tạo diện mạo nổi bật và thời trang cho người mặc.\n- Bản cà vạt: 5-8 cm (bản nhỏ dùng cho người thích phong cách trẻ trung hoặc có thân hình gầy, cân đối; bản lớn dùng cho người thích phong cách trang trọng hoặc có thân hình cao to).',
        Cost: 30,
        Remaining: 23,
        Exchange: 4,
        Image: 'https://cavatcaocap.com/wp-content/uploads/2023/10/CB5S064-1-gl-800x800.webp'
    }
];

let configList = null,
    enumName = null,
    giftComCompliment = null,
    giftComComplimentViewDetail = null,
    giftComComplimentKeyTask = null,
    pageSizeList = 20;

class GiftComCompliment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SearchDate: {
                value: null,
                refresh: false,
                disable: false
            },
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.AttSubmitTakeLeaveDayAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            if (HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[ScreenName.GiftComCompliment]) {
                this.reload();
            }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault ? this.storeParamsDefault : this.paramsDefault(),
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault?.dataBody,
                ...paramsFilter
            }
        };

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: giftComComplimentKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        if (!giftComCompliment) {
            giftComCompliment = ScreenName.GiftComCompliment;
        }
        if (!configList[giftComCompliment]) {
            configList[giftComCompliment] = {
                Api: {
                    urlApi: '[URI_HR]/Com_GetData/GetComplimentHistoryPraised',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'TimeLog',
                        dir: 'desc'
                    }
                ],
                Filter: [
                    {
                        logic: 'and',
                        filters: []
                    }
                ],
                BusinessAction: [
                    // {
                    //     "Type": "E_SENDMAIL",
                    //     "Resource": {
                    //         "Name": "HistoryOfBeComCompliment_New_Index_btnSendMail",
                    //         "Rule": "View"
                    //     }
                    // },
                ]
            };
        }

        const _configList = configList[giftComCompliment],
            filter = _configList[enumName.E_Filter];

        const dataRowActionAndSelected = generateRowActionAndSelected(giftComCompliment);
        let _params = {
            // IsPortal: true,
            // sort: orderBy,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify(),
            ProfileID: dataVnrStorage.currentUser.info.ProfileID
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: giftComComplimentKeyTask,
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

    pagingRequest = (page) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: giftComComplimentKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: 20,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload,
                        dataSourceRequestString: `page=${page}&pageSize=20`,
                        take: 20
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == giftComComplimentKeyTask) {
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

    componentDidMount() {
        PermissionForAppMobile.value = {
            ...PermissionForAppMobile.value,
            HistoryOfBeComCompliment_New_Index_btnSendMail: {
                View: true
            }
        };

        giftComCompliment = ScreenName.GiftComCompliment;
        giftComComplimentViewDetail = ScreenName.GiftComComplimentViewDetail;
        giftComComplimentKeyTask = EnumTask.KT_GiftComCompliment;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: giftComComplimentKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: null,
                skip: 0,
                take: 20
            }
        });
    }

    render() {
        const { dataBody, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange, SearchDate } =
            this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {giftComCompliment && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        {ConfigListFilter.value[giftComCompliment] && (
                            <View style={[styleContentFilterDesign.styRightPicker, { backgroundColor: Colors.white }]}>
                                <VnrFilterCommon
                                    dataBody={dataBody}
                                    style={{
                                        ...styleContentFilterDesign,
                                        contentFilter: {
                                            ...styleContentFilterDesign.contentFilter,
                                            backgroundColor: Colors.white,
                                            paddingHorizontal: 12
                                        },
                                        viewFilter: styleContentFilterDesignV3.viewFilter,
                                        filter: {
                                            ...styleContentFilterDesignV3.filter
                                        },
                                        search: {
                                            ...styleContentFilterDesign.search,
                                            backgroundColor: Colors.gray_3
                                        }
                                    }}
                                    screenName={giftComCompliment}
                                    onSubmitEditing={this.reload}
                                />
                                <View style={styles.wrapBtnSearchBymonth}>
                                    <VnrMonthYear
                                        response={'string'}
                                        format={'MM/YYYY'}
                                        value={SearchDate.value}
                                        refresh={SearchDate.refresh}
                                        type={'date'}
                                        stylePicker={styles.styleControll}
                                        styleTextPicker={styles.styMonthYear}
                                        placeHolder="MM/YYYY"
                                        onFinish={(value) => {
                                            if (value) {
                                                this.setState(
                                                    {
                                                        SearchDate: {
                                                            ...SearchDate,
                                                            value: value,
                                                            refresh: !SearchDate.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.reload({ RecordDate: moment(value).format('YYYY/MM') });
                                                    }
                                                );
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <ListGiftComCompliment
                                    detail={{
                                        dataLocal: false,
                                        screenName: giftComCompliment,
                                        screenDetail: giftComComplimentViewDetail,
                                        screenNameRender: ScreenName.GiftComCompliment
                                    }}
                                    point={this.props.navigation.state.params.point}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={giftComComplimentKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    color="volcano"
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Com_GetData/GetComplimentHistoryPraised',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="Title"
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    styMonthYear: {
        fontSize: 13
    },
    wrapBtnSearchBymonth: { width: 110, paddingVertical: Size.defineSpace / 2, paddingRight: 12 },
    styleControll: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: Colors.gray_3,
        borderWidth: 0,
        paddingHorizontal: 6,
        borderRadius: 0
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(GiftComCompliment);
