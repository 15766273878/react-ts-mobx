import { observable, action } from 'mobx'

class Test {
  @observable public userInfo = {}
  @observable public timer = 0
  public constructor() {
    setInterval(() => {
      this.timer += 1
    }, 1000)
  }

  @action public async resestTime() {
    this.timer = 0
  }
  @action public async setUserInfo() {
    this.userInfo = {
      name: '随机' + Math.random(),
      time: new Date()
    }
  }
}

export default Test
