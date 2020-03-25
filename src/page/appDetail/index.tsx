import React from 'react'
import { Button } from 'antd'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'

interface IBase extends RouteComponentProps<{}> {
  Test: any
}

@inject('Test')
@observer
class App extends React.Component<IBase, {}> {
  public readonly state = {}

  public render() {
    console.log(this.props)
    return (
      <div>
        <h5>{JSON.stringify(this.props.Test.userInfo)}</h5>
        <Button
          onClick={() => {
            this.props.Test.resest()
          }}
          type="primary"
        >
          点击清零{this.props.Test.timer}
        </Button>
      </div>
    )
  }
}

export default App
