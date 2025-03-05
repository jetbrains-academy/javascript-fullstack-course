import { useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #1a365d;
  color: #e4e4e4;
  border: 1px solid #2a4a7f;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2a4a7f;
  }
`;

const SumCalculator = ({ onError, onResult }) => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('/api/calculate', {
        params: { a: Number(a), b: Number(b) }
      });
      onResult({
        status: response.status,
        body: response.data
      });
      onError('');
    } catch (error) {
      let errorMessage = error.response?.status || '';
      if (errorMessage) errorMessage += ': ';
      errorMessage += error.response?.data?.message || 'Failed to calculate'
      onError(errorMessage);
    }
    setA('');
    setB('');
  };

  return (
    <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Parameter a"
        />
        <Input
          type="text"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Parameter b"
        />
      <Button type="submit">Calculate</Button>
    </Form>
  );
};

export default SumCalculator;
