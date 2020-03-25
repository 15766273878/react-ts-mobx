import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Spin } from 'antd'
import { PlusOutlined, SettingFilled, DragOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { inject, observer } from 'mobx-react'
import CreateForm from './component/CreateForm'
import { Test } from '@/store'
interface Props {
  Test: Test
}

function App(props: Props) {
  let formRef = null

  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [apps, setApps] = useState<object[]>([])
  const [detail, setDetail] = useState<object>({})
  const [initVal, setInitVal] = useState<any>({})

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setApps([
        {
          id: '12',
          name: '资产管理',
          person: '邓桂红',
          admin: '超级高',
          icon:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585042054996&di=e4003d64b36b27a08b7382c1e6b03f4b&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F21%2F09%2F01200000026352136359091694357.jpg'
        },
        {
          id: '36',
          name: 'gw3管理',
          person: '邓32',
          admin: '532',
          icon:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585042054996&di=e4003d64b36b27a08b7382c1e6b03f4b&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F21%2F09%2F01200000026352136359091694357.jpg'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  function modify(item: any) {
    setDetail(item)
    setInitVal({
      name: item.name || '',
      person: item.person || '',
      admin: item.admin || ''
    })
    setVisible(true)
  }

  function confirmSave(value: any) {
    console.log(value)
    setVisible(false)
  }

  return (
    <div>
      <div>{JSON.stringify(props.Test.userInfo)}</div>
      <div className={styles.list}>
        <div
          className="item add"
          onClick={() => {
            modify({})
          }}
        >
          <div className="content">
            <PlusOutlined className="icon" />
            <span className="name">创建报表应用</span>
          </div>
        </div>
        <Spin spinning={loading} size="large">
          {apps.map((item: any, index: number) => (
            <div className="item" key={index}>
              <div className="content">
                <img className="icon" src={item.icon} alt="" />
                <span className="name">{item.name}</span>
              </div>
              <div className="foot">
                <div className="left">
                  <Button shape="round">
                    <Link to={`/main/appDetail?id=${item.id}`}>管理应用</Link>
                  </Button>
                </div>
                <div className="right">
                  <SettingFilled
                    onClick={() => {
                      modify(item)
                    }}
                  />
                  <DragOutlined
                    onClick={() => {
                      console.log(props)
                      props.Test.setUserInfo()
                    }}
                    className="drag"
                  />
                </div>
              </div>
            </div>
          ))}
        </Spin>
        <CreateForm
          visible={visible}
          initVal={initVal}
          onCreate={confirmSave}
          onCancel={() => {
            setVisible(false)
          }}
        />
      </div>
    </div>
  )
}

export default inject('Test')(observer(App))
