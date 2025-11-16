import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Amenity } from 'condo-brain';

type AmenityProp = {
  children: Amenity;
  setAmenityToDelete: (id: number) => void;
  setSelectedAmenity: (amenity: Amenity) => void;
  setDeleteOpen: (open: boolean) => void;
  setTimeLimit: (time: number) => void;
  setValue: (value: string) => void;
  setVisible: (visible: boolean) => void;
  setVaccine: (vaccine: boolean) => void;
  setAmenityOpen: (open: boolean) => void;
}

const minutesToReadable = (t: number): string => {
  const hours = Math.floor(t / 60);
  const hourText = hours > 1 ? 'hours' : 'hour';

  const minutes = t % 60;

  let timeText = '';
  if (hours > 0) {
    timeText = `${hours} ${hourText} `;
  }

  if (minutes > 0) {
    timeText = `${timeText} ${minutes} minutes`;
  }
  return timeText;
};

export default function AmenityLI(prop: AmenityProp): React.ReactElement {
  const {
    setAmenityToDelete,
    setSelectedAmenity,
    setDeleteOpen,
    setTimeLimit,
    setValue,
    setVisible,
    setVaccine,
    setAmenityOpen,
    children,
  } = prop;
  const amenity = children;
  const icon = amenity.vaccine ? '💉' : '🦠';
  const primary = `${icon} ${amenity.name}`;
  const secondary = minutesToReadable(amenity.timeLimit);

  function deleteAmenity(theAmenity: Amenity): void {
    setAmenityToDelete(theAmenity.id);
    setSelectedAmenity(theAmenity);
    setDeleteOpen(true);
  }

  function editAmenity(theAmenity: Amenity): void {
    setSelectedAmenity(theAmenity);
    setTimeLimit(theAmenity.timeLimit);
    setValue(theAmenity.name);
    setVisible(theAmenity.visible);
    setVaccine(theAmenity.vaccine);
    setAmenityOpen(true);
  }

  return (
    <ListItem>
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
      <ListItemSecondaryAction>
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={(): void => { editAmenity(amenity); }}
            size="large"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(): void => { deleteAmenity(amenity); }}
            size="large"
          >
            <DeleteIcon />
          </IconButton>
        </>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

