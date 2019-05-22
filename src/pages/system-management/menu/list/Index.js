import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  InputNumber,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Badge,
  Popconfirm,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../../List/TableList.less';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
@Form.create()
class MenuList extends PureComponent {
  state = {
    selectedRows: [],
    expandForm: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetch',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'menu/fetch',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAdd = () => {
    router.push('/system-management/menu/add');
  };

  handleEdit = record => {
    router.push('/system-management/menu/edit/' + record.id);
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/delete',
      payload: record.id,
    });
  };
  columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '序号',
      dataIndex: 'sort',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEdit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="你确定要删除此记录吗?"
            onConfirm={() => this.handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  render() {
    const {
      menu: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="batchRemove">批量删除</Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" size="large" onClick={() => this.handleAdd()}>
                新增
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button icon="more" type="primary" size="large">
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              bordered
              rowKey="id"
              size="small"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MenuList;
