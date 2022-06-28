import React from 'react';
import AlertDismissible from './AlertDismissable';

interface GoalAlertProps {
  success: boolean,
  loading: boolean,
  failed: boolean
}

/**
 * This is a component which consists of alerts depending on given states.
 *
 * @param {GoalAlertProps} props properties containing 3 states:
 * success, loading and fail.
 * @return {JSX.Element} A JSX template of alerts.
 */
export default function GoalAlert(
    {success, loading, failed}: GoalAlertProps): JSX.Element {
  return (
    <>
      {success && (<AlertDismissible variant='success' dismissible>
        Congratulations!
      </AlertDismissible>)}
      {loading && (<AlertDismissible variant='warning' dismissible>
        Game in Progress...
      </AlertDismissible>)}
      {failed && (<AlertDismissible variant='danger' dismissible>
        Try Again
      </AlertDismissible>)}
    </>
  );
}
