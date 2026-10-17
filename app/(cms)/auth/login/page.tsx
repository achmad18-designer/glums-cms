"use client";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';
import { LoginType } from './types/login.type';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from './hooks/useLoginMutation';
import axios from 'axios';

export default function LoginPage() {
    const router = useRouter();
    const loginMutation = useLoginMutation();

    const onFinish = (values: LoginType) => {
        loginMutation.mutate(values, {
            onSuccess: (response) => {
                message.success(
                    response.message || "Login successful"
                );

                router.replace("/cms/dashboard");
            },

            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    message.error(
                        error.response?.data?.message ||
                        "Login failed. Please try again."
                    );
                    return;
                }

                message.error("An unexpected error occurred");
            },
        });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Card
                title="Glums ID"
                variant="borderless"
                className='text-center'
                style={{ width: 400 }}
            >
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
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

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div >
    );
}
