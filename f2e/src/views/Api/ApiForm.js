/* global http */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Hotkeys from 'react-hot-keys';
import { Form, Input, Switch, Button, Select, message } from 'antd';
import './style.scss';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class ApiForm extends Component {
  state = {
    submitLoading: false
  }
  onKeyDown(keyName, e, handle) {
    e.cancelBubble = true;
    e.preventDefault();
    this.handleSubmit(e);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, formData) => {
      if (!err) {
        this.setState({
          submitLoading: true
        });
        const submitForm = { ...formData };
        submitForm.project = this.props.pid;
        submitForm.mockRule = this.props.getApiRule();
        // alert(JSON.stringify(submitForm));
        const resp = await http.post('/api/api/add', submitForm);
        this.setState({
          submitLoading: false
        });
        if (resp.success) {
          let actionType = this.props.apiModalType === 'add' ? '添加' : '修改';
          message.success(`${actionType}成功`);
          setTimeout(() => {
            if (this.props.apiModalType === 'add') this.props.closeModal();
            this.props.refreshList();
          }, 800);
        }
      }
    });
  }
  componentDidMount() {
    if (this.props.editApiFormData) {
      const data = Object.assign({}, this.props.editApiFormData);
      this.props.form.setFieldsValue({
        id: data.id,
        name: data.name,
        method: data.method,
        url: data.url,
        description: data.description,
        on: data.on / 1 === 1
      });
    } else {
      this.props.form.setFieldsValue({ id: null, on: true });
    }
  }
  validBaseUrl = (rule, value, callback) => {
    if (/^\/[^\s]*[^/]$/.test(value)) {
      callback();
    } else {
      callback('接口地址必须以斜杠开头不能以斜杠结尾且不能包含空格如：“/api/:id'); // eslint-disable-line
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Hotkeys
        keyName="ctrl+s,command+s"
        filter={(event) => {
          return true;
        }}
        onKeyDown={this.onKeyDown.bind(this)}>
        <Form onSubmit={this.handleSubmit} className="modal-form">
          <FormItem label="">
            {getFieldDecorator('id', {
              initialValue: null,
              rules: [{ required: false }]
            })(
              <Input type="hidden" placeholder="接口名" />
            )}
          </FormItem>
          <FormItem label="接口名">
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [{ required: true, message: '请填写接口名' }]
            })(
              <Input autoComplete="off" placeholder="接口名" />
            )}
          </FormItem>
          <FormItem label="请求类型（method）">
            {getFieldDecorator('method', {
              rules: [{ required: true, message: '请填写项目名称' }]
            })(
              <Select placeholder="请求类型">
                <Option key="get">get</Option>
                <Option key="post">post</Option>
                <Option key="delete">delete</Option>
                <Option key="put">put</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="url">
            {getFieldDecorator('url', {
              rules: [{ required: true, message: '请填写接口url' }, { validator: this.validBaseUrl }]
            })(
              <Input autoComplete="off" placeholder="接口地址（如：/api/user）" />
            )}
          </FormItem>
          <FormItem label="接口描述">
            {getFieldDecorator('description', {
              rules: [{ required: false, message: '请填写接口描述' }]
            })(
              <TextArea placeholder="项目描述" />
            )}
          </FormItem>
          <FormItem label="Mock状态">
            {getFieldDecorator('on', { valuePropName: 'checked' })(
              <Switch checkedChildren="开" unCheckedChildren="关" />
            )}
          </FormItem>
          <FormItem style={{ marginTop: '15px', textAlign: 'center' }}>
            <Button style={{ width: '120px' }} loading={this.state.submitLoading} type="primary" htmlType="submit">
              保&emsp;存
            </Button>
          </FormItem>
        </Form>
      </Hotkeys>
    );
  }
};
const ApiFormWithRouter = withRouter(ApiForm);
export default ApiFormWithRouter;
