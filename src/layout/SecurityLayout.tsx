import React from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'

import { Menu } from 'antd'
import AppList from '@/page/appList'
import appDetail from '@/page/appDetail'
import Setting from '@/page/setting'
import { pathToRegexp } from 'path-to-regexp'

import './SecurityLayout.less'

class SecurityLayout extends React.Component {
  public readonly state = {
    current: '',
    menus: [
      {
        path: '/main/appList',
        name: '应用中心',
        key: 'appList'
      },
      {
        path: '/main/setting',
        name: '配置中心',
        key: 'setting'
      }
    ]
  }

  public componentDidMount() {
    const pathname = window.location.pathname
    const value = pathToRegexp(pathname).exec('/main/setting') ? 'setting' : 'appList'

    this.setState({
      current: value
    })
  }

  public render() {
    const { current, menus } = this.state
    return (
      <div>
        <div className="tab">
          <Menu selectedKeys={[current]} mode="horizontal">
            {menus.map((item) => (
              <Menu.Item
                className="tab-item"
                key={item.key}
                onClick={(e) => {
                  this.setState({
                    current: e.key
                  })
                }}
              >
                <Link to={item.path}>{item.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <Switch>
          <Route exact path="/main" component={() => <Redirect to="/main/appList" />} />
          <Route path="/main/appList" component={AppList} />
          <Route path="/main/appDetail" component={appDetail} />
          <Route path="/main/setting" component={Setting} />
        </Switch>
      </div>
    )
  }
}

export default SecurityLayout
