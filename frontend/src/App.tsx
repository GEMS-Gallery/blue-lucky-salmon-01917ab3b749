import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 300,
  margin: 'auto',
}));

const DisplayTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = await calculateResult(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculateResult = async (firstOperand: number, secondOperand: number, operator: string): Promise<number> => {
    switch (operator) {
      case '+':
        return await backend.add(firstOperand, secondOperand);
      case '-':
        return await backend.subtract(firstOperand, secondOperand);
      case '*':
        return await backend.multiply(firstOperand, secondOperand);
      case '/':
        const result = await backend.divide(firstOperand, secondOperand);
        return result ? result : NaN;
      default:
        return secondOperand;
    }
  };

  return (
    <CalculatorPaper elevation={3}>
      <DisplayTextField
        fullWidth
        variant="outlined"
        value={display}
        InputProps={{ readOnly: true }}
      />
      <Grid container spacing={1}>
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((key) => (
          <Grid item xs={3} key={key}>
            <Button
              fullWidth
              variant="contained"
              color={['/', '*', '-', '+', '='].includes(key) ? 'primary' : 'secondary'}
              onClick={() => {
                if (key === '=') {
                  performOperation('=');
                } else if (['+', '-', '*', '/'].includes(key)) {
                  performOperation(key);
                } else if (key === '.') {
                  inputDecimal();
                } else {
                  inputDigit(key);
                }
              }}
            >
              {key}
            </Button>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="error" onClick={clear}>
            Clear
          </Button>
        </Grid>
      </Grid>
    </CalculatorPaper>
  );
};

export default App;
