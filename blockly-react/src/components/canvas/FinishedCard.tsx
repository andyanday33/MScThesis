import React, {ReactElement} from 'react';
import {Card} from 'react-bootstrap';

type FinishedCardProps = {
  headerText: string,
  children: JSX.Element[] | JSX.Element,
}

/**
 * A card component that could be used either in end game or end level.
 *
 * @param {FinishedCardProps} props containing
 *  a function to alter game state.
 * @return {ReactElement} A JSX consisting of a
 *  card with a button to next level.
 */
const FinishedCard: React.FC<FinishedCardProps> = ({children,
  headerText}): ReactElement => {
  return (
    <Card
      bg='light'
      style={{width: '36rem'}}
      className='mb-2 m-auto mt-4 text-center'>
      <Card.Header>{headerText}</Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
};

export default FinishedCard;
