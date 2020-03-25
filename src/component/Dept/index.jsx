/* eslint-disable no-param-reassign */
import React from 'react';
import { Input, Spin, Modal, Button, Layout, Empty, Tag } from 'antd';
import { UserOutlined, FolderOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import Tree from '@/components/Tree';
import { debounce } from '@/utils/utils';
import {
  updateTreeData,
  onLoadData,
  formatTreeData,
  getDeptList,
  getUserList,
  findItem,
} from '@/components/Tree/util.js';
import styles from './index.less';

const { Content, Sider } = Layout;
const { Search } = Input;

class Dept extends React.Component {
  state = {
    selected: [],
    loading: true,
    treeData: [],
  };

  componentWillMount() {
    this.setState({
      selected: this.props.value,
    });
    this.initTree();
  }

  componentWillReceiveProps(state) {
    if (state.visible) {
      this.setState({
        selected: this.props.value,
      });
    }
  }

  onSearch = debounce(keyword => {
    const { orgId, dispatch, type } = this.props;
    if (!keyword) {
      this.initTree();
    } else {
      this.setState({
        loading: true,
      });
      dispatch({
        type: 'member/search',
        payload: {
          org_id: orgId,
          keyword,
        },
      }).then(res => {
        let treeData = [];
        if (res) {
          treeData = formatTreeData(res.data.departments);
          if (type === 'all') {
            const users = formatTreeData(res.data.persons);
            treeData = treeData.concat(this.formatUserList(users));
          }
        }
        this.setState({
          loading: false,
          treeData,
        });
      });
    }
  });

  get selectedKeys() {
    const { selected } = this.state;
    const keys = selected.map(item => item.u_id);
    return keys;
  }

  handleVisible = visible => {
    this.props.handleVisible(visible);
  };

  confirm = async () => {
    const { selected } = this.state;
    this.handleVisible(false);
    this.props.onChange(selected);
  };

  // 初始化两级部门树
  initTree = async () => {
    const { type } = this.props;
    this.setState({
      loading: true,
    });
    const data = await getDeptList();
    let rootChild = await getDeptList(data[0].u_id);
    if (type === 'all') {
      const users = await getUserList(data[0].u_id);
      // 追加人员
      const userList = this.formatUserList(users);
      rootChild = rootChild.concat(userList);
    }

    data[0].children = rootChild;
    this.setState({ treeData: data, loading: false });
  };

  // 更新指定部门下的子部门
  updateTree = async key => {
    let children = await getDeptList(key);

    const { type } = this.props;
    if (type === 'all') {
      // 追加人员
      const users = await getUserList(key);
      const userList = this.formatUserList(users);
      children = children.concat(userList);
    }

    const { treeData } = this.state;
    const afterUpdate = updateTreeData(treeData, key, children);
    this.setState({
      treeData: afterUpdate,
    });
  };

  formatUserList = data =>
    data.map(item => {
      item.icon = <UserOutlined />;
      item.isLeaf = true;
      return item;
    });

  handleClick = (selectedKeys, e) => {
    const { treeData, selected } = this.state;
    const { max } = this.props;

    const nodeKey = e.node.props.eventKey;

    const index = selected.findIndex(item => item.u_id === nodeKey);
    if (index === -1) {
      if (max && selected.length === max) {
        return;
      }
      selected.push(findItem(treeData, nodeKey));
    } else {
      selected.splice(index, 1);
    }

    this.setState({
      selected,
    });
  };

  handleClose = tag => {
    const { selected } = this.state;
    const index = selected.findIndex(item => item.u_id === tag.u_id);
    selected.splice(index, 1);
    this.setState({
      selected,
    });
  };

  render() {
    const { visible, type, max } = this.props;
    const { selected, loading, treeData } = this.state;
    return (
      <Modal
        className={styles.modalCon}
        maskClosable={false}
        title={type === 'all' ? '部门 / 人员选择' : '部门选择'}
        visible={visible}
        onCancel={() => {
          this.handleVisible(false);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              this.handleVisible(false);
            }}
          >
            取 消
          </Button>,
          <Button type="primary" key="submit" onClick={this.confirm}>
            确定
          </Button>,
        ]}
      >
        <Layout className={styles.deptLayout}>
          <Sider theme="light" className={styles.sider}>
            <div className={styles.left}>
              <div className="title-content">
                <Search
                  placeholder={formatMessage({ id: 'member.search.placeholder.dept.person' })}
                  onChange={e => {
                    e.persist();
                    this.onSearch(e.target.value);
                  }}
                />
              </div>
              <Spin spinning={loading}>
                {!loading ? (
                  <Tree
                    multiple
                    defaultSelectedKeys={this.selectedKeys}
                    selectedKeys={this.selectedKeys}
                    loadData={treeNode => onLoadData(treeNode, key => this.updateTree(key))}
                    treeData={treeData}
                    onSelect={this.handleClick}
                  />
                ) : null}

                {!treeData.length && !loading ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : null}
              </Spin>
            </div>
          </Sider>
          <Content className={styles.right}>
            <div className="title">已选择的成员 / 部门{max ? `(最多可选 : ${max})` : ''}</div>
            <div className="tagContain">
              {selected.map(tag => (
                <Tag
                  key={tag.u_id}
                  closable
                  onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                  }}
                >
                  {tag.nodeType === 'dept' ? <FolderOutlined /> : <UserOutlined />}
                  <span className="name">{tag.name}</span>
                </Tag>
              ))}
            </div>
          </Content>
        </Layout>
      </Modal>
    );
  }
}

Dept.defaultProps = {
  type: 'all',
  value: [],
  max: 0,
};

export default connect(params => ({
  hasUpdated: params.member.hasUpdated,
  updatedKey: params.member.updatedKey,
  orgId: params.member.orgId,
}))(Dept);
