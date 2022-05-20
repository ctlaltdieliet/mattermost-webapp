// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useEffect} from 'react';
import {CSSTransition} from 'react-transition-group';
import styled from 'styled-components';

import {FormattedMessage, useIntl} from 'react-intl';

import {useSelector, useDispatch} from 'react-redux';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';

import completedImg from 'images/completed.svg';

import {GlobalState} from 'mattermost-redux/types/store';
import {getLicense} from 'mattermost-redux/selectors/entities/general';
import {getPrevTrialLicense} from 'mattermost-redux/actions/admin';

import StartTrialBtn from 'components/learn_more_trial_modal/start_trial_btn';

const CompletedWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 26px 24px 0 24px;
    margin: auto;
    text-align: center;
    word-break: break-word;
    width: 100%;
    height: 500px;

    &.fade-enter {
        transform: scale(0);
    }
    &.fade-enter-active {
        transform: scale(1);
    }
    &.fade-enter-done {
        transform: scale(1);
    }
    &.fade-exit {
        transform: scale(1);
    }
    &.fade-exit-active {
        transform: scale(1);
    }
    &.fade-exit-done {
        transform: scale(1);
    }
    .start-trial-btn, button {
        padding: 13px 20px;
        background: var(--button-bg);
        border-radius: 4px;
        color: var(--sidebar-text);
        border: none;
        font-weight: bold;
        margin-top: 15px;
        min-height: 40px;
        &:hover {
            background: var(--button-bg) !important;
            color: var(--sidebar-text) !important;
        }
    }

    h2 {
        font-size: 20px;
        margin: 0 0 10px;
        font-weight: 600;
    }

    .start-trial-text, .completed-subtitle {
        font-size: 14px !important;
        color: rgba(var(--center-channel-color-rgb), 0.72);
        line-height: 20px;
    }

    .completed-subtitle {
        margin-top: 5px;
    }

    .disclaimer, .download-apps {
        width: 90%;
        margin-top: 15px;
        color: rgba(var(--center-channel-color-rgb), 0.72);
        font-family: "Open Sans";
        font-style: normal;
        font-weight: normal;
        line-height: 16px;
    }

    .disclaimer {
        text-align: left;
        margin-top: auto;
        font-size: 11px;
    }

    .download-apps {
        margin-top: 24px;
        width: 200px;
        font-size: 12px;
    }
`;

interface Props {
    dismissAction: () => void;
}

const Completed = (props: Props): JSX.Element => {
    const {dismissAction} = props;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPrevTrialLicense());
    }, []);

    const prevTrialLicense = useSelector((state: GlobalState) => state.entities.admin.prevTrialLicense);
    const license = useSelector(getLicense);
    const isPrevLicensed = prevTrialLicense?.IsLicensed;
    const isCurrentLicensed = license?.IsLicensed;

    // Show this CTA if the instance is currently not licensed and has never had a trial license loaded before
    const showStartTrialBtn = (isCurrentLicensed === 'false' && isPrevLicensed === 'false');

    const {formatMessage} = useIntl();

    return (
        <>
            <CSSTransition
                in={true}
                timeout={150}
                classNames='fade'
            >
                <CompletedWrapper>
                    <img
                        src={completedImg}
                        alt={'completed tasks image'}
                    />
                    <h2>
                        <FormattedMessage
                            id={'onboardingTask.checklist.completed_title'}
                            defaultMessage='Well done. You’ve completed all of the tasks!'
                        />
                    </h2>
                    <span className='completed-subtitle'>
                        <FormattedMessage
                            id={'onboardingTask.checklist.completed_subtitle'}
                            defaultMessage='We hope Mattermost is more familiar now.'
                        />
                    </span>

                    {showStartTrialBtn ? (
                        <>
                            <span className='start-trial-text'>
                                <FormattedMessage
                                    id='onboardingTask.checklist.higher_security_features'
                                    defaultMessage='Interested in our higher-security features?'
                                /> <br/>
                                <FormattedMessage
                                    id='onboardingTask.checklist.start_enterprise_now'
                                    defaultMessage='Start your free Enterprise trial now!'
                                />
                            </span>
                            <StartTrialBtn
                                message={formatMessage({id: 'start_trial.modal_btn.start_free_trial', defaultMessage: 'Start free 30-day trial'})}
                                telemetryId='start_trial_from_onboarding_completed_task'
                                onClick={dismissAction}
                            />
                        </>

                    ) : (
                        <button onClick={dismissAction}>
                            <FormattedMessage
                                id={'collapsed_reply_threads_modal.confirm'}
                                defaultMessage='Got it'
                            />
                        </button>
                    )}
                    <div className='download-apps'>
                        <span>
                            <FormattedMessage
                                id='onboardingTask.checklist.downloads'
                                defaultMessage='Now that you’re all set up, <link>download our apps.</link>!'
                                values={{
                                    link: (msg: React.ReactNode) => (
                                        <a
                                            href='https://mattermost.com/download'
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {msg}
                                        </a>
                                    ),
                                }}
                            />
                        </span>
                    </div>
                    <div className='disclaimer'>
                        <span>
                            <FormattedMessage
                                id='onboardingTask.checklist.disclaimer'
                                defaultMessage='By clicking “Start trial”, I agree to the <linkEvaluation>Mattermost Software Evaluation Agreement</linkEvaluation>, <linkPrivacy>privacy policy</linkPrivacy> and receiving product emails.'
                                values={{
                                    linkEvaluation: (msg: React.ReactNode) => (
                                        <a
                                            href='https://mattermost.com/software-evaluation-agreement'
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {msg}
                                        </a>
                                    ),
                                    linkPrivacy: (msg: React.ReactNode) => (
                                        <a
                                            href='https://mattermost.com/privacy-policy'
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {msg}
                                        </a>
                                    ),
                                }}
                            />
                        </span>
                    </div>
                </CompletedWrapper>
            </CSSTransition>
        </>
    );
};

export default Completed;
