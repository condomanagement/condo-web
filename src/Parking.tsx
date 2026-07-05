import React from 'react';

const PARKING_REDIRECT_URL = 'https://app.condocontrol.com/visitor/my-visit';

export default function Parking(): React.ReactElement | null {
  React.useEffect(() => {
    window.location.replace(PARKING_REDIRECT_URL);
  }, []);

  return null;
}
