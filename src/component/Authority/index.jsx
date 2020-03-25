import React, { useState } from 'react';
import { Tag, Icon, Modal, Button, Checkbox } from 'antd';
import styles from './index.less';

const iconFormat = {
  robot: <Icon type="android" />,
  task: <Icon type="schedule" />,
  member: <Icon type="cluster" />,
  share: <Icon type="share-alt" />,
  count: <Icon type="bar-chart" />,
  jmqLogin: <Icon type="project" />,
  robotLogin: <Icon type="appstore" theme="filled" />,
};

const Auth = props => {
  const { info, mode } = props;

  const [visible, setVisible] = useState(false);

  function getClassify() {
    return info.map(item => (
      <div className="auth-group" key={item.title}>
        <div className="auth-group-title">{item.title}</div>
        <div>
          {item.data.map(opt => (
            <Tag className={styles.authTag} key={opt.key} color="cyan">
              {iconFormat[opt.key]}
              <span className="auth-group-name">{opt.name}</span>
            </Tag>
          ))}
        </div>
      </div>
    ));
  }

  function handleOk() {
    setVisible(false);
  }

  function getAllAuth() {
    return info.reduce((arr, item) => {
      item.data.forEach(opt => arr.push(opt));
      return arr;
    }, []);
  }

  function checkboxChange(name, item) {
    console.log(name, item);
  }

  function renderCheckBox() {
    const checkboxs = getAllAuth().map(item => (
      <div key={item.key} className={styles.checkboxItem}>
        <div className="wrap-content">
          {iconFormat[item.key]}
          <span>{item.name}</span>
        </div>
        <span className="check-content">
          <Checkbox
            value="login"
            onChange={e => {
              checkboxChange(e.target.value, item);
            }}
          />
        </span>
        <span className="check-content">
          <Checkbox
            value="view"
            onChange={e => {
              checkboxChange(e.target.value, item);
            }}
          />
        </span>
        <span className="check-content">
          <Checkbox
            value="manage"
            onChange={e => {
              checkboxChange(e.target.value, item);
            }}
          />
        </span>
      </div>
    ));
    checkboxs.unshift(
      <div className={styles.checkboxItem} style={{ height: '20px', paddingBottom: '15px' }}>
        <div className="wrap-content" />
        <span className="check-content">登录</span>
        <span className="check-content">查看</span>
        <span className="check-content">管理</span>
      </div>,
    );
    return checkboxs;
  }

  return (
    <div className={styles.container}>
      {!info.length ? <div>具有所有功能的操作权限</div> : <div>{getClassify()}</div>}
      {mode === 'edit' ? (
        <div
          onClick={() => {
            setVisible(true);
          }}
          className={`${styles.green} ${styles.setAuth}`}
        >
          分配权限
        </div>
      ) : null}

      <Modal
        visible={visible}
        title="设置功能权限"
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisible(false);
            }}
          >
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        {renderCheckBox()}
      </Modal>
    </div>
  );
};

export default Auth;
