"use client";
import { LoginType } from '@/app/(cms)/auth/login/types/login.type';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';

export default function RegisterPage() {
    const onFinish = (values: LoginType) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Card
                title="Glums ID - Register"
                className='text-center'
                variant="borderless"
                style={{ width: 400 }}
            >
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input prefix={<UserOutlined />} type="email" placeholder="email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item
                        name="passwordConfirm"
                        rules={[{ required: true, message: 'Please input your Password Confirm!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="passwordConfirm" placeholder="passwordConfirm" />
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div >
    );
}
