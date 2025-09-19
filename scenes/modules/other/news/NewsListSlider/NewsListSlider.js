import React, { Component, createRef } from 'react';
import { FlatList, View, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Indicator from './Indicators';
import ChildItem from './ChildItem';
import { Size } from '../../../../../constants/styleConfig';

export default class NewsListSlider extends Component {
    slider = createRef();

    static defaultProps = {
        data: [],
        imageKey: 'image',
        local: false,
        width: Size.deviceWidth,
        height: 230,
        separatorWidth: 0,
        loop: true,
        indicator: true,
        indicatorStyle: {},
        indicatorContainerStyle: {},
        indicatorActiveColor: '#3498db',
        indicatorInActiveColor: '#bdc3c7',
        indicatorActiveWidth: 6,
        animation: true,
        autoscroll: true,
        timer: 3000,
        onPress: {},
        contentContainerStyle: {},
        component: <ChildItem />
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            data: []
        };
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log(nextProps.refreshSlider !== this.props.refreshSlider, 'refreshSlider')
        if (nextProps.refreshSlider !== this.props.refreshSlider) {
            this.setState({ data: nextProps.data });
        }
    }

    componentDidMount() {
        if (this.props.autoscroll) {
            this.startAutoPlay();
        }
        this.setState({ data: this.props.data });
    }

    componentWillUnmount() {
        if (this.props.autoscroll) {
            this.stopAutoPlay();
        }
    }

    render() {
        const itemWidth = this.props.width;
        const separatorWidth = this.props.separatorWidth;
        const totalItemWidth = itemWidth + separatorWidth;

        return (
            <View>
                <FlatList
                    ref={this.slider}
                    horizontal
                    pagingEnabled={true}
                    snapToInterval={totalItemWidth}
                    decelerationRate="fast"
                    bounces={false}
                    contentContainerStyle={this.props.contentContainerStyle}
                    data={this.state.data}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <ChildItem
                            key={index}
                            style={{ width: this.props.width }}
                            dataItem={item}
                            imageKey={this.props.imageKey}
                            onPress={this.props.onPress}
                            index={this.state.index % this.props.data.length}
                            active={index === this.state.index}
                            local={this.props.local}
                            height={this.props.height}
                            refreshSlider={this.props.refreshSlider}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={{ width: this.props.separatorWidth }} />}
                    keyExtractor={(item) => item.ID}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    viewabilityConfig={this.viewabilityConfig}
                    getItemLayout={(data, index) => ({
                        length: totalItemWidth,
                        offset: totalItemWidth * index,
                        index
                    })}
                    removeClippedSubviews={true}
                />
                {this.props.indicator && (
                    <Indicator
                        itemCount={this.props.data.length}
                        currentIndex={this.state.index % this.props.data.length}
                        indicatorStyle={this.props.indicatorStyle}
                        indicatorContainerStyle={[styles.indicatorContainerStyle, this.props.indicatorContainerStyle]}
                        indicatorActiveColor={this.props.indicatorActiveColor}
                        indicatorInActiveColor={this.props.indicatorInActiveColor}
                        indicatorActiveWidth={this.props.indicatorActiveWidth}
                        style={{ ...styles.indicator, ...this.props.indicatorStyle }}
                    />
                )}
            </View>
        );
    }

    onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            let currentIndex = viewableItems[0].index;
            if (currentIndex % this.props.data.length === this.props.data.length - 1 && this.props.loop) {
                this.setState({
                    index: currentIndex,
                    data: [...this.state.data, ...this.props.data]
                });
            } else {
                this.setState({ index: currentIndex });
            }

            if (this.props.currentIndexCallback) {
                this.props.currentIndexCallback(currentIndex);
            }
        }
    };

    viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50
    };

    changeSliderListIndex = () => {
        if (this.props.animation) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
        }
        this.setState({ index: this.state.index + 1 });
        this.slider.current.scrollToIndex({
            index: this.state.index,
            animated: true
        });
    };

    startAutoPlay = () => {
        this.sliderTimer = setInterval(this.changeSliderListIndex, this.props.timer);
    };

    stopAutoPlay = () => {
        if (this.sliderTimer) {
            clearInterval(this.sliderTimer);
            this.sliderTimer = null;
        }
    };
}

const styles = StyleSheet.create({
    indicatorContainerStyle: {
        marginTop: 10
    }
});
