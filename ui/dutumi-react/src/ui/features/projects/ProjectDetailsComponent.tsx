import {
    Button, Card,
    Col,
    Divider,
    List,
    Modal,
    Row,
    Spin, Statistic
} from 'antd';

import '../../../css/business.css';
import React, {useEffect, useState} from 'react';
import {
    BankOutlined,
    CalendarOutlined, ExportOutlined, PauseCircleOutlined,
    PlayCircleOutlined, TagsOutlined, TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {UndoOutlined} from "@ant-design/icons";
import {notifyHttpError} from "../../../services/notification/notifications";
import {getRequest} from "../../../services/rest/RestService";
import customerLoadingIcon from "../../templates/Loading";
import {Business} from "../../../interfaces/businesses/BusinessInterfaces";
import sectionIcon from "../../../assets/images/icons/subscription.png"
import {useNavigate, useParams} from "react-router-dom";
import GoodLabelValueWidget from "../../templates/GoodLabelValueWidget";
import {BsBuilding} from "react-icons/bs";
import GoodContentCardPlain from "../../templates/cards/GoodContentCardPlain";
import BranchesComponent from "../businesses/components/BusinessBranchesComponent";
import BusinessStaffComponent from "../businesses/components/BusinessStaffComponent";
import BusinessSubscriptionsComponent from "../businesses/components/BusinessSubscriptionsComponent";

const ProjectDetailsComponent = () => {

    const {businessId} = useParams();

    const [business, setBusiness] = useState<Business>();
    const [businessSchema, setBusinessSchema] = useState<String>();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedSubscription, setSelectedSubscription] = useState<Business | null>();
    const [isSubscriptionVisible, setSubscriptionsModalVisible] = useState(false);
    const navigate = useNavigate();


    //Fetch products
    useEffect(() => {
        fetchBusinessesDetails();
    }, []);

    const fetchBusinessesDetails = () => {
        const url = `/api/v1/manage/businesses/details?id=${businessId}`;
        console.log(`fetching businesses details... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                setBusiness(response.data.respBody);
                setBusinessSchema(response.data.respBody.schemaName);
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const isActive = () => {
        return business?.status == 'ACTIVE_LICENCE';
    }

    const showSuspensionForm = (action: string) => {
    }

    const viewUser = () => {
        navigate(`/users/${business?.owner?.id}`);
    }

    const viewProducts = () => {
        navigate(`/businesses/products/${business?.id}?sc=${businessSchema}`);
    }

    const viewOrders = () => {
        navigate(`/businesses/orders/${business?.id}?sc=${businessSchema}`);
    }

    return <GoodContentCardPlain title="Project Details"
                                 iconImage={sectionIcon}
                                 extraHeaderItems={[
                                     isLoading && <Spin key={"spin"} indicator={customerLoadingIcon}></Spin>,
                                     <Button style={{marginRight: 16}} icon={<UndoOutlined/>} onClick={() => {
                                         fetchBusinessesDetails();
                                     }} key="2" type="default">Refresh</Button>,
                                     //  <Button href="/products/instance/new" key="1" type="primary">Add Order</Button>
                                 ]}>

        <Row gutter={16} style={{marginTop: '32px', marginBottom: '12px'}}>
            <Col span={6}>
                <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Issues" value={(business?.stats?.usersCount ?? 0).toLocaleString()}
                               prefix={<UserOutlined/>}/>
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Features" value={(business?.stats?.branchesCount ?? 0).toLocaleString()}
                               prefix={<BankOutlined/>}
                               suffix={``} />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false} style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Releases" value={(business?.stats?.usersCount ?? 0).toLocaleString()}
                               prefix={<TeamOutlined/>}
                               suffix={``} />
                </Card>
            </Col>
            <Col span={6}>
                <Card onClick={viewProducts}
                      bordered={false}
                      style={{border: '1px solid #e3d5ca'}}>
                    <Statistic title="Products" value={(business?.stats?.products ?? 0).toLocaleString()}
                               prefix={<TagsOutlined/>}
                               suffix=""/>
                </Card>
            </Col>
        </Row>


        {/***---------------------------
         /* Branches
         **-----------------------------*/}
        <Row style={{marginTop: '64px'}}>
            <Col span={12}>
                <BranchesComponent business={business}></BranchesComponent>
            </Col>

            <Col span={12}>
                <BusinessStaffComponent business={business}></BusinessStaffComponent>
            </Col>
        </Row>

        {/***---------------------------
         /* Subscriptions
         **-----------------------------*/}
        <Row style={{marginTop: '64px'}}>
            <Col span={24}>
                <BusinessSubscriptionsComponent business={business}></BusinessSubscriptionsComponent>
            </Col>
        </Row>


        {/***------------------------------
         /*  Subscription Details
         ***------------------------------*/}
        <Modal title="Subscription Details"
               open={isSubscriptionVisible}
               footer={<></>}
               onCancel={() => {
                   setSubscriptionsModalVisible(false)
               }}>

            <List>
                <List.Item key="1">
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Phone</p>}
                    />
                    <div>
                        {selectedSubscription?.phoneNumber}
                    </div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Topic</p>}/>
                    <div>{selectedSubscription?.name ?? 'Unknown'}</div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>Start Date</p>}/>
                    <div>{selectedSubscription?.startDate ?? 'Unknown'}</div>
                </List.Item>
                <List.Item key="2" style={{margin: '0px', padding: '0px'}}>
                    <List.Item.Meta
                        title={<p style={{fontWeight: 'lighter', padding: '0px', margin: '0px'}}>End Date</p>}/>
                    <div>{selectedSubscription?.endDate ?? 'Unknown'}</div>
                </List.Item>
            </List>
            <Divider/>

            <h3 style={{marginTop: '48px'}}>Transactions</h3>
            <div style={{border: '1px solid #f1f1f1', padding: '8px 16px'}}>
                <List
                    dataSource={selectedSubscription?.transactions}
                    renderItem={(transaction) => (
                        <List.Item key={transaction.id} style={{margin: '0px', padding: '0px'}}>
                            <List.Item.Meta
                                title={<p>{transaction?.amount} TZS</p>}
                                description={`${transaction.paymentMethodId} ${transaction.channel}`}
                            />
                            <div>{transaction?.createdDate}</div>
                        </List.Item>
                    )}
                />
            </div>

        </Modal>


    </GoodContentCardPlain>;

}

export default ProjectDetailsComponent

