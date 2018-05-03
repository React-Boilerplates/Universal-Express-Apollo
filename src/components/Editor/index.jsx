import React from 'react';
import { Editor, EditorState } from 'draft-js';
import styled from 'styled-components';
import 'draft-js/dist/Draft.css';

const Div = styled.div`
  box-shadow: inset 0 0 2px #000;
  border-radius: 3px;
  padding: 3px;
`;

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }
  render() {
    return (
      <Div>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </Div>
    );
  }
}

export default MyEditor;
