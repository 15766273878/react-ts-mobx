import React from 'react'
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom'
import { Provider } from 'mobx-react'
import stores from '@/store'
import SecurityLayout from '@/layout/SecurityLayout'
import Other from '@/page/other'

class Layout extends React.Component {
  public readonly state = {}

  public render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <Link to="/main">主要</Link>
          {`                        `}
          <Link to="/other">其他</Link>
          <Switch>
            <Route exact path="/" component={() => <Redirect to="/main" />} />
            <Route path="/main" component={SecurityLayout} />
            <Route path="/other" component={Other} />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default Layout
