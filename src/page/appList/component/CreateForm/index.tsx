import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { isRight } from '@/utils/util'

interface Values {
  title: string
  description: string
  modifier: string
}

interface initValue {
  name: string
  person: string
  admin: string
}

interface Props {
  visible: boolean
  initVal: initValue
  onCreate: (values: Values) => void
  onCancel: () => void
}

const CreateForm: React.FC<Props> = ({ visible, initVal, onCreate, onCancel }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(initVal)
  }, [initVal])

  return (
    <Modal
      visible={visible}
      maskClosable={false}
      title="创建报表应用"
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} name="form_in_modal" labelCol={{ span: 5 }}>
        <Form.Item
          name="name"
          label="应用名称"
          rules={[
            {
              required: true,
              message: '请输入应用名称',
              validator: (rule, value) => {
                return isRight(value) ? Promise.resolve() : Promise.reject(rule.message)
              }
            }
          ]}
        >
          <Input maxLength={10} placeholder="输入应用名称" />
        </Form.Item>
        <Form.Item
          name="person"
          label="创建人"
          rules={[
            {
              required: true,
              message: '请选择创建人',
              validator: (rule, value) => {
                return isRight(value) ? Promise.resolve() : Promise.reject(value)
              }
            }
          ]}
        >
          <Input placeholder="输入创建人" />
        </Form.Item>
        <Form.Item
          name="admin"
          label="管理员"
          rules={[
            {
              required: true,
              message: '请选择管理员',
              validator: (rule, value) => {
                return isRight(value) ? Promise.resolve() : Promise.reject(value)
              }
            }
          ]}
        >
          <Input placeholder="请选择管理员" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateForm
