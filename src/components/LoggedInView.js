import React from 'react';
import { Layout, Spin } from 'antd';
import LeftNav from './LeftNav/LeftNav.js';
import ItemsView from './Items/ItemsView.js';
import { getUser, createItem } from '../api.js';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import {
  fetchUserInfo,
  fetchCategories,
  fetchCreateItem,
  switchMode,
  fetchEditName,
  fetchCreateCat
} from '../actions.js';
import { connect } from 'react-redux';

const SpinContainer = styled.div`
  display: inline-block;
  padding-top: 200px;
`

const StyledLayout = styled(Layout)`
  height: 100vh;
`

const LoadingText = styled.div`
  margin-top: 20px;
`


class LoggedInView extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    user: {}
  }

  componentDidMount() {
    console.log("Make GET /user request here");
    getUser().then((res) => {
      this.setState({
        user: res
      });
    });

    this.props.dispatch(fetchUserInfo());
    this.props.dispatch(fetchCategories());
  }

  boundedSwitchMode = () => {
    this.props.dispatch(switchMode());
  }

  boundedEditName = (data) => {
    this.props.dispatch(fetchEditName(data));
  }

  boundedNewCat = (data) => {
    this.props.dispatch(fetchCreateCat(data));
  }

  // todo: make create item when in /starred auto-star item
  createItemButtonPressed = () => {
    console.log("Create item button was pressed");
    console.log(this.props.filter);

    const reqBody = {
      content: "",
      categoryId: this.props.filter.categoryId,
      title: "Untitled"
    }

    console.log(reqBody);
    this.props.dispatch(fetchCreateItem(reqBody));
  }

  render() {
    const { userInfo, categories } = this.props;
    const { isFetchingUser, email, firstName, lastName, lightMode } = userInfo;
    const { isFetchingCategories, byId, allIds } = categories;

    // if empty object or fetching user
    if ((Object.keys(this.state.user).length === 0 && this.state.user.constructor === Object) || isFetchingUser || isFetchingCategories) {
      return (
        <SpinContainer>
          <Spin />
          <LoadingText>Loading...</LoadingText>
        </SpinContainer>
      );
    }

    return (
      <StyledLayout>
        <HashRouter>
          <LeftNav
            categories={categories}
            first={firstName}
            last={lastName}
            email={email}
            createItemHandler={this.createItemButtonPressed}
            lightmode={lightMode}
            switchCb={this.boundedSwitchMode}
            editNameCb={this.boundedEditName}
            newCatCb={this.boundedNewCat}
          />
          <Switch>
            <Route path="/items" render={(props) => {
              return <ItemsView categories={categories} {...props} lightmode={lightMode} />
            }} />
            <Route path="/starred" render={(props) => {
              return <ItemsView categories={categories} {...props} lightmode={lightMode} />
            }} />
            <Route path="/cat/:categoryId" render={(props) => {
              return <ItemsView categories={categories} {...props} lightmode={lightMode} />
            }} />
            <Route path="/search" render={(props) => {
              return <ItemsView categories={categories} {...props} lightmode={lightMode} />
            }} />
            <Route path="/">
              <Redirect to="/items" />
            </Route>
          </Switch>
        </HashRouter>
      </StyledLayout>
    );
  }
}

function mapStateToProps(state) {
  const { userInfo, categories, filter } = state;
  const { email, firstName, lastName, lightMode, isFetchingUser } = userInfo || { email: '', firstName: '', lastName: '', lightMode: 'true', isFetchingUser: true }
  const { byId, allIds, isFetchingCategories } = categories || { byId: {}, allIds: [], isFetchingCategories: true }
  const { filterType, categoryId } = filter || { filterType: 'All Items', categoryId: null }

  return {
    userInfo: {
      email,
      firstName,
      lastName,
      lightMode,
      isFetchingUser
    },
    categories: {
      byId,
      allIds,
      isFetchingCategories
    },
    filter: {
      filterType,
      categoryId
    }
  }
}

export default connect(mapStateToProps)(LoggedInView);