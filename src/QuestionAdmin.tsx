import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { AdminManager, Amenity, Question } from 'condo-brain';
import { Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

type QuestionProp = {
  children: Question;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
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

export default function QuestionAdmin(): JSX.Element {
  const classes = useStyles();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [value, setValue] = useState('');
  const [amenityOpen, setAmenityOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>(undefined);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenityChecks, setAmenityChecks] = useState<boolean[]>([]);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }
  const fetchQuestion = async (): Promise<void> => {
    admin.getQuestions().then((response) => {
      setQuestions(response);
    });
  };

  function addQuestion(e: React.FormEvent): void {
    e.preventDefault();
    const formData = new FormData();
    formData.append('question[question]', value);
    formData.append('question[required_answer]', 'true');
    admin.createQuestion(formData)
      .then((_response: boolean) => {
        setValue('');
        fetchQuestion();
      });
  }

  function deleteQuestion(id: number): void {
    admin.deleteQuestion(id)
      .then((_response: boolean) => {
        fetchQuestion();
      });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const fetchAmenities = async (): Promise<void> => {
    admin.getAmenities().then((response) => {
      setAmenities(response);
    });
  };

  const openAmenity = (question: Question): void => {
    setSelectedQuestion(question);
    const checkedValues: boolean[] = [];
    Object.keys(question.amenities).forEach((a) => {
      const index = question.amenities[Number(a)].id;
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

  useEffect(() => {
    fetchQuestion();
    fetchAmenities();
  }, [questions.length]);

  const handleCheckChange = (
    event: React.ChangeEvent<{ name?: string; checked: unknown }>,
    amenity: Amenity,
  ): void => {
    const formData = new FormData();
    if (event.target.checked) {
      const currentAnswers = amenityChecks;
      currentAnswers[Number(event.target.name)] = true;
      setAmenityChecks(currentAnswers);
      formData.append('resource_question[resource_id]', String(amenity.id));
      formData.append('resource_question[question_id]', String(selectedQuestion?.id));
      admin.createAmenityQuestion(formData).then(() => {
        fetchQuestion();
      });
    } else {
      const currentAnswers = amenityChecks;
      currentAnswers[amenity.id] = false;
      setAmenityChecks(currentAnswers);
      formData.append('resource_question[resource_id]', String(amenity.id));
      formData.append('resource_question[question_id]', String(selectedQuestion?.id));
      admin.deleteAmenityQuestion(formData).then(() => {
        fetchQuestion();
      });
    }
  };

  const QuestionLI = (prop: QuestionProp): JSX.Element => {
    const question = prop.children;
    const primary = question.question;
    const secondary = (
      <div className={classes.chips}>
        {!(question.amenities?.length > 0) && (
          <>
            No associated amenities.
          </>
        )}
        {question.amenities && question.amenities.map((amenity) => (
          <>
            <Chip
              label={amenity.name}
              classes={{ colorPrimary: classes.chip }}
              color="primary"
              size="small"
            />
          </>
        ))}
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
          <IconButton edge="end" aria-label="delete" onClick={(): void => { deleteQuestion(question.id); }}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Admin</h4>
          <form className={classes.root} noValidate autoComplete="off" onSubmit={addQuestion}>
            <TextField
              id="standard-multiline-flexible"
              label="Enter new question"
              multiline
              rowsMax={4}
              value={value}
              onChange={handleChange}
            />
            <Button className={classes.registerButton} variant="contained" type="submit">
              Add Question
            </Button>
          </form>
          <List>
            {questions.map((question) => <QuestionLI key={question.id}>{question}</QuestionLI>)}
          </List>
        </Grid>
      </Grid>
      <Dialog open={amenityOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Associated Amenities</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedQuestion?.question}
          </DialogContentText>
          {amenities.map((amenity): JSX.Element => (
            <>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={amenityChecks[amenity.id]}
                    onChange={(e): void => handleCheckChange(e, amenity)}
                    name={String(amenity.id)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                )}
                label={amenity.name}
              />
              <br />
            </>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => setAmenityOpen(false)} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
