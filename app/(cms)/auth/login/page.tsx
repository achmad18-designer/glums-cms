"use client";
import { getErrorMessage } from '@/utils/getErrorMessage';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from './hooks/useLoginMutation';
import { LoginType } from './types/login.type';

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
            }
        });
    };

    return (
        <div className="flex flex-col gap-2 items-center justify-center h-screen">
            <Card
                title="Glums ID"
                variant="borderless"
                className='text-center'
                style={{ width: 400 }}
            >
                {loginMutation.isError && (
                    <Alert
                        type='error'
                        description={getErrorMessage(loginMutation.error)}
                        variant='outlined'
                        styles={{
                            root: {
                                padding: '4px 8px',
                                marginBottom: 16
                            }
                        }}
                    />
                )}

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
