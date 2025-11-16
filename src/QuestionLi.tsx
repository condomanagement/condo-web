import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import { makeStyles } from './makeStyles';
import { createStyles } from './makeStyles';
import { Theme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Amenity, Question } from 'condo-brain';

type QuestionProp = {
  children: Question;
  fetchQuestion: () => void;
  setQuestionToDelete: (id: number) => void;
  setSelectedQuestion: (question: Question) => void;
  setDeleteOpen: (open: boolean) => void;
  setQuestionOpen: (open: boolean) => void;
  setValue: (value: string) => void;
  setAmenityOpen: (open: boolean) => void;
  setAmenityChecks: (checks: boolean[]) => void;
  amenities: Amenity[]
}
const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  chips: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  chip: {
    backgroundColor: '#f37f30',
  },
  registerButton: {
    backgroundColor: '#f37f30',
    color: 'white',
    marginBottom: '20px',
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function QuestionLI(prop: QuestionProp): React.ReactElement {
  const {
    children,
    fetchQuestion,
    setQuestionToDelete,
    setSelectedQuestion,
    setDeleteOpen,
    setQuestionOpen,
    setValue,
    setAmenityOpen,
    setAmenityChecks,
    amenities,
  } = prop;
  const { classes } = useStyles();
  const question = children;
  const primary = question.question;
  const numberOfAmenities = question.amenities?.length;
  const remainingAmenities = numberOfAmenities - 3;
  const [expandedAmenities, setExpandedAmenities] = useState<boolean[]>([]);

  const expandQuestion = (id: number): void => {
    const existing = expandedAmenities;
    existing[id] = true;
    setExpandedAmenities(existing);
    fetchQuestion();
  };

  function deleteQuestion(theQuestion: Question): void {
    setQuestionToDelete(theQuestion.id);
    setSelectedQuestion(theQuestion);
    setDeleteOpen(true);
  }

  function editQuestion(theQuestion: Question): void {
    setSelectedQuestion(theQuestion);
    setValue(theQuestion.question);
    setQuestionOpen(true);
  }

  const openAmenity = (theQuestion: Question): void => {
    setSelectedQuestion(theQuestion);
    const checkedValues: boolean[] = [];
    Object.keys(theQuestion.amenities).forEach((a) => {
      const index = theQuestion.amenities[Number(a)].id;
      checkedValues[index] = true;
    });

    Object.keys(amenities).forEach((a) => {
      const index = amenities[Number(a)].id;
      if (!checkedValues[index]) {
        checkedValues[index] = false;
      }
    });

    setAmenityChecks(checkedValues);
    setAmenityOpen(true);
  };

  const secondary = (
    <div className={classes.chips}>
      {!(numberOfAmenities > 0) && (
        <>
          No associated amenities.
        </>
      )}
      {question.amenities && question.amenities.map((amenity, index) => (
        (index < 3 || expandedAmenities[question.id]) && (
          <Chip
            label={amenity.name}
            classes={{ colorPrimary: classes.chip }}
            color="primary"
            size="small"
          />
        )
      ))}
      {(remainingAmenities > 0 && !expandedAmenities[question.id]) && (
        <Chip
          label={`${remainingAmenities} more.`}
          classes={{ colorPrimary: classes.chip }}
          onClick={(): void => expandQuestion(question.id)}
          color="primary"
          size="small"
        />
      )}
      <IconButton aria-label="delete" size="small">
        <AddIcon fontSize="inherit" onClick={(): void => openAmenity(question)} />
      </IconButton>
    </div>
  );

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
            onClick={(): void => { editQuestion(question); }}
            size="large"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(): void => { deleteQuestion(question); }}
            size="large"
          >
            <DeleteIcon />
          </IconButton>
        </>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
