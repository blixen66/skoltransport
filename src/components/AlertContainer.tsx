import React from 'react';
import { Alert as AlertType } from '../types';
import Alert from './Alert';

interface AlertContainerProps {
  alerts: AlertType[];
  onRemoveAlert: (id: string) => void;
}

const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, onRemoveAlert }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          alert={alert}
          onRemove={onRemoveAlert}
        />
      ))}
    </div>
  );
};

export default AlertContainer;

