import { Button, Modal } from '@transferwise/components';
import { Illustration } from '@wise/art';

type Props = {
  inviteeName: string;
  open: boolean;
  onClose: () => void;
  onCancelInvite: () => void;
};

export function JointAccountWaitingPage({ inviteeName, open, onClose, onCancelInvite }: Props) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formattedExpiry = expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Modal
      open={open}
      onClose={onClose}
      body={
        <div className="joint-waiting-modal">
          <div className="joint-waiting-modal__body">
            <div className="joint-waiting-modal__illustration">
              <Illustration name="sand-timer" size="medium" />
            </div>
            <h1 className="np-display np-text-display-small joint-waiting-modal__title">
              We're waiting for {inviteeName} to accept
            </h1>
            <p className="np-text-body-large joint-waiting-modal__subtitle">
              The invite expires on {formattedExpiry}.
            </p>
          </div>
          <div className="joint-waiting-modal__footer">
            <Button v2 size="lg" priority="secondary" sentiment="negative" block onClick={onCancelInvite}>
              Cancel invite
            </Button>
          </div>
        </div>
      }
    />
  );
}
