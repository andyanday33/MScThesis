import React, {ReactElement} from 'react';
import {Button, Card} from 'react-bootstrap';

type FinishedCardProps = {
  AlterGameState: () => void,
  ButtonText: string,
  HeaderText: string,
}

/**
 * A card component that could be used either in end game or end level.
 *
 * @param {FinishedCardProps} props containing
 *  a function to alter game state.
 * @return {ReactElement} A JSX consisting of a
 *  card with a button to next level.
 */
const FinishedCard: React.FC<FinishedCardProps> = ({AlterGameState,
  ButtonText, HeaderText}): ReactElement => {
  return (
    <Card
      bg='light'
      style={{width: '36rem'}}
      className='mb-2 m-auto mt-4 text-center'>
      <Card.Header>{HeaderText}</Card.Header>
      <Card.Body>
        <Card.Title></Card.Title>
        {/* TODO: add scores */}
        <Card.Text>
          DISPLAY_SCORE_HERE
        </Card.Text>
        <Button
          variant='primary'
          onClick={AlterGameState}
        >
          {ButtonText}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FinishedCard;
