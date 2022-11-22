import {useState, useEffect, useRef} from 'react';
import {Button, Card, Input,  Typography, message} from 'antd';
import { UserOutlined , EyeOutlined,EyeInvisibleOutlined, KeyOutlined} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
const error = () => {
    message.error('Ýalnyş maglumat');
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const ref = useRef()

    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    }

    const handleSubmit = async ()=>{
        
        try {
            
            await axios({
                method: "POST",
                url: `${config}/api/v1/auth/login`,
                data: {
                    username, 
                    password
                },
                withCredentials: true
            })
            window.location.reload();
        } catch (error) {
            console.error(error)
            ref.current.click()    
        }

        
    }
    useEffect( ()=>{
        document.title='Içeri gir | Matematikadan elektron sozluk'
    },[] )

    return (
        <div className="site-card-border-less-wrapper">
            <Card title="Içeri gir" bordered={false} style={{ width: 600 }}>
                <Input 
                    onChange={e=>setUsername(e.target.value)}
                    value={username}
                    placeholder='Ulanyjyň ady' minLength={4} maxLength={30} showCount prefix={<UserOutlined />} size="large" autoComplete="off" />
                <br />
                <br/>
                <Input 
                    onChange={e=>setPassword(e.target.value)}
                    value={password}
                    placeholder='Açar sözi' 
                    maxLength={30} 
                    prefix={<KeyOutlined />} 
                    autoComplete="false"
                    size="large" 
                    suffix={showPassword ? <EyeOutlined onClick={togglePassword} />: <EyeInvisibleOutlined  onClick={togglePassword} />} 
                    type={ showPassword ? 'password': 'text' }

                />
                <br />
                <br/>
                
                <div style={{display:'flex', alignItems:'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography.Link href="/" >Esasy sahypa geç</Typography.Link>
                    <Button 
                        type='primary' 
                        size='large'
                        style={{cursor: 'pointer'}} 
                        disabled={username.length === 0 || password.length === 0}    
                        onClick={handleSubmit}
                    >Login</Button>
                    <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>
                    
                </div>
            </Card>
        </div>
        
    );
}

export default Login;
