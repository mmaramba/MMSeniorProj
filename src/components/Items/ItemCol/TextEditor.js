import React from 'react';
import ReactQuill from 'react-quill';
import { Icon, Dropdown, Menu } from 'antd';
import './TextEditor.css';
import styled from 'styled-components';

// Register Quill font sizes
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['large', 'medium', "small", "regular", "bold", "pullquote"] ;
ReactQuill.Quill.register(Font, true);

// From QuillJS Custom Toolbar Example
const CustomToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats fmt1">
        <select className="ql-header" defaultValue={"3"} onChange={e => e.persist()}>
        <option value="3">Small</option>
        <option value="2">Medium</option>
        <option value="1">Large</option>
        </select>
    </span>
    <span className="ql-formats fmt2">
        <button className="ql-bold"></button>
        <button className="ql-italic">
        </button>
        <select className="ql-color" defaultValue={"black"}>
            <option value="red"></option>
            <option value="green"></option>
            <option value="blue"></option>
            <option value="orange"></option>
            <option value="violet"></option>
            <option value="#d0d1d2"></option>
            <option value="black"></option>
        </select>
        <select className="ql-background" defaultValue={"white"}>
            <option value="#a6b8bf"></option>
            <option value="green"></option>
            <option value="blue"></option>
            <option value="orange"></option>
            <option value="violet"></option>
            <option value="#d0d1d2"></option>
            <option value="white"></option>
        </select>
    </span>
    <span className="ql-formats fmt2">
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
    </span>
    <span className="ql-formats fmt2">
        <button className="ql-link"></button>
        <button className="ql-blockquote"></button>
        <button className="ql-code-block"></button>
    </span>
  </div>
)

const CategoryLabel = styled.h4`
  text-align: left;
  margin-left: 16px;
  color: ${props => props.lightmode === "true" ? "rgba(0, 0, 0, 0.65)" : "white"};
  cursor: pointer;
  user-select: none;
`

const ItemTitle = styled.div`
  text-align: left;
  margin-top: 8px;
  margin-left: 16px;
  cursor: text;
  user-select: none;
  font-weight: 600;
  font-size: 1.4em;
`

const StyledReactQuill = styled(ReactQuill)`
  height: 300px;
  width: 100%;
`

const StyledMenu = styled(Menu)`
  width: 200px;
`

const TextEditorContainer = styled.div`

  .ql-toolbar.ql-snow .fmt2{
    border: none;
    filter: ${props => props.lightmode === "true" ? "none" : "brightness(0) invert(1)"};
  }

  .ql-toolbar.ql-snow .ql-picker-label{
    border: none;
    filter: ${props => props.lightmode === "true" ? "none" : "brightness(0) invert(1)"};
  }

  .ql-toolbar.ql-snow .ql-picker-options{
    background-color: ${props => props.lightmode === "true" ? "white" : "black"};
    color: ${props => props.lightmode === "true" ? "black" : "white"};
  }
`


class TextEditor extends React.Component {
  constructor (props) {
    super(props)
    //console.log(this.props.content);
    this.state = { 
      editorHtml: this.props.content,
      title: this.props.title
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClickTitle = this.handleClickTitle.bind(this)
    this.handleClickAwayFromTitle = this.handleClickAwayFromTitle.bind(this)
    this.handleTitleKeyPress = this.handleTitleKeyPress.bind(this)
    this.inputEl = React.createRef();
    this.pdfSaveRef = React.createRef();
  }

  
  handleChange (html) {
  	this.setState({ editorHtml: html });
  }

  handleClickTitle () {
    this.setState({ title: '' });
  }

  // TODO
  handleClickAwayFromTitle () {
    // if title is empty: don't change title and change it back to what it was before
    if (this.inputEl.current.innerText === '') {
      this.setState({ title: this.props.title });
    } 
    // otherwise, change it
    else {
      this.setState({ title: this.inputEl.current.innerText })
      console.log("send api req here");

      this.props.handleTitleChange(this.inputEl.current.innerText);
    }
  }

  // TODO
  handleTitleKeyPress (event) {
    // trigger blur, change title if enter key
    if (event.charCode === 13) {
      event.preventDefault();
      console.log("update title:" + this.inputEl.current.innerText);

      //triggers handleClickAwayFromTitle
      this.inputEl.current.blur();
    }
  }

  componentDidMount() {
    this.props.setRef(this.pdfSaveRef);
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.setState({
        editorHtml: this.props.content
      });
    }

    if (this.props.title !== prevProps.title) {
      this.setState({
        title: this.props.title
      });
    }
  }

  handleCategoryClick = ({ key }) => {
    console.log(`CLICKED ON CAT  ${key}`);
    console.log(`NAME OF CAT: ${this.props.categories.byId[key].name}`);
    this.props.editCatCb(key);
  }

  render() {
    //console.log(this.state.editorHtml);
    console.log("rerendering");

    const menu = (
      <StyledMenu onClick={this.handleCategoryClick}>
        {this.props.categories.allIds.map(cat => {
          return (
            <Menu.Item key={this.props.categories.byId[cat]._id.$oid}>
              {this.props.categories.byId[cat].name}
            </Menu.Item>
          );
        })}
      </StyledMenu>
    );

    return (
      <TextEditorContainer lightmode={this.props.lightmode}>
        <Dropdown overlay={menu}>
          <CategoryLabel lightmode={this.props.lightmode}>
            <span><Icon type="folder" /> {this.props.cat}</span>
          </CategoryLabel>
        </Dropdown>
        <div>{this.props.saveMsg}</div>
        <CustomToolbar />
        <div ref={this.pdfSaveRef}>
          <ItemTitle
            contentEditable={true}
            className="itemTitle"
            onClick={this.handleClickTitle}
            onBlur={this.handleClickAwayFromTitle}
            onKeyPress={this.handleTitleKeyPress}
            ref={this.inputEl}
            suppressContentEditableWarning={true}
          >
            {this.state.title}
          </ItemTitle>
          <StyledReactQuill
            onChange={this.props.handleContentChange}
            placeholder={this.props.placeholder}
            modules={TextEditor.modules}
            value={this.props.content}
          />
        </div>
      </TextEditorContainer>
    )
  }
}

// Attach Quill toolbar to module
TextEditor.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
    }
  }
}

// Quill editor formats
TextEditor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color',
]

export default TextEditor;