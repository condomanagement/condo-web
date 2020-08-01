import React from 'react';
import {
  Button,
  Col,
  DatePicker,
  Icon,
  Row,
  TextInput,
} from 'react-materialize';
import { useForm } from 'react-hook-form';
import './styles/parking.scss';

type FormData = {
  make: string;
  model: string;
  start: string;
  end: string;
  unit: number;
  email: string;
}

export default function Parking(): JSX.Element {
  const startDate = new Date();
  const endDate = new Date(new Date().getTime() + (86400 * 1000));

  const { register, handleSubmit, watch, errors } = useForm<FormData>();
  const onSubmit = handleSubmit(({
    start,
    end,
    make,
    model,
    unit,
    email,
  }) => {
    console.log(start, end, make, model, unit, email);
  });

  return (
    <div className="section">
      <Row>
        <Col
          s={12}
          className="center"
        >
          <h4>Register a Vehicle</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <DatePicker
                id="start"
                options={{
                  autoClose: true,
                  defaultDate: startDate,
                  setDefaultDate: true,
                }}
              >
                <label htmlFor="start">Start Date</label>
              </DatePicker>
              <DatePicker
                id="end"
                options={{
                  autoClose: true,
                  defaultDate: endDate,
                  setDefaultDate: true,
                }}
              >
                <label htmlFor="end">End Date</label>
              </DatePicker>
            </Row>
            <Row>
              <TextInput
                id="license"
                s={6}
                label="License Plate"
                validate
              />
              <TextInput
                id="unit"
                s={6}
                label="Unit Number"
                validate
                type="number"
              />
            </Row>
            <Row>
              <TextInput
                id="make"
                s={6}
                label="Vehicle Make"
                validate
              />
              <TextInput
                id="color"
                s={6}
                label="Vehicle Colour"
                validate
              />
            </Row>
            <Row>
              <TextInput
                id="email"
                s={12}
                label="Email or Phone Number"
                validate
              />
            </Row>
            <Row>
              <Button
                node="button"
                waves="light"
                className="arrow-background-orange"
              >
                Register
                <Icon right>
                  directions_car
                </Icon>
              </Button>
            </Row>
          </form>
        </Col>
      </Row>
    </div>
  );
}
