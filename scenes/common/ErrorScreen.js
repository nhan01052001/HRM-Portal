import React, { Component } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import NoInternet from '../../components/network/NoInternet';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';

export default class ErrorScreen extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            ErrorDisplay: this.props.navigation.state.params.ErrorDisplay
                ? this.props.navigation.state.params.ErrorDisplay
                : null,
            isShowMess: this.props.navigation.state.params.isShowMess,
            isHiddenFeedback: this.props.navigation.state.params.isHiddenFeedback,
            isHiddenDownloadError: this.props.navigation.state.params.isHiddenDownloadError,
            isHiddenScanQrAgain: this.props.navigation.state.params.isHiddenScanQrAgain
        };
    }

    componentDidMount() {
        VnrLoadingSevices.hide();
    }

    render() {
        const { ErrorDisplay, isShowMess, isHiddenFeedback, isHiddenDownloadError, isHiddenScanQrAgain } = this.state;
        // eslint-disable-next-line no-console
        console.log(ErrorDisplay, 'ErrorDisplay');

        if (ErrorDisplay === 'NO_INTERNET') {
            return <NoInternet />;
        } else if (ErrorDisplay != null) {
            return <ErrorBoundary
                error={ErrorDisplay}
                isShowMess={isShowMess}
                isHiddenFeedback={isHiddenFeedback}
                isHiddenDownloadError={isHiddenDownloadError}
                isHiddenScanQrAgain={isHiddenScanQrAgain}
            />;
        } else {
            return null;
        }
    }
}
