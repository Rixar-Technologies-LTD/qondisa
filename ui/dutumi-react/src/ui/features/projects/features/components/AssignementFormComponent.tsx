import {
    DatePicker,
    Form, Image, Input,
    Modal, Select, Space,
} from 'antd';
import React, {useEffect, useState} from 'react';

import TextArea from "antd/es/input/TextArea";
import {getRequest, postRequest} from "../../../../../services/rest/RestService";
import {notifyHttpError, notifySuccess} from "../../../../../services/notification/notifications";

import sectionIcon from "../../../../../assets/images/icons/users/owner.png"
import {Member, Task} from "../../../../../interfaces/projects/ProjectsInterfaces";


interface Props {
    isVisible: boolean;
    projectId: string;
    title: string ;
    featureId?: string | null;
    onSaveCompleted: () => void;
    onCancelled: () => void;

}


const AssignmentForm = (featureFormProps:Props) => {

    const [membersList, setMembersList] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [featureForm] = Form.useForm();

    //Fetch products
    useEffect(() => {
        fetchProjectMembers();
    }, []);

    const fetchProjectMembers = () => {
        const url = `/api/v1/projects/members?projectId=${featureFormProps.projectId}`;
        console.log(`fetching members... ${url}`)
        setIsLoading(true);
        getRequest(url)
            .then((response) => {
                console.log(response.data);
                setMembersList(response.data.respBody.data)
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
            setIsLoading(false);
        })
    }

    const addMember = (item: any) => {

        const url:string ='/api/v1/projects/members/add';
        setIsLoading(true);
        postRequest(url,{
            "featureId" : featureFormProps.featureId,
            ...item
        })
            .then((response) => {
                console.log(response.data.payload);
                notifySuccess("Record Saved")
                featureFormProps.onSaveCompleted();
            })
            .catch((errorObj) => {
                notifyHttpError('Operation Failed', errorObj)
            }).finally(() => {
               setIsLoading(false);
         })
    }

    const modalTitle = (
        <Space>
            <div className="bg-light" style={{padding:'4px',borderRadius:'4px', border:'1px solid #8a8a8a'}}>
                <Image width={28} src={sectionIcon}></Image>
            </div>
            {featureFormProps.title}
        </Space>
    );


    return <>

        {/***------------------------------
         /*  Feature
         ***------------------------------*/}
        <Modal title={modalTitle}
               open={featureFormProps.isVisible}
               width="640px"
               onOk={() => {
                   featureForm.submit()
               }}
               confirmLoading={isLoading}
               okText="Save"
               onCancel={() => {
                   featureFormProps.onCancelled();
               }}>

            <Form
                form={featureForm}
                layout="vertical"
                onFinish={addMember}
            >

                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>


                <Form.Item
                    style={{ marginTop: '24px'}}
                    label="Member"
                    name="userId"
                >
                    <Select
                        style={{width: '100%'}}
                        options={membersList.map((member) => ({label: member.user?.name, value: member.user.id}))}
                    />
                </Form.Item>

                <Form.Item
                    style={{ marginTop: '24px'}}
                    label="Member"
                    name="userId"
                >
                    <Select
                        style={{width: '100%'}}
                        options={membersList.map((member) => ({label: member.user?.name, value: member.user.id}))}
                    />
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 16, marginTop: '16px'}}
                    label="Remark"
                    name="remark"
                >
                    <TextArea showCount/>
                </Form.Item>


            </Form>
        </Modal>

    </>;

}

export default AssignmentForm

