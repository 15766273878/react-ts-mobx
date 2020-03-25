import React from 'react';
import { Tag } from 'antd';
import { UserOutlined, FolderOutlined } from '@ant-design/icons';
import styles from './index.less';

export default class User extends React.Component {
  state = {
    type: {
      user: <UserOutlined />,
      dept: <FolderOutlined />,
    },
  };

  render() {
    const { name, type, onClose } = this.props;
    return (
      <Tag
        closable={onClose && onClose instanceof Function}
        className={styles.orgTag}
        onClose={onClose}
      >
        {this.state.type[type]}
        {name}
      </Tag>
    );
  }
}
