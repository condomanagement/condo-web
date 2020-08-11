import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { AdminManager, Question } from 'condo-brain';
import { Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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

  useEffect(() => {
    fetchQuestion();
  }, [questions.length]);

  const QuestionLI = (prop: QuestionProp): JSX.Element => {
    const question = prop.children;
    const primary = question.question;

    return (
      <ListItem>
        <ListItemText
          primary={primary}
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
    </div>
  );
}
