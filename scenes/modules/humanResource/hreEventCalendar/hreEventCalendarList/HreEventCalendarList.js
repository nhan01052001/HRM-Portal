import React, { Component } from 'react';
import { FlatList } from 'react-native';
import HreEventCalendarListItem from './HreEventCalendarListItem';
import moment from 'moment';

class HreEventCalendarList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemHeights: {} // Lưu chiều cao của mỗi mục
        };
        this.flatListRef = React.createRef();
    }

    // shouldComponentUpdate(nextProps) {
    //     // return !Vnr_Function.compare(nextProps.data, this.props.data)
    //     return nextProps.filter !== this.props.filter
    // }

    handleItemLayout = (index, height) => {
        this.setState((prevState) => ({
            itemHeights: {
                ...prevState.itemHeights,
                [index]: height
            }
        }));
    };

    getItemLayout = (data, index) => {
        const { itemHeights } = this.state;
        const itemHeight = itemHeights[index] || 0;
        const offset = Object.values(itemHeights)
            .slice(0, index)
            .reduce((acc, height) => acc + height, 0);
        return { length: itemHeight, offset, index };
    };

    handleEndReached = () => {
        //Xu ly khi item cuoi cung duoc render, scroll den ngay hien tai
        const { daySelected, data } = this.props;

        if (moment(daySelected).format('YYYY-MM') === moment().format('YYYY-MM')) {
            const dataIndex = data.findIndex((item) => moment(item.DateCalendar).format('YYYY-MM-DD') === daySelected);
            this.props.scrollToEventListItem(dataIndex);
        }
    };

    render() {
        const { data, filter } = this.props;

        return (
            <FlatList
                ref={(ref) => (this.flatListRef = ref)}
                data={data}
                renderItem={({ item, index }) => {
                    return (
                        <HreEventCalendarListItem
                            index={index}
                            filter={filter}
                            onLayout={this.handleItemLayout}
                            data={item}
                        />
                    );
                }}
                onEndReached={this.handleEndReached}
                // onEndReachedThreshold={0.1}
                keyExtractor={(item) => item.id}
                getItemLayout={this.getItemLayout}
            />
        );
    }
}

export default HreEventCalendarList;
