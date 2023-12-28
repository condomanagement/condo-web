import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { AdminManager, Amenity, Question } from 'condo-brain';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import QuestionLI from './QuestionLi';

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
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(0);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
        setQuestionOpen(false);
      });
  }

  function doDeleteQuestion(): void {
    admin.deleteQuestion(questionToDelete)
      .then((_response: boolean) => {
        fetchQuestion();
        setDeleteOpen(false);
      });
  }

  function updateQuestion(e: React.FormEvent, question?: Question): void {
    if (!question) {
      addQuestion(e);
      setQuestionOpen(false);
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append('question[question]', value);
      formData.append('question[required_answer]', 'true');
      formData.append('question[id]', String(question.id));
      admin.editQuestion(formData, question.id)
        .then((_response: boolean) => {
          setValue('');
          fetchQuestion();
          setQuestionOpen(false);
        });
    }
    setSelectedQuestion(undefined);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const fetchAmenities = async (): Promise<void> => {
    admin.getAmenities().then((response) => {
      setAmenities(response);
    });
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

  const deleteConfirmation = (
    <Dialog
      open={deleteOpen}
      onClose={(): void => setDeleteOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete
        {' '}
        &ldquo;
        {selectedQuestion?.question}
        &rdquo;?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this question?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={(): void => { setSelectedQuestion(undefined); setDeleteOpen(false); }} color="primary">
          Cancel
        </Button>
        <Button onClick={(): void => doDeleteQuestion()} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  const questionPopup = (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={addQuestion}>
      <Dialog open={questionOpen} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Edit Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedQuestion?.question}
          </DialogContentText>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                id="standard-multiline-flexible"
                label="Enter new question"
                multiline
                maxRows={4}
                value={value}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => setQuestionOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={(e): void => updateQuestion(e, selectedQuestion)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Question Admin</h4>
          <Grid item xs={12}>
            <List>
              {questions.map((question) => (
                <QuestionLI
                  key={question.id}
                  fetchQuestion={fetchQuestion}
                  setQuestionToDelete={setQuestionToDelete}
                  setSelectedQuestion={setSelectedQuestion}
                  setDeleteOpen={setDeleteOpen}
                  setQuestionOpen={setQuestionOpen}
                  setValue={setValue}
                  setAmenityOpen={setAmenityOpen}
                  setAmenityChecks={setAmenityChecks}
                  amenities={amenities}
                >
                  {question}
                </QuestionLI>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} className="center">
            <Button className={classes.registerButton} variant="contained" onClick={(): void => setQuestionOpen(true)}>
              Add Question
            </Button>
          </Grid>
        </Grid>
        {questionPopup}
        {deleteConfirmation}
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
