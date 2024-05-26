import React from 'react';
import { useState } from 'react';
import '../../sass/UserPolls.scss';
import '../../sass/DeleteButton.scss';

type TDeleButtonProps = {
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id?: string;
  poll?: boolean;
};

const DeleteButton = ({ callback, id, poll }: TDeleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const confirmationBox = isOpen && (
    <div className="delete-confirmation">
      <div className="delete-confirmation__box">
        <h3>Are you sure you want delete this poll?</h3>
        <div className="delete-confirmation__buttons">
          <button
            type="button"
            className="btn btn--delete"
            onClick={callback}
          >
            Confirm
          </button>
          <button
            type="button"
            className="btn btn--cancel"
            onClick={(): void => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <button
        data-testid={id}
        type="button"
        className={`btn btn--delete ${
          poll ? 'btn--delete--poll' : 'user-polls__btn'
        }`}
        onClick={() => setIsOpen(true)}
      >
        Delete
      </button>
      {confirmationBox}
    </>
  );
};

export default DeleteButton;
