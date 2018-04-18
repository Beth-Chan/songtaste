import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink } from "react-router-dom";
import Recommend from "./recommend/Recommend";
import Ranking from "./ranking/Ranking";
import Search from "./search/Search";
import Player from "../container/Player"
import logo from '../assets/img/logo.png';
import '../assets/stylus/reset.styl';
import '../assets/stylus/font.styl';
import './app.styl';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          {/* header包括logo和应用名 */}
          <header className="app-header">
            <img src={logo} className="app-logo" alt="logo"/>
            <h1 className="app-title">Songtaste</h1>
          </header>
          {/* 三个Tab导航栏，默认是推荐页 */}
          <div className="music-tab">
            <div className="tab-item selected"> 
              <NavLink to="/recommend" className="nav-link">
                <span>推荐</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/ranking" className="nav-link">
                <span>排行榜</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/search" className="nav-link">
                <span>搜索</span>
              </NavLink>
            </div>
          </div>
           {/* 配置路由 */}
          <div className="music-view">
            {/*
              Switch组件是 React-Router v4版本中新添加的，主要用来做路由唯一匹配的功能。多个Route必须用Switch包裹，就是在多个路由中只匹配其中一个路由。
            */}
            <Switch>
              <Route path="/recommend" component={Recommend} />
              <Route path="/ranking" component={Ranking} />
              <Route path="/search" component={Search} />
              {/* 默认路由可以用根路径重定向到推荐页 */}
              <Redirect from="/" to="/recommend" />
              <Route component={Recommend} />  
            </Switch>
          </div>
          {/* 任何路由都可以播放，切换路由不会影响播放器的播放，所以要定义在App.js下 */}
          <Player/>
        </div>
      </Router>
    );
  }
}

export default App;
