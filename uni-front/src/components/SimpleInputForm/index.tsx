import { useState, ReactElement } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

import styled from 'styled-components';

interface SimpleIMpotFormProp {
  placeholderText: string;
  submitCd: (text: string) => unknown;
  className?: string;
}

function SimpleIMpotForm(prop: SimpleIMpotFormProp): ReactElement {
  const [text, setText] = useState('');

  return (
    <div className={prop.className ?? ''}>
      <SimpleIMpotFormStyled>
        <Card className="rounded-start-0">
          <div className="post-header px-3 py-2">
            <Form>
              <Form.Group className="mb-3" controlId="formSimpleInput">
                <Form.Control
                  placeholder={prop.placeholderText}
                  as="textarea"
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="success"
                className="w-100"
                onClick={() => prop.submitCd(text)}
              >
                Send for verification
              </Button>
            </Form>
          </div>
        </Card>
      </SimpleIMpotFormStyled>
    </div>
  );
}

const SimpleIMpotFormStyled = styled.div`
  .card {
    background-color: ${({ theme }) => theme.primaryBgc};
    border: ${({ theme }) => theme.primaryBorder};
  }
`;

export default SimpleIMpotForm;
