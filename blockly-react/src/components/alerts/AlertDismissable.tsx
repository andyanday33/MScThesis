import React from 'react';
import {Alert} from 'react-bootstrap';
import {useState} from 'react';

/**
 * A functional component which is a dismissable alert.
 *
 * @return {JSX.Element} a JSX template consisting of a dismissable alert.
 */
function AlertDismissible({children, ...rest}: React.ComponentProps<any>) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert {...rest} onClose={() => setShow(false)} dismissible>
        {children}
      </Alert>
    );
  }
  return <></>;
}

export default AlertDismissible;
